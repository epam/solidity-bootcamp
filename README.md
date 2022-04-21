# Solidity Bootcamp

## Program

Course/Ethereum Developer Program

### § Session Project Intro _2022-03-29 Tue 14:30_

- Introduction to Blockchain Development
- EVM, bytecode, Solidity overview
- Using Hardhat as development environment
- Compiling and testing sample smart contract
- **TASK** Follow Hardhat tutorial <https://hardhat.org/tutorial/>

### § Session Storage/Memory allocation _2022-04-01 Fri 14:30_

- Solidity deep dive
- `storage` vs `memory` allocation
- Aliasing vs copy of complex types, _i.e._, `struct` and `array`

### § Session ERC20 Token (Part 1) _2022-04-05 Tue 14:30_

- Initial ERC20 token implementation
- EIP-20: Token Standard <https://eips.ethereum.org/EIPS/eip-20>
- `mint`, `balanceOf`, `totalSupply`
- Error handling in contracts & Reverting Transactions

### § Session ERC20 Token (Part 2) _2022-04-08 Fri 14:30_

- Wrap up ERC20 token implementation
- `transfer`
- `transferFrom`, `approve` and `allowance`
- modifiers, owner and minter role
- Ownable
- Display in MetaMask wallet
- Write unit tests with Hardhat, Mocha and Chai

### § Session Remote Networks _2022-04-12 Tue 14:30_

- Deploy and interact with a local and remote public network
- Testnet and mainnet
- Setting a wallet up with Metamask/Fuji
- Use Faucets to fund your account
- Kovan Faucet <https://ethdrop.dev/>
- Create a new account, public and private keyes
- Setup an infura/alchemy account
- Deploy to a remote public network
- Interact with a remote public network
- Test against a remote public network
- **Q&A.** [OpenZeppelin impl](https://docs.openzeppelin.com/contracts/4.x/), `virtual` and `override`, `EIP-165` and `supportsInterface`
- **TASK.** Setup Metamask or Avalanche's Fuji Wallet, Infura/Alchemy, deploy, test and interact with a smart contract.
Follow tutorial at <https://hardhat.org/tutorial/deploying-to-a-live-network.html>.

### § Session Private Keys _2022-04-14 Thu 11:30_

- Hardhat & Ethers
- Private & Public Key generation
- Importing to MetaMask and Avalanche's Wallet
- Eliptic Curve background
- One-way/hash functions

### § Session Web3 App, Localhost network & MetaMask _2022-04-19 Tue 14:30_

- Web App to interact with Smart Contracts
- Using Svelte as front end JS framework
- Using MetaMask to sign and send transactions
- Setting up a project to host both Front-end app and Hardhat contracts
- Deploy locally
- Local development network, _Hardhat_ Network
- Local Hardhat accounts created

### § Session Security Analysis

- Security concerns
- Best practices
- Reentrancy
- Tools: Slither

### § Session Proxy Patterns

- OpenZeppelin Upgradeable contracts
- Contracts Slots

### § Session Gasless Approval

- Permit standard
- Signature structure
- Overview of Eliptic Curve Digital Signature Algoritm (ECDSA)
- Sign transactions
- Using MetaMask to sign transactions
- Validate signed transactions

## Recommended Readings

> **Mastering Ethereum** <https://github.com/ethereumbook/ethereumbook> is a book for developers, offering a guide to the operation and use of the Ethereum, Ethereum Classic, RootStock (RSK) and other compatible EVM-based open blockchains.

by Andreas M. Antonopoulos, also author of _Mastering Bitcoin_ <https://github.com/bitcoinbook/bitcoinbook> and
Gavin Wood, co-founder of Ethereum and early designer of Solidity.

## Frequently Asked Questions

### How does it prevent double-spend?

consensus forking

## Topics

- What is a blockchain?
- What are transactions and blocks?
- How do P2P systems operate?
- The most prominent consensus mechanisms
- Difference between private, consortium, and public networks
- What does the data structure look like?
- How do Smart Contracts work?
- What is the Ethereum Virtual Machine?
- What is a Hash?
- How do public/private keys work?
- What is a Merkle tree?
- What is the double-spend problem?
- The Ethereum ecosystem and DApps
- What is Mist and how does it work?
- What is Ether, an account, a Faucet?

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
