// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";

// import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
// import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface ILDToken is IERC20, IERC20Permit {

}

contract Deposit {
    ILDToken private _token;

    constructor(ILDToken token) {
        _token = ILDToken(token);
    }

    function approveDeposit(uint256 amount) external {
        _token.transferFrom(msg.sender, address(this), amount);
    }

    function permitDeposit(
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        _token.permit(msg.sender, address(this), amount, deadline, v, r, s);
        _token.transferFrom(msg.sender, address(this), amount);
    }
}
