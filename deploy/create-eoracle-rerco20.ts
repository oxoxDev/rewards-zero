import { ethers, deployments, run } from "hardhat";

async function main() {
  console.log("Create EORACLE RERC20...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy RewardToken
  const restrictedERC20D = await deployments.deploy("EORACLE-RERC20", {
    contract: "RestrictedERC20",
    args: ["eOracle (ZeroLend)", "EO-ZL"],
    from: deployer.address,
  });

  // Verify the contract on Etherscan
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contract on Etherscan...");
    try {
      await run("verify:verify", {
        address: restrictedERC20D.address,
        constructorArguments: ["eOracle (ZeroLend)", "EO"],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.error("Error verifying contract:", error);
    }
  } else {
    console.log("Skipping verification - ETHERSCAN_API_KEY not set");
  }

  const restrictedERC20 = await ethers.getContractAt(
    "RestrictedERC20",
    restrictedERC20D.address
  );

  console.log("EORACLE RERC20 deployed to:", restrictedERC20D.address);

  const e18 = 10n ** 18n;

  const tx = await restrictedERC20.mint(deployer.address, e18 * 10010n);
  console.log("tx", tx.hash);
  await tx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
