// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "zodiac/core/Module.sol";

contract CustomModule is Module {
    uint256 public expiration;
    address public beneficiary;

    constructor() {
        _transferOwnership(msg.sender);
    }

    function setUp(bytes memory initializeParams) public override {}

    function init(
        address safe,
        address _benefiary,
        uint256 _expiration
    ) public {
        setAvatar(safe);
        setTarget(safe);
        beneficiary = _benefiary;
        expiration = _expiration;
    }

    function extendValidity(uint256 by) public {
        expiration = expiration + by;
    }

    function claimSafe(bytes memory data) public {
        if (expiration < block.timestamp && msg.sender == beneficiary) {
            exec(avatar, 0, data, Enum.Operation.Call);
        }
    }
}
