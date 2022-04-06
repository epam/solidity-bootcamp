const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Pool", function () {

    it("should ...", async function () {
        const [_, owner, alice] = await ethers.getSigners();

        const Pool = await ethers.getContractFactory("Pool");
        const pool = await Pool.deploy(owner.address);
        await pool.deployed();

        expect(await pool.getAmount(alice.address)).to.equal(0);
        await pool.connect(alice).deposit(1000);
        expect(await pool.getAmount(alice.address)).to.equal(1000);
    });

});
