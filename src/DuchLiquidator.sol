// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {UD60x18, unwrap, wrap, toUD60x18} from "@prb/math/UD60x18.sol";

import "./DuchLoanAuction.sol";

/**
 * @title DuchLiquidator - A basic Dutch auction to liquidate NFT collateral
 * @author Josh Guha @ ETHGlobal Tokyo 2023
 * @notice This is not the main value proposition of this project
 * @notice A more capital efficient auction with privacy preserving and economically desirable properties
 *         is the Vickrey (second-price sealed bid) auction
 *         For e.g. https://a16zcrypto.com/content/article/hidden-in-plain-sight-a-sneaky-solidity-implementation-of-a-sealed-bid-auction/
 */
contract DuchLiquidator {
    // State ------------------------------------------
    // Collateral
    address public immutable nftCollateralAddress;
    uint256 public immutable nftCollateralTokenId;

    // Auction params
    UD60x18 public immutable startingPrice;
    ERC20 public immutable denominatedToken;
    uint256 public immutable endTime;

    // Address
    DuchLoanAuction public immutable activeLoanAuction;

    // Constants
    uint32 private constant AUCTION_DURATION = 7 days;

    /**
     * @param _nftCollateralAddress Address of NFT collateral
     * @param _nftCollateralTokenId Token ID of NFT collateral
     * @param _startingPrice Price to start the auction at
     * @param _denominatedToken The denomination of the liquidation
     */
    constructor(
        address _nftCollateralAddress,
        uint256 _nftCollateralTokenId,
        UD60x18 _startingPrice,
        ERC20 _denominatedToken
    ) {
        nftCollateralAddress = _nftCollateralAddress;
        nftCollateralTokenId = _nftCollateralTokenId;

        startingPrice = _startingPrice;
        denominatedToken = _denominatedToken;
        endTime = block.timestamp + AUCTION_DURATION;

        activeLoanAuction = DuchLoanAuction(msg.sender);
    }

    /**
     * @notice Calculates price from linear descending price function which has a lower bound of 0
     */
    function getPrice() public view returns (UD60x18) {
        // Zero price if after auction end, though this should theoretically never happen
        if (block.timestamp > endTime) return wrap(0);
        uint256 timeRemaining = endTime - block.timestamp;
        // Dutch auction, linear decrease in price over time
        return
            toUD60x18(timeRemaining).div(toUD60x18(endTime)).mul(startingPrice);
    }

    /**
     * @notice Transfers the bid amount to the DuchLoanAuction contract and sends collateral to bidder
     */
    function buy() external {
        UD60x18 price = getPrice();

        denominatedToken.transferFrom(
            msg.sender,
            address(activeLoanAuction),
            unwrap(price)
        );

        activeLoanAuction.payoutLiquidation(msg.sender, price);

        selfdestruct(payable(msg.sender)); // Shouldn't hold ETH
    }
}
