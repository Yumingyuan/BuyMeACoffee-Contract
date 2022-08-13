require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const GOERLI_URL = process.env.GOERLI_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MAIN_URL = process.env.MAIN_URL;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks:{
    goerli:{
      url:GOERLI_URL,
      accounts: [PRIVATE_KEY]
    },
    mainnet:{
      url:MAIN_URL,
      accounts: [PRIVATE_KEY]
    }
  }
};
