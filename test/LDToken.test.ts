import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe("LDToken", function () {

    let owner: SignerWithAddress;
    let alice: SignerWithAddress;

    let token: Contract;

    before(async function () {
        [owner, alice] = await ethers.getSigners();

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

});
