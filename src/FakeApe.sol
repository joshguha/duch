// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/mocks/ERC721Mock.sol";

contract FakeApe is ERC721Mock {
    constructor() ERC721Mock("Fake Ape", "FAKE") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/";
    }
}
