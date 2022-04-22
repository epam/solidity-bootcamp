import { Contract, Signer } from "ethers";
import { Interface } from "ethers/lib/utils";
import { ethers } from "hardhat";

/**
 * 
 * @returns 
 */
export async function getUSDCFaucet() {
    const usdcAddr = '0x5425890298aed601595a70AB815c96711a31Bc65';

    const usdcFaucet = new Contract(usdcAddr, new Interface([
        "function configureMinter(address minter, uint256 minterAllowedAmount)",
        "function mint(address _to, uint256 _amount)",
    ]));

    const minter = (await ethers.getSigners())[0];
    await withImpersonateAccount(
        '0xe3b41fc3bd92fae6c8a05a83b234c51ff4c065d5',
        signer => usdcFaucet.connect(signer).configureMinter(minter.address, '0x1000000000000')
    );


    return async function (accountAddr: string, amountToClaim: number) {
        await usdcFaucet.connect(minter).mint(accountAddr, amountToClaim);
    };
}

/**
 * 
 * @param accountAddr 
 * @param action 
 */
export async function withImpersonateAccount(accountAddr: string, action: (signer: Signer) => Promise<void>) {
    const { ethers: { getSigner }, network: { provider } } = require('hardhat');

    await provider.request({ method: 'hardhat_impersonateAccount', params: [accountAddr] });
    await action(await getSigner(accountAddr));
    await provider.request({ method: 'hardhat_stopImpersonatingAccount', params: [accountAddr] });
}
