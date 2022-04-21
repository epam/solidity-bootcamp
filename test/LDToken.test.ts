import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

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
        expect(await token._name()).to.equal('Learning&Development Solidity');
        expect(await token._symbol()).to.equal('LDT');
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

});
