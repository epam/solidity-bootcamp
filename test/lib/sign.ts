import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { Signer } from "ethers";

/**
 * The `Domain` is used to create the `DOMAIN_SEPARATOR` value,
 * as specified by https://eips.ethereum.org/EIPS/eip-712.
 * 
 * This value is used to differentiate signatures coming from different contracts.
 */
export interface ERC20Domain {

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
 * 
 * See also https://docs.ethers.io/v5/api/signer/#Signer-signTypedData.
 */
export async function signERC2612Permit(
    signer: Signer & TypedDataSigner,
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