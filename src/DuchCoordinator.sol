// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./DuchLoanAuction.sol";
import "./libraries/Errors.sol";

contract DuchCoordinator {
    // State ---------------------------
    mapping(address => mapping(uint256 => DuchLoanAuction)) public activeLoans;

    // Events --------------------------
    event LoanAuctionCreated(
        address indexed nftCollateralAddress,
        uint256 indexed nftCollateralTokenId,
        address loanAuctionAddress,
        uint256 auctionStartTime,
        uint256 auctionDuration,
        UD60x18 principal,
        UD60x18 maxIRatePerSecond,
        uint256 loanTerm,
        address denominatedToken,
        address debtor
    );

    event LoanAuctionEnded(
        address indexed nftCollateralAddress,
        uint256 indexed nftCollateralTokenId,
        address indexed loanAuctionAddress,
        address collateralRecipient
    );

    // External functions ---------------
    function createLoanAuction(
        address nftCollateralAddress,
        uint256 nftCollateralTokenId,
        uint256 auctionStartTime,
        uint256 auctionDuration,
        UD60x18 principal,
        UD60x18 maxIRatePerSecond,
        uint256 loanTerm,
        address denominatedToken,
        address debtor
    ) external {
        // Escrow NFT collateral
        IERC721(nftCollateralAddress).transferFrom(
            msg.sender,
            address(this),
            nftCollateralTokenId
        );

        // Create LoanAuction
        DuchLoanAuction loanAuction = new DuchLoanAuction(
            nftCollateralAddress,
            nftCollateralTokenId,
            auctionStartTime,
            auctionDuration,
            principal,
            maxIRatePerSecond,
            loanTerm,
            ISuperToken(denominatedToken),
            debtor
        );

        activeLoans[nftCollateralAddress][nftCollateralTokenId] = loanAuction;

        emit LoanAuctionCreated(
            nftCollateralAddress,
            nftCollateralTokenId,
            address(loanAuction),
            auctionStartTime,
            auctionDuration,
            principal,
            maxIRatePerSecond,
            loanTerm,
            denominatedToken,
            debtor
        );
    }

    function endLoanAuction(
        address nftCollateralAddress,
        uint256 nftCollateralTokenId,
        address collateralRecipient
    ) external {
        DuchLoanAuction activeLoan = activeLoans[nftCollateralAddress][
            nftCollateralTokenId
        ];

        require(msg.sender == address(activeLoan), Errors.ONLY_ACTIVE_LOAN);

        delete activeLoans[nftCollateralAddress][nftCollateralTokenId];

        IERC721(nftCollateralAddress).safeTransferFrom(
            address(this),
            collateralRecipient,
            nftCollateralTokenId
        );

        emit LoanAuctionEnded(
            nftCollateralAddress,
            nftCollateralTokenId,
            address(activeLoan),
            collateralRecipient
        );
    }
}
