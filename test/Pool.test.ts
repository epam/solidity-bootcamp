import { expect } from "chai";
import { ethers } from "hardhat";

describe("Pool", function () {

    it("should be able to make a deposit", async function () {
        const [_, owner, alice] = await ethers.getSigners();

        const Pool = await ethers.getContractFactory("Pool");
        const pool = await Pool.deploy(owner.address);
        await pool.deployed();

        expect(await pool.getAmount(alice.address)).to.equal(0);
        await pool.connect(alice).deposit(1000);
        expect(await pool.getAmount(alice.address)).to.equal(1000);
    });

});
