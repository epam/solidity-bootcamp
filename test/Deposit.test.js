const { expect } = require("chai");
const { ethers } = require("hardhat");

const { signERC2612Permit } = require('eth-permit');


describe("Deposit", function () {

    async function withImpersonateAccount(accountAddr, action) {
        const { ethers: { getSigner }, network: { provider } } = require('hardhat');

        await provider.request({ method: 'hardhat_impersonateAccount', params: [accountAddr] });
        await action(await getSigner(accountAddr));
        await provider.request({ method: 'hardhat_stopImpersonatingAccount', params: [accountAddr] });
    }

    async function withUSDCFaucet(action) {
        const usdcAddr = '0x5425890298aed601595a70AB815c96711a31Bc65';

        const usdcFaucet = new ethers.Contract(usdcAddr, new ethers.utils.Interface([
            "function configureMinter(address minter, uint256 minterAllowedAmount)",
            "function mint(address _to, uint256 _amount)",
        ]));

        const minter = (await ethers.getSigners())[0];
        await withImpersonateAccount(
            '0xe3b41fc3bd92fae6c8a05a83b234c51ff4c065d5',
            signer => usdcFaucet.connect(signer).configureMinter(minter.address, '0x1000000000000')
        );

        await action(
            async function (accountAddr, amountToClaim) {
                await usdcFaucet.connect(minter).mint(accountAddr, amountToClaim);
            }
        );
    }

    before(async () => {
        const [owner, alice, bob] = await ethers.getSigners();

        await withUSDCFaucet(async faucet => {
            // const amountToClaim = bn(100_000_000);
            const amountToClaim = 100_000;

            for (const user of [owner, alice, bob]) {
                await faucet(user.address, amountToClaim);
            }
        });

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

        const result = await signERC2612Permit(ethers.provider, domain, sender, store.address, value);
        console.log(result);

        // await token.methods.permit(senderAddress, store.address, value, result.deadline, result.v, result.r, result.s).send({
        //     from: senderAddress,
        // });

        await (await store.connect(owner).deposit(value, result.deadline, result.v, result.r, result.s)).wait();
    });
});
