// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {UD60x18, unwrap, wrap, toUD60x18} from "@prb/math/UD60x18.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import "./DuchLiquidator.sol";
import "./DuchCoordinator.sol";
import "./libraries/Errors.sol";

/**
 * @title DuchLoanAuction: NFT-collateralized lending
 * @author Josh Guha @ ETHGlobal Tokyo 2023
 * @notice Contract for securitising NFT-collateralized loans and
 *         selling them at optimal market prices via a market-clearing Dutch auction
 * @notice Lenders compete to purchase distribution units of debt
 * @notice Though the market is cleared by the interest rate rising over time the auction is still
 *         Dutch (descending price) because the price of future repayment income in terms of
 *         present lending income decreases over time
 * @notice This project was inspired by a podcast on NFT auctions by a16z
 *         https://web3-with-a16z.simplecast.com/episodes/auction-design-mechanisms-incentives-choices-tradeoffs
 * @dev Built using Superfluid IDAs for loan repayment
 * @dev The loan is denominated and paid in a Superfluid SuperToken
 */

contract DuchLoanAuction is ERC20Burnable {
    /// @notice SuperToken Library
    using SuperTokenV1Library for ISuperToken;

    // State ------------------------------------------
    // Collateral
    address nftCollateralAddress;
    uint256 nftCollateralTokenId;

    State public state;

    // Auction
    uint256 public immutable auctionStartTime;
    uint256 public immutable auctionDuration;
    UD60x18 public immutable principal;
    UD60x18 public immutable k;

    // During auction phase, this represents amount of debt raised from bidders
    // During loan phase, this represents maturity value of loan (principal + interest)
    UD60x18 public debt;

    // Loan
    uint256 public immutable loanTerm;
    ISuperToken public immutable denominatedToken;
    address public immutable debtor;
    uint256 loanEndTime;

    /// @notice SuperToken Library
    uint32 public constant INDEX_ID = 0;

    // Contracts
    DuchLiquidator liquidator;
    DuchCoordinator private immutable coordinator;

    // Events ------------------------------------
    event Bid(address indexed bidder, UD60x18 amount, UD60x18 debtRaised);
    event AuctionUnsuccessful();
    event LoanStarted(
        UD60x18 iRatePerSecond,
        UD60x18 principal,
        UD60x18 totalInterest,
        UD60x18 maturityLoanValue
    );
    event LoanPaid();
    event LiquidationStarted();
    event LiquidationPaid(UD60x18 liquidationValue);

    // Modifiers
    modifier onlyAuctionPhase() {
        require(state == State.AuctionPhase, Errors.ONLY_AUCTION_PHASE);
        _;
    }

    modifier onlyLoanPhase() {
        require(state == State.LoanPhase, Errors.ONLY_LOAN_PHASE);
        _;
    }

    modifier onlyLiquidationPhase() {
        require(state == State.LiquidationPhase, Errors.ONLY_LIQUIDATION_PHASE);
        _;
    }

    // Enums
    enum State {
        AuctionPhase,
        AuctionUnsuccessful,
        LoanPhase,
        LoanPaid,
        LiquidationPhase,
        LiquidationPaid
    }

    // Constructor -------------------------------
    /**
     * @dev Only to be called by the DuchCoordinator contract
     * @param _nftCollateralAddress Address of NFT collateral
     * @param _nftCollateralTokenId Token ID of NFT collateral
     * @param _auctionStartTime UNIX timestamp of the auction start time (in seconds)
     * @param _auctionDuration Number of seconds which the auction is active
     * @param _principal Desired principal of loan
     * @param _maxIRatePerSecond Maximum interest rate per second which the borrower is willing to pay
     * @param _loanTerm Duration of the loan in seconds
     * @param _denominatedToken Address of the SuperToken which denominates the loan
     * @param _debtor Address of the debtor: receives the loan / collateral upon repayment of loan
     */
    constructor(
        address _nftCollateralAddress,
        uint256 _nftCollateralTokenId,
        uint256 _auctionStartTime,
        uint256 _auctionDuration,
        UD60x18 _principal,
        UD60x18 _maxIRatePerSecond,
        uint256 _loanTerm,
        ISuperToken _denominatedToken,
        address _debtor
    ) ERC20("Duch Loan Auction", "DLA") {
        require(
            _auctionStartTime > block.timestamp,
            Errors.AUCTION_CANNOT_START_IN_PAST
        );

        nftCollateralAddress = _nftCollateralAddress;
        nftCollateralTokenId = _nftCollateralTokenId;
        auctionStartTime = _auctionStartTime;
        auctionDuration = _auctionDuration;
        principal = _principal;
        loanTerm = _loanTerm;
        denominatedToken = _denominatedToken;
        debtor = _debtor;

        coordinator = DuchCoordinator(msg.sender);

        // Calculate k (see getCurrentInterestRate below)
        k = _maxIRatePerSecond.div(toUD60x18(auctionDuration).sqrt());

        // Creates the IDA Index through which tokens will be distributed
        _denominatedToken.createIndex(INDEX_ID);
    }

    /**
     * @notice When called with amount 0, bids the remaining amount of the principal and starts the loan
     * @notice If principal is not raised in the auction duration, amount can be returned to token holders
     * @param amount Amount of denominated token to commit to the loan
     */
    // External functions ----------------------
    function bid(UD60x18 amount) external onlyAuctionPhase {
        require(
            block.timestamp > auctionStartTime,
            Errors.AUCTION_HAS_NOT_STARTED
        );
        require(
            block.timestamp < auctionStartTime + auctionDuration,
            Errors.AUCTION_HAS_ENDED
        );
        require(
            unwrap(amount) < unwrap(principal.sub(debt)),
            Errors.EXCESSIVE_BID_AMOUNT
        );

        // Bid zero to complete the loan
        if (unwrap(amount) == 0) {
            denominatedToken.transferFrom(
                msg.sender,
                address(this),
                unwrap(principal.sub(debt))
            );
            startLoan();
        } else {
            denominatedToken.transferFrom(
                msg.sender,
                address(this),
                unwrap(amount)
            );
            unchecked {
                debt = debt.add(amount);
            }
        }

        // Mint debt securities
        _mint(msg.sender, unwrap(amount));

        emit Bid(msg.sender, amount, debt);
    }

    /**
     * @notice When auction expires and loan has not started, loan amount can be returned to lenders
     */
    function collectFromUnsuccessfulAuction() external onlyAuctionPhase {
        require(
            block.timestamp > auctionStartTime + auctionDuration,
            Errors.AUCTION_STILL_ACTIVE
        );
        distribute();
        coordinator.endLoanAuction(
            nftCollateralAddress,
            nftCollateralTokenId,
            debtor
        );
        state = State.AuctionUnsuccessful;

        emit AuctionUnsuccessful();
    }

    /**
     * @notice When loan ends, either pays back lenders and returns collateral to
     *         borrower or begins the liquidation process of the collateral
     * @notice The starting price of (principal * 2) was an arbitrary choice
     */
    function endLoan() external onlyLoanPhase {
        require(block.timestamp > loanEndTime, Errors.LOAN_STILL_ACTIVE);

        uint256 balance = denominatedToken.balanceOf(address(this));

        if (balance >= unwrap(debt)) {
            distribute();
            state = State.LoanPaid;
            coordinator.endLoanAuction(
                nftCollateralAddress,
                nftCollateralTokenId,
                debtor
            );
            emit LoanPaid();
        } else {
            liquidator = new DuchLiquidator(
                nftCollateralAddress,
                nftCollateralTokenId,
                principal.mul(wrap(2)),
                denominatedToken
            );
            state = State.LiquidationPhase;
            emit LiquidationStarted();
        }
    }

    /**
     * @notice Pays out the liquidation value to token holders
     * @dev Only the relevant DuchLiquidator contract can call this function
     * @param collateralRecipient Recipient address of the NFT collateral
     * @param liquidationValue Total value arising from the liquidation of the NFT collateral (for logging in an event)
     */
    function payoutLiquidation(
        address collateralRecipient,
        UD60x18 liquidationValue
    ) external onlyLiquidationPhase {
        require(msg.sender == address(liquidator), Errors.ONLY_LIQUIDATOR);
        distribute();
        state = State.LiquidationPaid;
        coordinator.endLoanAuction(
            nftCollateralAddress,
            nftCollateralTokenId,
            collateralRecipient
        );

        emit LiquidationPaid(liquidationValue);
    }

    // Public functions ----------------------------

    /**
     * @notice Public function to view the current interest rate during the auction phase
     * @return iRatePerSecond Per second interest as calculated by the following formula:
     *
     *      i_current = k * (t ^ 1/2)
     *
     *      where i_current is the current interest rate per second
     *      t is the auction time elapsed in seconds
     *      k is the constant calculated such that
     *
     *      k = i_max / t_max
     *
     *      where i_max is the maximum interest rate per second
     *      t_max is auction duration
     */
    function getCurrentInterestRate()
        public
        view
        onlyAuctionPhase
        returns (UD60x18)
    {
        uint256 auctionTimeElapsed = block.timestamp - auctionStartTime;
        UD60x18 iRatePerSecond = k.mul(toUD60x18(auctionTimeElapsed).sqrt());

        return iRatePerSecond;
    }

    // Internal functions ----------------------------
    /**
        @notice Calculates interest based on time in auction and sends principal to borrower
     */
    function startLoan() internal {
        UD60x18 iRatePerSecond = getCurrentInterestRate();
        state = State.LoanPhase;
        loanEndTime = block.timestamp + loanTerm;
        UD60x18 totalInterest = iRatePerSecond.mul(toUD60x18(loanTerm));
        debt = principal.add(totalInterest); // Debt set to maturity loan value (principal + interest)

        // Send debtor the loan
        denominatedToken.transfer(debtor, unwrap(principal));

        emit LoanStarted(iRatePerSecond, principal, totalInterest, debt);
    }

    /**
     * @notice Takes the entire balance of the designated denominated token
     * in the contract and distributes it out to unit holders w/ IDA
     */
    function distribute() public {
        uint256 balance = denominatedToken.balanceOf(address(this));

        (uint256 actualDistributionAmount, ) = denominatedToken
            .calculateDistribution(address(this), INDEX_ID, balance);

        denominatedToken.distribute(INDEX_ID, actualDistributionAmount);
    }

    /**
     * @notice Hook to transfer IDA subscription units along with the ERC20 tokens
     * @dev Overrides Openzeppelin's implementation of ERC20 _afterTokenTransfer
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (from != address(0)) {
            (, , uint256 currentUnitsHeld, ) = denominatedToken.getSubscription(
                address(this),
                INDEX_ID,
                from
            );

            denominatedToken.updateSubscriptionUnits(
                INDEX_ID,
                from,
                uint128(currentUnitsHeld - amount)
            );
        }

        if (to != address(0)) {
            (, , uint256 currentUnitsHeld, ) = denominatedToken.getSubscription(
                address(this),
                INDEX_ID,
                to
            );

            denominatedToken.updateSubscriptionUnits(
                INDEX_ID,
                to,
                uint128(currentUnitsHeld + amount)
            );
        }
    }
}
