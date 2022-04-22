<script lang="ts">
    import { Contract, ethers, providers } from "ethers";
    import { getAddress } from "ethers/lib/utils";
    import { onMount } from "svelte";
    import { signERC2612Permit } from "../test/lib/sign";

    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const networkPromise = provider.getNetwork();

    export let contract: Contract;

    let chainId: number | null = null;
    let name: string = "";
    let symbol: string = "";
    let toAddress: string;
    let permitNonce = "";
    let permitAmount = "";
    let permitSignature: any;
    let ldtokenAddr = "";

    const USDC = new Contract(
        "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        new ethers.utils.Interface([
            "function nonces(address owner) view returns (uint256)",
        ]),
        provider
    );

    onMount(async () => {
        chainId = (await provider.getNetwork()).chainId;

        name = await contract._name();
        symbol = await contract._symbol();
    });

    async function handleSignPermit() {
        const n = 1;
        await USDC.nonces(await contract.signer.getAddress());
        const domain = {
            name: "USD Coin",
            version: "2",
            chainId: chainId!,
            verifyingContract: USDC.address,
        };

        permitSignature = await signERC2612Permit(
            contract.signer as any,
            domain,
            "0x5fbdb2315678afecb367f032d93f642f64180aa3",
            permitAmount,
            n
        );
        console.debug("Permit Signature:", permitSignature);
    }
</script>

<main>
    <h1>Hello Ethers!</h1>

    <section>
        <h3>Network Info</h3>

        {#await networkPromise}
            <div>waiting for network info...</div>
        {:then network}
            <div>Name: {network.name}</div>
            <div>Chain ID: {network.chainId}</div>
        {/await}
    </section>

    <section>
        <h3>LD Token Contract</h3>

        <input bind:value={ldtokenAddr} placeholder="LD token address" />
        <button
            on:click={async () => {
                name = await contract._name();
                symbol = await contract._symbol();
            }}>Get LD Token Info</button
        >
        <div>Name: {name}</div>
        <div>Symbol: {symbol}</div>
    </section>

    <button
        on:click={async () =>
            contract._mint(await contract.signer.getAddress(), 10_000_000)}
        >Mint to me</button
    >

    <input bind:value={toAddress} type="text" />
    <button on:click={() => contract.transfer(toAddress, 10_000)}
        >Transfer</button
    >

    <section>
        <h3>Sign Permit Approval</h3>
        <p>
            <button
                on:click={async () => {
                    permitNonce = await USDC.nonces(
                        await contract.signer.getAddress()
                    );
                }}>Nonce is {permitNonce}</button
            >
        </p>
        <input
            bind:value={permitAmount}
            type="number"
            placeholder="permit amount"
        />
        <button on:click={handleSignPermit}>Sign Permit</button>
    </section>
</main>

<footer>
    <p>
        Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte
        apps.
    </p>

    <p>
        Check out <a href="https://github.com/sveltejs/kit#readme">SvelteKit</a>
        for the officially supported framework, also powered by Vite!
    </p>
</footer>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }
</style>
