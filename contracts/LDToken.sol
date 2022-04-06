// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Adapted from https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/ERC20.sol
contract LDToken {

    mapping (address => uint256) _balances;

    uint256 _totalSupply;

    string public _name;
    string public _symbol;

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function decimals() public pure returns (uint8) {
        return 6;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) external returns (bool) {
    }

    function _mint(address account, uint256 amount) external virtual {
        _balances[account] += amount;
        _totalSupply += amount;
    }

}
