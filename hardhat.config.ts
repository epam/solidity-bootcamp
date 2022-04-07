import { task } from 'hardhat/config';

import '@nomiclabs/hardhat-waffle';
import 'hardhat-gas-reporter';

/**
 * 
 */
const chains = {
  fuji: {
    url: 'https://api.avax-test.network/ext/bc/C/rpc',
    chainId: 43113,
    forking: {
      blockNumber: 7461390
    },
    contracts: {
      usdcAddr: '0x5425890298aed601595a70AB815c96711a31Bc65',
    }
  }
};

/**
 * Defines the chain config to use based on the value of the `FORK`
 * environment variable.
 * It can be `undefined`.
 */
const chain = (() => {
  const FORK = process.env.FORK;
  if (!FORK) {
    return undefined;
  } else if (FORK in chains) {
    return chains[FORK as keyof typeof chains];
  }
  console.error(`Forking from chain '${FORK}' not supported, set \`FORK\` to one of the following: ${Object.keys(chains)}\n`);
  process.exit(1);
})();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: "0.8.4",
  networks: {
    hardhat: chain ? {
      forking: {
        url: chain.url,
        blockNumber: chain.forking.blockNumber,
      },
      chainId: chain.chainId,
    } : {},
    fuji: {
      url: chains.fuji.url,
      gasPrice: 225000000000,
      chainId: chains.fuji.chainId,
      accounts: process.env.PRIVATE_KEY !== undefined ? ['' + process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
  },
};
