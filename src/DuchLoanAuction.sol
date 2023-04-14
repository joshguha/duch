// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {UD60x18, unwrap, wrap, toUD60x18} from "@prb/math/UD60x18.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";

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

    // During auction phase this variable is the upper bound (max interest rate).
    // During loan phase, this is the actual interest rate
    UD60x18 public iRatePerSecond;

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

    // Constructor -------------------------------
    constructor(
        address _nftCollateralAddress,
        uint256 _nftCollateralTokenId,
        uint256 _auctionStartTime,
        uint256 _auctionDuration,
        UD60x18 _principal,
        UD60x18 _iRatePerSecond,
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
        iRatePerSecond = _iRatePerSecond;
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
            // settleAuction();
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
    }

    function unsuccessfulAuction() external {
        require(
            block.timestamp > auctionStartTime + auctionDuration,
            "Auction still active"
        );
        require(!auctionSettled, "Auction settled");

        distribute();
    }

    function withdrawLoan() external {
        require(msg.sender == debtor, "Only debtor can withdraw loan");
        require(auctionSettled, "Auction not settled");
        require(!loanWithdrawn, "Loan already withdrawn");

        denominatedToken.transfer(debtor, unwrap(principal));
    }

    // Internal functions ----------------------------
    /// @notice Takes the entire balance of the designated spreaderToken in the contract and distributes it out to unit holders w/ IDA
    function distribute() public {
        uint256 balance = denominatedToken.balanceOf(address(this));

        (uint256 actualDistributionAmount, ) = denominatedToken
            .calculateDistribution(address(this), INDEX_ID, balance);

        denominatedToken.distribute(INDEX_ID, actualDistributionAmount);
    }

    function settleLoan() internal {
        auctionSettled = true;
        loanEndTime = block.timestamp + loanTerm;
        UD60x18 k = iRatePerSecond.div(toUD60x18(auctionDuration).sqrt()); // iRatePerSecond is max interest rate
        uint256 auctionTimeElapsed = block.timestamp - auctionStartTime;
        iRatePerSecond = k.mul(toUD60x18(auctionTimeElapsed).sqrt()); // iRatePerSecond set to actual interest rate for loan
    }
}
