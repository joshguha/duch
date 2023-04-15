// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/DuchCoordinator.sol";
import "../src/FakeApe.sol";

contract DuchCoordinatorTest is Test {
    DuchCoordinator public coordinator;
    FakeApe public nft;

    address bob = address(0x01);

    function setUp() public {
        coordinator = new DuchCoordinator();
        nft = new FakeApe();
        nft.mint(bob, 1);
        vm.prank(bob);
        nft.approve(address(coordinator), 1);
    }

    function testCreateLoanAuction() public {
        vm.prank(bob);
        coordinator.createLoanAuction(
            address(nft),
            1,
            100,
            100,
            wrap(100),
            wrap(100),
            100,
            address(0x02),
            address(0x03)
        );
    }
}
