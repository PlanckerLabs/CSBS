require("@nomicfoundation/hardhat-toolbox");

// require("dotenv").config();

// require("@nomiclabs/hardhat-etherscan");
// require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ethers");
// require("hardhat-gas-reporter");
// require("solidity-coverage");

const GOERLI_PRIVATE_KEY = "f99263310141b706c82049e39cd47dafb26fe3df07541ae0c42e1240190e07da";
const POLYGON_MUMBAI_RPC_PROVIDER = "https://rpc-mumbai.maticvigil.com";

const POLYGONSCAN_API_KEY = "HDWAWSWCQ17R5PT7H4BB13ZDSEX7HSKCN5";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    mumbai: {
      url: POLYGON_MUMBAI_RPC_PROVIDER,
      accounts: [GOERLI_PRIVATE_KEY],
    },
  },  
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },
};
