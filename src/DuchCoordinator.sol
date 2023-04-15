// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./DuchLoanAuction.sol";
import "./libraries/Errors.sol";

/**
    @title DuchCoordinator - A factory and escrow contract for DuchLoanAuctions
    @author Josh Guha @ ETHGlobal Tokyo 2023
    @notice Contracts stores a mapping of collateral address/ token id to loan auction addresses
    @notice Contracts emits helpful events at start and end of LoanAuction
 */
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
    /**
     * @dev Used to create new DuchLoanAuctions with relevant parameters
     * @param nftCollateralAddress Address of NFT collateral
     * @param nftCollateralTokenId Token ID of NFT collateral
     * @param auctionStartTime UNIX timestamp of the auction start time (in seconds)
     * @param auctionDuration Number of seconds which the auction is active
     * @param principal Desired principal of loan
     * @param maxIRatePerSecond Maximum interest rate per second which the borrower is willing to pay
     * @param loanTerm Duration of the loan in seconds
     * @param denominatedToken Address of the ERC20 which denominates the loan
     * @param debtor Address of the debtor: receives the loan / collateral upon repayment of loan
     */
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
            ERC20(denominatedToken),
            debtor
        );

        // activeLoans[nftCollateralAddress][nftCollateralTokenId] = loanAuction;

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

    /**
     * @dev Triggered by the DuchLoanAuction contract to send collateral to the right address
     * @param nftCollateralAddress Address of NFT collateral
     * @param nftCollateralTokenId Token ID of NFT collateral
     * @param collateralRecipient Recipient address of the NFT collateral
     */

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
