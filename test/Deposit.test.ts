import { JsonRpcSigner } from '@ethersproject/providers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract, providers, Signer } from 'ethers';
import { ethers } from 'hardhat';
import { getUSDCFaucet, signERC2612Permit } from './lib/eth';

describe("Deposit", function () {

    let token: Contract;

    before(async () => {
        const [owner, alice, bob] = await ethers.getSigners();

        const faucet = await getUSDCFaucet();
        const amountToClaim = 100_000;

        for (const user of [owner, alice, bob]) {
            await faucet(user.address, amountToClaim);
        }

        // const LDTokenPermit = await ethers.getContractFactory('LDTokenPermit.sol');
        // token = await LDTokenPermit.deploy();
        // await token.deployed();

    });

    it("Should return the new greeting once it's changed", async function () {
        const USDC = new ethers.Contract("0x5425890298aed601595a70AB815c96711a31Bc65", new ethers.utils.Interface([
            "function nonces(address owner) view returns (uint256)",
        ]));

        const Deposit = await ethers.getContractFactory("Deposit");
        const deposit = await Deposit.deploy();
        await deposit.deployed();

        console.log(deposit.address);

        const domain = { name: "USD Coin", version: '2', chainId: 43113, verifyingContract: USDC.address };

        // const value = web3.utils.toWei('1', 'ether');
        const value = 1000;

        // const wallet = new ethers.Wallet(privateKey, new ethers.providers.JsonRpcProvider(rpcUrl));
        // const senderAddress = await wallet.getAddress();
        const owner = (await ethers.getSigners())[0];
        const sender = owner.address;
        console.log(owner.address);

        const n = await USDC.connect(owner).nonces(owner.address);
        console.log(n);

        const result = await signERC2612Permit(owner, domain, deposit.address, value, n);
        console.log(result);

        // await token.methods.permit(senderAddress, store.address, value, result.deadline, result.v, result.r, result.s).send({
        //     from: senderAddress,
        // });

        await (await deposit.connect(owner).deposit(value, result.deadline, result.v, result.r, result.s)).wait();
    });
});
