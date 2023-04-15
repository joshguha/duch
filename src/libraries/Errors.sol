// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

library Errors {
    string public constant ONLY_AUCTION_PHASE = "1";
    string public constant ONLY_LOAN_PHASE = "2";
    string public constant ONLY_LIQUIDATION_PHASE = "3";
    string public constant AUCTION_CANNOT_START_IN_PAST = "4";
    string public constant AUCTION_HAS_NOT_STARTED = "5";
    string public constant AUCTION_HAS_ENDED = "6";
    string public constant EXCESSIVE_BID_AMOUNT = "7";
    string public constant AUCTION_STILL_ACTIVE = "8";
    string public constant LOAN_STILL_ACTIVE = "9";
    string public constant ONLY_LIQUIDATOR = "10";
    string public constant ONLY_ACTIVE_LOAN = "11";
    string public constant UNABLE_TO_CLAIM = "12";
}
