# Solidity Bootcamp

## Program

Course/Ethereum Developer Program

### Session Project Intro _2022-03-29 Tue 14:30_

- Introduction to Blockchain Development
- EVM, bytecode, Solidity overview
- Using Hardhat as development environment
- Compiling and testing sample smart contract
- **TASK** Follow Hardhat tutorial <https://hardhat.org/tutorial/>

### Session Storage/Memory allocation _2022-04-01 Fri 14:30_

- Solidity deep dive
- `storage` vs `memory` allocation
- Aliasing vs copy of complex types, _i.e._, `struct` and `array`

### Session ERC20 Token (Part 1) _2022-04-05 Tue 14:30_

- Initial ERC20 token implementation
- EIP-20: Token Standard <https://eips.ethereum.org/EIPS/eip-20>
- `mint`, `balanceOf`, `totalSupply`

### Session ERC20 Token (Part 2) <2022-04-08 Fri 14:30>

- Wrap up ERC20 token implementation
- `transfer`, `allowance` and `transferFrom`
- modifiers, owner and minter role
- Display in MetaMask wallet
- Write unit tests with Hardhat, Mocha and Chai

### Session Remote Networks

- Deploy and interact with a remote public network
- Testnet and mainnet
- Setting a wallet up with Metamask
- Use Faucets to fund your account
- Kovan Faucet <https://ethdrop.dev/>
- Create a new account, public and private keyes
- Setup an infura/alchemy account
- Deploy to a remote public network
- Interact with a remote public network
- Test against a remote public network
- **TASK** Setup Metamask&Infura/Alchemy, deploy, test and interact with a smart contract

### Session Web3 App

- Web App to interact with Smart Contracts
- Using Svelte as front end JS framework
- Using MetaMask to sign and send transactions

### Session Local Development Network

- Deploy locally
- Local development network, /Hardhat/ Network
- Local Hardhat accounts created

### Session Security Analysis

- Security concerns
- Best practices
- Reentrancy
- Tools: Slither

### Session Proxy Patterns

- OpenZeppelin Upgradeable contracts
- Contracts Slots

### Session Gasless Approval

- Permit standard
- Signature structure
- Overview of Eliptic Curve Digital Signature Algoritm (ECDSA)
- Sign transactions
- Using MetaMask to sign transactions
- Validate signed transactions

### TODO Session Web3/Web2 Connections

### TODO Session Error handling

## Recommended Readings

> **Mastering Ethereum** <https://github.com/ethereumbook/ethereumbook> is a book for developers, offering a guide to the operation and use of the Ethereum, Ethereum Classic, RootStock (RSK) and other compatible EVM-based open blockchains.

by Andreas M. Antonopoulos, also author of _Mastering Bitcoin_ <https://github.com/bitcoinbook/bitcoinbook> and
Gavin Wood, co-founder of Ethereum and early designer of Solidity.

## Frequently Asked Questions

### How does it prevent double-spend?

consensus forking

## Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
