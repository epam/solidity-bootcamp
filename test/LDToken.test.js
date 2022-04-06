const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LDToken", function () {

    it("should ...", async function () {
        const [_, owner, alice] = await ethers.getSigners();

        const LDToken = await ethers.getContractFactory("LDToken");
        const token = await LDToken.deploy("Learn Sol", "LD");
        await token.deployed();

        expect(await token._name()).to.equal("Learn Sol");
        expect(await token._symbol()).to.equal("LD");

        expect(await token.balanceOf(alice.address)).to.equal(0);
        await token.connect(owner)._mint(alice.address, 10_000_000);
        expect(await token.balanceOf(alice.address)).to.equal(10_000_000);
    });

});
