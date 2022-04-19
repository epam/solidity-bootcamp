import { Contract, ethers } from 'ethers';
import App from './App.svelte'
import ldtoken from '../artifacts/contracts/LDToken.sol/LDToken.json'

function deploy() {
    console.info('metamask provider', window.ethereum);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const token = new Contract('0x5fbdb2315678afecb367f032d93f642f64180aa3', ldtoken.abi, provider.getSigner());
    return token;
}

export default new App({
    target: document.getElementById('app')!,
    props: {
        contract: deploy()
    },
});
