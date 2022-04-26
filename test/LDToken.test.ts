import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber, Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ERC20Domain, signERC2612Permit } from './lib/sign';
import { _TypedDataEncoder } from 'ethers/lib/utils';

describe("LDToken", function () {

    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let charlie: SignerWithAddress;

    let token: Contract;

    before(async function () {
        [owner, alice, bob, charlie] = await ethers.getSigners();

        const LDToken = await ethers.getContractFactory('LDToken');
        token = await LDToken.deploy('Learning&Development Solidity', 'LDT');
        await token.deployed();
    });

    it('should have valid name and symbol', async function () {
        expect(await token.name()).to.equal('Learning&Development Solidity');
        expect(await token.symbol()).to.equal('LDT');
    });

    it('should be able to mint tokens', async function () {
        expect(await token.balanceOf(alice.address)).to.equal(0);
        await token.connect(owner)._mint(alice.address, 10_000_000);
        expect(await token.balanceOf(alice.address)).to.equal(10_000_000);
    });

    it('should fail if sender does not have enough balance', async function () {
        expect(token.connect(bob).transfer(charlie.address, 10_000_000))
            .to.be.revertedWith("LDToken: sender does not have enough balance");
    });

    it('should make the transfer', async function () {
        await expect(token.connect(bob)._mint(bob.address, 5_000))
            .to.emit(token, "Transfer")
            .withArgs('0x0000000000000000000000000000000000000000', bob.address, 5_000);
        await expect(token.connect(bob).transfer(charlie.address, 2_000))
            .to.emit(token, "Transfer")
            .withArgs(bob.address, charlie.address, 2_000);

        expect(await token.balanceOf(bob.address)).to.equal(3_000);
        expect(await token.balanceOf(charlie.address)).to.equal(2_000);
    });

    it('should be able to approve spending', async function () {
        expect(await token.allowance(alice.address, bob.address)).to.be.equal(0);

        await token.connect(alice).approve(bob.address, 100_000);
        expect(await token.allowance(alice.address, bob.address)).to.be.equal(100_000);

        await token.connect(alice).approve(bob.address, 50_000);
        expect(await token.allowance(alice.address, bob.address)).to.be.equal(50_000);
    });

    it('should be able transfer from spender', async function () {
        let balanceOf = await token.balanceOf(alice.address) as BigNumber;
        let balanceOfCharlie = await token.balanceOf(charlie.address) as BigNumber;

        await token.connect(owner)._mint(alice.address, 10_000_000);
        balanceOf = balanceOf.add(10_000_000);
        expect(await token.balanceOf(alice.address)).to.equal(balanceOf);

        const approveAmount = 100_000;
        await token.connect(alice).approve(bob.address, approveAmount);

        const transferAmount = 50_000;
        await expect(token.connect(bob).transferFrom(alice.address, charlie.address, transferAmount))
            .to.emit(token, 'Transfer')
            .withArgs(alice.address, charlie.address, transferAmount);

        expect(await token.balanceOf(alice.address)).to.equal(balanceOf.sub(transferAmount));
        expect(await token.balanceOf(charlie.address)).to.equal(balanceOfCharlie.add(transferAmount));
        expect(await token.allowance(alice.address, bob.address)).to.equal(approveAmount - transferAmount);
    });

    describe('EIP-2612: permit & 712-signed approvals', () => {

        let chainId: number;
        let domain: ERC20Domain;

        before(async () => {
            chainId = (await token.provider.getNetwork()).chainId;
            domain = {
                name: await token.name(),
                version: "2",
                chainId,
                verifyingContract: token.address,
            };
        });

        it('should return corrent DOMAIN_SEPARATOR', async function () {
            expect(await token.DOMAIN_SEPARATOR())
                .to.be.equal(_TypedDataEncoder.hashDomain(domain));
        });

        it('should be able to approve spending via permit', async function () {
            async function permit(amount: number) {
                const nonce = await token.nonces(alice.address);
                const sig = await signERC2612Permit(
                    alice,
                    domain,
                    bob.address,
                    amount,
                    nonce,
                );
                await token.permit(alice.address, bob.address, amount, sig.deadline, sig.v, sig.r, sig.s);
                expect(await token.allowance(alice.address, bob.address)).to.be.equal(amount);
            }

            await permit(100_000);
            await permit(50_000);
        });

    });

});
