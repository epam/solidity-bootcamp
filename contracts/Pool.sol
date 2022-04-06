//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Ownable.sol";

contract Pool is Ownable {
    mapping(address => uint256) _deposits;

    constructor(address owner) Ownable(owner) {}

    function getAmount(address account) external view returns (uint256) {
        return _deposits[account];
    }

    function deposit(uint256 amount) external {
        _deposits[msg.sender] += amount;
    }
}
