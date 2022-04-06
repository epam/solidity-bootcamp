const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Store", function () {
    it("Should return the new greeting once it's changed", async function () {
        const Store = await ethers.getContractFactory("Store");
        const store = await Store.deploy();
        await store.deployed();

        await (await store.newItem(4, 10)).wait();
        await (await store.addUnitsWithStorage(1, 5)).wait();
        expect(await store.getWithStorage(0)).to.equal(15);
        await (await store.addUnitsWithMemory(1, 5)).wait();
        expect(await store.getWithStorage(0)).to.equal(15);
    });
});
