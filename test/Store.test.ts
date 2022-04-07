import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Store', function () {
    it('should be able to create items and add units', async function () {
        const Store = await ethers.getContractFactory("Store");
        const store = await Store.deploy();
        await store.deployed();

        await (await store.newItem(4, 10)).wait();
        await (await store.addUnitsWithStorage(0, 5)).wait();
        expect(await store.getWithStorage(0)).to.equal(15);
        // await (await store.addUnitsWithMemory(0, 5)).wait();
        expect(await store.getWithStorage(0)).to.equal(15);
    });
});
