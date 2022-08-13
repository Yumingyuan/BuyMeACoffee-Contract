// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const {utils} = require("ethers"); 
const { ethers } = require("hardhat");

//return the balance
async function getBalance(address){
  let balanceBigNumber = await hre.ethers.provider.getBalance(address);
  return utils.formatEther(balanceBigNumber);
}

// print balance of each address
async function printBalances(addresses)
{
  let idx = 0;
  for (const address of addresses){
    console.log(`Address ${idx} balance:`,await getBalance(address));
    idx++
  }
}

//Logs the memos stored on-chain from coffee purchases
async function printMemos(memos){
  for (const memo of memos){
    let timestamp = memo.timestamp;
    let tipper = memo.name;
    let tipperAddress = memo.sender;
    let message = memo.message;
    console.log(`At ${timestamp},${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
  // Get example accounts

  let [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  //console.log(owner);
  //console.log(tipper);



  // Get the contract to deploy and get deployed address

  let BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");

  let buyMeACoffee = await BuyMeACoffee.deploy();

  await buyMeACoffee.deployed();

  console.log("BuyMeACoffee deployed at:",buyMeACoffee.address);

  // Check balances before the coffee purchase
  let address = [owner.address,tipper.address,buyMeACoffee.address];

  console.log("============ Start ==============");

  await printBalances(address)

  // Buy the owner a few coffees

  let tips = {value: hre.ethers.utils.parseEther("1")};

  await buyMeACoffee.connect(tipper).buyCoffee("tipper1","Godd luck from tipper1",tips);

  await buyMeACoffee.connect(tipper2).buyCoffee("tipper2","Godd luck from tipper2",tips);

  await buyMeACoffee.connect(tipper3).buyCoffee("tipper3","Good Good Study from tipper3",tips);

  // Check balances after coffee purchase
  console.log("============ Bought coffee ==============");

  await printBalances(address);

  // Withdraw funds

  console.log("============ Withdraw Tips ==============");
  await buyMeACoffee.connect(owner).withdrawTips();

  // Check balance after withdraw
  await printBalances(address);

  // Read all memos left for the owner
  console.log("============ Memos ==============");
  let memos = await buyMeACoffee.getMemos();
  printMemos(memos);

  // Set permission of address
  console.log("======= Set permission of address ==========");
  await buyMeACoffee.connect(owner).set_permission(tipper.address);
  await buyMeACoffee.connect(tipper3).buyCoffee("tipper3","Good Good Study from tipper3",tips);
  console.log(`${tipper.address} get permission`);
  
  // Withdraw after set permission
  console.log("======= Before Withdraw by tipper =========");
  await printBalances(address);
  await buyMeACoffee.connect(tipper).withdrawTips();
  console.log("======= After Withdraw by tipper =========");
  await printBalances(address);

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
