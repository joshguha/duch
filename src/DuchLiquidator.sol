// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {UD60x18, unwrap, wrap, toUD60x18} from "@prb/math/UD60x18.sol";

import "./DuchLoanAuction.sol";

contract DuchLiquidator {
    // State ------------------------------------------
    // Collateral
    address public immutable nftCollateralAddress;
    uint256 public immutable nftCollateralTokenId;

    // Auction params
    UD60x18 public immutable startingPrice;
    ISuperToken public immutable denominatedToken;
    uint256 public immutable endTime;

    // Address
    DuchLoanAuction public immutable activeLoanAuction;

    // Constants
    uint32 private constant AUCTION_DURATION = 7 days;

    constructor(
        address _nftCollateralAddress,
        uint256 _nftCollateralTokenId,
        UD60x18 _startingPrice,
        ISuperToken _denominatedToken
    ) {
        nftCollateralAddress = _nftCollateralAddress;
        nftCollateralTokenId = _nftCollateralTokenId;

        startingPrice = _startingPrice;
        denominatedToken = _denominatedToken;
        endTime = block.timestamp + AUCTION_DURATION;

        activeLoanAuction = DuchLoanAuction(msg.sender);
    }

    function getPrice() public view returns (UD60x18) {
        // Zero price if after auction end, though this should theoretically never happen
        if (block.timestamp > endTime) return wrap(0);
        uint256 timeRemaining = endTime - block.timestamp;
        // Dutch auction, linear decrease in price over time
        return
            toUD60x18(timeRemaining).div(toUD60x18(endTime)).mul(startingPrice);
    }

    function buy() external {
        UD60x18 price = getPrice();

        denominatedToken.transferFrom(
            msg.sender,
            address(activeLoanAuction),
            unwrap(price)
        );

        selfdestruct(payable(msg.sender)); // Shouldn't hold ETH
    }
}
