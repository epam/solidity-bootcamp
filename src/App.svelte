<script lang="ts">
    import { Contract, ethers, providers } from "ethers";
    import { getAddress } from "ethers/lib/utils";
    import { onMount } from "svelte";
    import { signERC2612Permit } from "../test/lib/sign";

    import ldtoken from "../artifacts/contracts/LDToken.sol/LDToken.json";
    import depositSol from "../artifacts/contracts/Deposit.sol/Deposit.json";
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const networkPromise = provider.getNetwork();

    const contract = new Contract(
        "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        ldtoken.abi,
        provider.getSigner()
    );

    const deposit = new Contract(
        "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        depositSol.abi,
        provider.getSigner()
    );

    const contract2 = new Contract(
        "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        // ["function approve(address, uint256) returns (bool)"],
        ["function _approve(address, uint256) external returns (bool)"],
        provider.getSigner()
    );
    let chainId: number | null = null;
    let name: string = "";
    let symbol: string = "";
    let toAddress: string;
    let approveAddress: string;
    let permitNonce = "";
    let permitAmount = "";
    let sig: any;
    let ldtokenAddr = "";

    onMount(async () => {
        chainId = (await provider.getNetwork()).chainId;
        name = await contract._name();
        symbol = await contract._symbol();
    });

    async function handleSignPermit() {
        const nonce = await contract.nonces(await contract.signer.getAddress());
        const domain = {
            name: await contract._name(),
            version: "2",
            chainId: chainId!,
            verifyingContract: contract.address,
        };

        sig = await signERC2612Permit(
            contract.signer as any,
            domain,
            deposit.address,
            permitAmount,
            nonce
        );
        console.debug("Permit Signature:", sig);
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

    <p>
        <button
            on:click={async () =>
                contract._mint(await contract.signer.getAddress(), 10_000_000)}
            >Mint to me</button
        >
    </p>
    <p>
        <input bind:value={toAddress} type="text" />
        <button on:click={() => contract.transfer(toAddress, 10_000)}
            >Transfer To</button
        >
    </p>
    <p>
        <input bind:value={approveAddress} type="text" />
        <button on:click={() => contract2._approve(approveAddress, 20_000)}
            >Approve To</button
        >
        <button on:click={() => deposit.approveDeposit(20_000)}>Deposit</button>
    </p>

    <section>
        <h3>Sign Permit Approval</h3>
        <p>
            <button
                on:click={async () => {
                    permitNonce = await contract.nonces(
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
        <button
            on:click={() =>
                deposit.permitDeposit(
                    permitAmount,
                    sig.deadline,
                    sig.v,
                    sig.r,
                    sig.s
                )}>Deposit</button
        >
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
