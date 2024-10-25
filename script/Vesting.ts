import { ethers } from "hardhat";
import hre from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy("reliable", "RLB");

  await token.waitForDeployment();

  console.log("Token deployed to:", token.target);


  const TokenVesting = await ethers.getContractFactory("TokenVesting");
  const tokenVesting = await TokenVesting.deploy(token.target);

  await tokenVesting.waitForDeployment();
  console.log("TokenVesting deployed to:", tokenVesting.target);

  



  const [beneficiary] = await ethers.getSigners();
  console.log("Adding beneficiary:", beneficiary.address);

  const startTime = Math.floor(Date.now() / 1000) + 60;
  const duration = 365 * 24 * 60 * 60;
  const totalAmount = ethers.parseEther("10000");

  const tx = await tokenVesting.addBeneficiary(
    beneficiary.address,
    startTime,
    duration,
    totalAmount
  );
  await tx.wait();
  console.log("Beneficiary added successfully");

  

  const timeAded = startTime + duration;

  await time.increaseTo(timeAded);

  console.log("Time Added successfully");

  
  const beneficiaryBalance = await token.balanceOf(beneficiary.address);
  console.log("Beneficiary's token balance:", ethers.formatEther(beneficiaryBalance), "KAN");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });