import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, Signer } from "ethers";
import { Interface } from "ethers/lib/utils";
import { ethers } from "hardhat";

/**
 * The `Domain` is used to create the `DOMAIN_SEPARATOR` value,
 * as specified by https://eips.ethereum.org/EIPS/eip-712.
 * 
 * This value is used to differentiate signatures coming from different contracts.
 */
interface ERC20Domain {

    /**
     * The `name` the ERC20 contract was assigned to.
     */
    name: string;

    /**
     * The current major version of the signing domain.
     * Signatures from different versions are not compatible.
     */
    version: string;

    /**
     * The EIP-155 chain id.
     * The user-agent should refuse signing if it does not match the currently active chain.
     * 
     * See https://eips.ethereum.org/EIPS/eip-155 for more info on EIP-155.
     */
    chainId: number;

    /**
     * The address of the contract that will verify the signature.
     * The user-agent may do contract specific phishing prevention.
     */
    verifyingContract: string;
}

/**
 * Signs a permit message as defined by EIP-2612 https://eips.ethereum.org/EIPS/eip-2612.
 * This mechanism enables the user to aprove tokens without spending gas.
 * 
 * For more information on gasless tokens aprovals see
 * https://soliditydeveloper.com/erc20-permit.
 * 
 * This implementation is adapted from
 * https://github.com/dmihal/eth-permit/blob/master/src/eth-permit.ts. 
 */
export async function signERC2612Permit(
    signer: SignerWithAddress,
    erc20Domain: ERC20Domain,
    spender: string,
    value: number | string,
    nonce: number | string,
) {
    const MAX_INT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

    const message = {
        owner: await signer.getAddress(),
        spender,
        value,
        nonce,
        deadline: MAX_INT,
    };

    const types = {
        Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
        ],
    };

    const rawSig = await signer._signTypedData(erc20Domain, types, message);

    const sig = {
        r: '0x' + rawSig.substring(2).substring(0, 64),
        s: '0x' + rawSig.substring(2).substring(64, 128),
        v: parseInt(rawSig.substring(2).substring(128, 130), 16),
    }

    return { ...sig, ...message };
};

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