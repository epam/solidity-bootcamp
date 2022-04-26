import { JsonRpcSigner } from '@ethersproject/providers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber, Contract, providers, Signer } from 'ethers';
import { ethers } from 'hardhat';
import { signERC2612Permit } from './lib/sign';
import { getUSDCFaucet } from './lib/faucet';

describe("Deposit", function () {

    let owner: SignerWithAddress;
    let alice: SignerWithAddress;

    let token: Contract;
    let deposit: Contract;

    before(async () => {
        [owner, alice] = await ethers.getSigners();

        const LDToken = await ethers.getContractFactory('LDToken');
        token = await LDToken.deploy('Learning&Development Solidity', 'LDT');
        await token.deployed();

        const Deposit = await ethers.getContractFactory("Deposit");
        deposit = await Deposit.deploy(token.address);
        await deposit.deployed();

        await token.connect(owner)._mint(alice.address, 10_000_000);
    });

    it("should transfer to deposit using approve", async function () {
        const balance = await token.balanceOf(deposit.address) as BigNumber;

        await token.connect(alice).approve(deposit.address, 100_000);
        await deposit.connect(alice).approveDeposit(100_000);

        expect(await token.balanceOf(deposit.address)).to.be.equal(balance.add(100_000));
    });

    it("should transfer to deposit using permit", async function () {
        const balance = await token.balanceOf(deposit.address) as BigNumber;

        const chainId = (await token.provider.getNetwork()).chainId;
        const domain = {
            name: await token.name(),
            version: "2",
            chainId,
            verifyingContract: token.address,
        };
        const nonce = await token.nonces(alice.address);
        const sig = await signERC2612Permit(
            alice,
            domain,
            deposit.address,
            50_000,
            nonce,
        );
        await deposit.connect(alice).permitDeposit(50_000, sig.deadline, sig.v, sig.r, sig.s);

        expect(await token.balanceOf(deposit.address)).to.be.equal(balance.add(50_000));
    });

});
