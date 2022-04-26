<script lang="ts">
    import { Contract, ethers } from "ethers";
    import { onMount } from "svelte";
    import { signERC2612Permit } from "../test/lib/sign";

    import LDToken from "../artifacts/contracts/LDToken.sol/LDToken.json";
    import Deposit from "../artifacts/contracts/Deposit.sol/Deposit.json";

    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const networkPromise = provider.getNetwork();

    const token = new Contract(
        "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        LDToken.abi,
        provider.getSigner()
    );

    const deposit = new Contract(
        "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        Deposit.abi,
        provider.getSigner()
    );

    let name: string = "";
    let symbol: string = "";
    let toAddress: string;
    let permitNonce = "";
    let amount = "";
    let sig: any;

    onMount(async () => {
        name = await token.name();
        symbol = await token.symbol();
    });

    async function handleSignPermit() {
        const chainId = (await provider.getNetwork()).chainId;
        const nonce = await token.nonces(await token.signer.getAddress());
        const domain = {
            name: await token.name(),
            version: "2",
            chainId: chainId!,
            verifyingContract: token.address,
        };

        sig = await signERC2612Permit(
            token.signer as any,
            domain,
            deposit.address,
            amount,
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
        <h3>LD Token</h3>
        <p>Name: {name}</p>
        <p>Symbol: {symbol}</p>
        <p>
            <button
                on:click={async () =>
                    token._mint(await token.signer.getAddress(), 10_000_000)}
                >Mint to me</button
            >
        </p>
    </section>

    <p>
        <input bind:value={toAddress} type="text" />
        <button on:click={() => token.transfer(toAddress, 10_000)}
            >Transfer To</button
        >
    </p>
    <section>
        <h3>Deposit</h3>
        <input
            bind:value={amount}
            type="number"
            placeholder="amount to deposit"
        />

        <p>
            <span style="font-style: oblique;">using approve</span>

            <button on:click={() => token.approve(deposit.address, amount)}
                >Approve To</button
            >
            <button on:click={() => deposit.approveDeposit(amount)}
                >Deposit</button
            >
        </p>
        <p>
            <span style="font-style: oblique;"> using signed permit</span>
            <button
                on:click={async () => {
                    permitNonce = await token.nonces(
                        await token.signer.getAddress()
                    );
                }}>Nonce is {permitNonce}</button
            >
            <button on:click={handleSignPermit}>Sign Permit</button>
            <button
                on:click={() =>
                    deposit.permitDeposit(
                        amount,
                        sig.deadline,
                        sig.v,
                        sig.r,
                        sig.s
                    )}>Deposit</button
            >
        </p>
        <p />
    </section>
</main>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }
</style>
