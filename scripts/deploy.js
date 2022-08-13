const hre = require("hardhat");
const {utils} = require("ethers"); 


//deplyed at 0x6C8077689afd414e40E0C1e1403270e456060cC2
async function main() {
    let BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");

    let buyMeACoffee = await BuyMeACoffee.deploy();
  
    await buyMeACoffee.deployed();
  
    console.log("BuyMeACoffee deployed at:",buyMeACoffee.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });