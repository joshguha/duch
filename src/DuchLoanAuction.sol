// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {UD60x18, unwrap, wrap, toUD60x18} from "@prb/math/UD60x18.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import "./DuchLiquidator.sol";

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

    // During auction phase this variable is the upper bound (max interest rate).
    // During loan phase, this is the actual interest rate
    UD60x18 public maxIRatePerSecond;

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
    event LiquidationPaid(UD60x18 finalPayout);

    // Modifiers

    modifier onlyAuctionPhase() {
        require(state == State.AuctionPhase, "Not Auction Phase");
        _;
    }

    modifier onlyLoanPhase() {
        require(state == State.LoanPhase, "Not Loan Phase");
        _;
    }

    modifier onlyLiquidationPhase() {
        require(state == State.LiquidationPhase, "Not Liquidation Phase");
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
            "Auction cannot start in the past"
        );

        nftCollateralAddress = _nftCollateralAddress;
        nftCollateralTokenId = _nftCollateralTokenId;
        auctionStartTime = _auctionStartTime;
        auctionDuration = _auctionDuration;
        principal = _principal;
        maxIRatePerSecond = _maxIRatePerSecond;
        loanTerm = _loanTerm;
        denominatedToken = _denominatedToken;
        debtor = _debtor;

        // Escrow collateral
        IERC721(nftCollateralAddress).transferFrom(
            msg.sender,
            address(this),
            _nftCollateralTokenId
        );

        // Creates the IDA Index through which tokens will be distributed
        _denominatedToken.createIndex(INDEX_ID);
    }

    // External functions ----------------------
    function bid(UD60x18 amount) external onlyAuctionPhase {
        require(
            block.timestamp > auctionStartTime,
            "Auction has not started yet"
        );
        require(
            block.timestamp < auctionStartTime + auctionDuration,
            "Auction has ended"
        );
        require(
            unwrap(amount) < unwrap(principal.sub(debt)),
            "Excessive bid amount"
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

    function collectFromUnsuccessfulAuction() external onlyAuctionPhase {
        require(
            block.timestamp > auctionStartTime + auctionDuration,
            "Auction still active"
        );
        distribute();
        state = State.AuctionUnsuccessful;

        emit AuctionUnsuccessful();
    }

    function endLoan() external onlyLoanPhase {
        require(block.timestamp > loanEndTime, "Loan still active");

        uint256 balance = denominatedToken.balanceOf(address(this));

        if (balance >= unwrap(debt)) {
            distribute();
            state = State.LoanPaid;
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

    function payoutLiquidation() external onlyLiquidationPhase {
        require(msg.sender == address(liquidator), "Only liquidator");
        UD60x18 finalPayout = wrap(denominatedToken.balanceOf(address(this)));
        distribute();
        state = State.LiquidationPaid;

        emit LiquidationPaid(finalPayout);
    }

    // Public functions ----------------------------
    function getCurrentInterestRate()
        public
        view
        onlyAuctionPhase
        returns (UD60x18)
    {
        UD60x18 k = maxIRatePerSecond.div(toUD60x18(auctionDuration).sqrt());
        uint256 auctionTimeElapsed = block.timestamp - auctionStartTime;
        UD60x18 iRatePerSecond = k.mul(toUD60x18(auctionTimeElapsed).sqrt());

        return iRatePerSecond;
    }

    // Internal functions ----------------------------
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

    /// @notice Takes the entire balance of the designated denominated token
    ///         in the contract and distributes it out to unit holders w/ IDA
    function distribute() public {
        uint256 balance = denominatedToken.balanceOf(address(this));

        (uint256 actualDistributionAmount, ) = denominatedToken
            .calculateDistribution(address(this), INDEX_ID, balance);

        denominatedToken.distribute(INDEX_ID, actualDistributionAmount);
    }

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
