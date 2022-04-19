<script lang="ts">
    import { Contract } from "ethers";
    import { onMount } from "svelte";

    export let contract: Contract;
    let name: string = "";
    let symbol: string = "";
    let toAddress: string;

    onMount(async () => {
        name = await contract._name();
        symbol = await contract._symbol();
    });
</script>

<main>
    <h1>Hello Ethers!</h1>

    Name: {name}
    Symbol: {symbol}

    <button
        on:click={async () =>
            contract._mint(await contract.signer.getAddress(), 10_000_000)}
        >Mint to me</button
    >

    <input bind:value={toAddress} type="text" />
    <button on:click={() => contract.transfer(toAddress, 10_000)}
        >Transfer</button
    >

    <p>
        Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte
        apps.
    </p>

    <p>
        Check out <a href="https://github.com/sveltejs/kit#readme">SvelteKit</a>
        for the officially supported framework, also powered by Vite!
    </p>
</main>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }

    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4rem;
        font-weight: 100;
        line-height: 1.1;
        margin: 2rem auto;
        max-width: 14rem;
    }

    p {
        max-width: 14rem;
        margin: 1rem auto;
        line-height: 1.35;
    }

    @media (min-width: 480px) {
        h1 {
            max-width: none;
        }

        p {
            max-width: none;
        }
    }
</style>
