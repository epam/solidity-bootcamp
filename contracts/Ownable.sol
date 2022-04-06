//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

abstract contract Ownable {

    address _owner;

    constructor(address owner) {
        _owner = owner;
    }

    modifier onlyOwner {
        require(msg.sender == _owner);
        _;
    }

}
