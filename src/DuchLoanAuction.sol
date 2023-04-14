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

    // Auction
    uint256 public immutable auctionStartTime;
    uint256 public immutable auctionDuration;
    UD60x18 public immutable principal;
    bool auctionSettled;
    bool auctionUnsuccessful;

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
    bool loanWithdrawn;
    uint256 loanEndTime;

    /// @notice SuperToken Library
    uint32 public constant INDEX_ID = 0;

    // Contracts
    DuchLiquidator liquidator;

    // Events ------------------------------------
    event Bid(address indexed bidder, UD60x18 amount);
    event AuctionSettled(UD60x18 iRatePerSecond, UD60x18 maturityLoanValue);
    event AuctionUnsuccessful();
    event LoanWithdrawn(UD60x18 principal);
    event FullRepayment(address indexed repayer);
    event PartialRepayment(address indexed repayer, UD60x18 indexed amount);
    event LiquidationStarted();
    event LiquidationEnded(UD60x18 finalPayout);

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
    function bid(UD60x18 amount) external {
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
        require(!auctionSettled, "Auction has already been settled");

        // Bid zero to complete the loan
        if (unwrap(amount) == 0) {
            denominatedToken.transferFrom(
                msg.sender,
                address(this),
                unwrap(principal.sub(debt))
            );
            settleAuction();
        } else {
            denominatedToken.transferFrom(
                msg.sender,
                address(this),
                unwrap(amount)
            );
        }

        // Increase total loan amount raised
        unchecked {
            debt = debt.add(amount);
        }

        // Mint debt securities
        _mint(msg.sender, unwrap(amount));

        emit Bid(msg.sender, amount);
    }

    function unsuccessfulAuction() external {
        require(
            block.timestamp > auctionStartTime + auctionDuration,
            "Auction still active"
        );
        require(!auctionSettled, "Auction settled");
        require(!auctionUnsuccessful, "Auction already declared unsuccessful");

        distribute();
        auctionUnsuccessful = true;
        emit AuctionUnsuccessful();
    }

    function withdrawLoan() external {
        require(msg.sender == debtor, "Only debtor can withdraw loan");
        require(auctionSettled, "Auction not settled");
        require(!loanWithdrawn, "Loan already withdrawn");

        denominatedToken.transfer(debtor, unwrap(principal));

        emit LoanWithdrawn(principal);
    }

    function repayLoan(UD60x18 amount) external {
        require(loanWithdrawn, "Loan not withdrawn");
        require(amount.lt(debt), "Invalid repayment amount");

        // Repay with amount 0 to repay entire loan
        if (unwrap(amount) == 0) {
            denominatedToken.transferFrom(
                msg.sender,
                address(this),
                unwrap(debt)
            );
            debt = wrap(0);

            // Pay back all distribution token holders
            distribute();

            // Return collateral from escrow;
            IERC721(nftCollateralAddress).transferFrom(
                address(this),
                debtor,
                nftCollateralTokenId
            );

            emit FullRepayment(msg.sender);
        } else {
            denominatedToken.transferFrom(
                msg.sender,
                address(this),
                unwrap(amount)
            );
            unchecked {
                debt = debt.sub(amount);
            }
            emit PartialRepayment(msg.sender, amount);
        }
    }

    function liquidateCollateral() external {
        require(auctionSettled, "Auction not settled");
        require(block.timestamp > loanEndTime, "Loan still active");
        require(unwrap(debt) > 0, "Debt has been paid off");

        liquidator = new DuchLiquidator(
            nftCollateralAddress,
            nftCollateralTokenId,
            principal.mul(wrap(2)),
            denominatedToken
        );

        emit LiquidationStarted();
    }

    function payoutLiquidation() external {
        require(msg.sender == address(liquidator), "Only liquidator");
        UD60x18 finalPayout = wrap(denominatedToken.balanceOf(address(this)));
        distribute();

        emit LiquidationEnded(finalPayout);
    }

    // Public functions ----------------------------
    function getCurrentInterestRate() public view returns (UD60x18) {
        require(!auctionSettled, "Auction has been settled");
        UD60x18 k = maxIRatePerSecond.div(toUD60x18(auctionDuration).sqrt());
        uint256 auctionTimeElapsed = block.timestamp - auctionStartTime;
        UD60x18 iRatePerSecond = k.mul(toUD60x18(auctionTimeElapsed).sqrt());

        return iRatePerSecond;
    }

    // Internal functions ----------------------------
    /// @notice Takes the entire balance of the designated spreaderToken in the contract and distributes it out to unit holders w/ IDA
    function distribute() public {
        uint256 balance = denominatedToken.balanceOf(address(this));

        (uint256 actualDistributionAmount, ) = denominatedToken
            .calculateDistribution(address(this), INDEX_ID, balance);

        denominatedToken.distribute(INDEX_ID, actualDistributionAmount);
    }

    function settleAuction() internal {
        UD60x18 iRatePerSecond = getCurrentInterestRate();
        auctionSettled = true;
        loanEndTime = block.timestamp + loanTerm;
        debt = principal.add(iRatePerSecond.mul(toUD60x18(loanTerm))); // Debt set to maturity loan value (principal + interest)

        emit AuctionSettled(iRatePerSecond, debt);
    }
}
