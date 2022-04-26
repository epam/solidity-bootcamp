// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "hardhat/console.sol";

interface ILDToken is IERC20, IERC20Permit {}

contract Deposit {
    ILDToken private token =
        ILDToken(0x5FbDB2315678afecb367f032d93F642f64180aa3);

    bytes32 public constant PERMIT_TYPEHASH =
        0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;

    constructor() {
        // _mint(msg.sender, initialSupply);
    }

    function approveDeposit(uint256 amount) external {
        token.transferFrom(msg.sender, address(this), amount);
    }

    function permitDeposit(
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        bytes memory data = abi.encode(
            PERMIT_TYPEHASH,
            msg.sender,
            address(this),
            amount,
            0,
            deadline
        );

        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                token.DOMAIN_SEPARATOR(),
                keccak256(data)
            )
        );
        address addr = ECDSA.recover(digest, v, r, s);
        console.log("addr is %s", addr);

        token.DOMAIN_SEPARATOR();
        token.permit(msg.sender, address(this), amount, deadline, v, r, s);
        token.transferFrom(msg.sender, address(this), amount);
    }
}
