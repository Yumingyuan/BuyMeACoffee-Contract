const hre = require("hardhat");
const {utils} = require("ethers"); 
const {abi} = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

//get the balance of contract
async function getBalance(provider,address) {
    let balance = await provider.getBalance(address);
    //console.log("======== getBalance ============");
    //console.log(`Balance of ${address} is ${hre.ethers.utils.formatEther(balance)}`);
    return hre.ethers.utils.formatEther(balance);
}


//deplyed at 0x405d8834EE6272Dc51eba1AB9f074c53fBBd104F
async function main() {
    let contractAddress = "0x405d8834EE6272Dc51eba1AB9f074c53fBBd104F";
    let contractABI = abi;

    //get alchemy provider
    let provider = new hre.ethers.providers.AlchemyProvider("goerli",process.env.GOERLI_API);

    //Get signer from env, make sure this is the creator of contract
    let signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY,provider);

    //Initiate the contract
    let BuyMeACoffee = new hre.ethers.Contract(contractAddress,contractABI,signer);

    //Checking the starting balance
    let contract_balance_result = await getBalance(provider,BuyMeACoffee.address);
    let owner_balance_result = await getBalance(provider,signer.address);
    console.log("Current balance of contract:",contract_balance_result,"ETH");
    console.log("Current balance of owner:",owner_balance_result,"ETH");

    //Check status of contract, if zero not withdraw
    if(contract_balance_result!="0.0")
    {
        console.log("===== Withdraw from the Contract ==========");
        let withdraw_result = await BuyMeACoffee.connect(signer).withdrawTips();
        //let withdraw_Txn = withdraw_result.wait();
        //console.log(`Withdraw tips result ${withdraw_Txn}`);
        let contract_balance = await getBalance(provider,BuyMeACoffee.address);
        let owner_balance = await getBalance(provider,signer.address);
        console.log("After withdraw operation:");
        console.log("Current balance of contract:",contract_balance,"ETH");
        console.log("Current balance of owner:",owner_balance,"ETH");

    }else{
        console.log("Nothing to withdraw");
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });