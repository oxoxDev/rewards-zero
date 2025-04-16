import { ethers, run, deployments } from "hardhat";
import { RewardToken } from "../types/contracts/RewardToken";

async function main() {
  console.log("Starting RewardToken deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the ZERO token address from environment variable
  const ZERO_TOKEN_ADDRESS = "0x486E2f66cD5F38772164237C69d8304045eE1651";

  // Get the remainder receiver address from environment variable
  const REMAINDER_RECEIVER_ADDRESS =
    "0x54061E18cd88D2de9af3D3D7FDF05472253B29E0";

  // Deploy RewardToken
  const rewardToken = await deployments.deploy("ZeroRewardToken", {
    contract: "RewardToken",
    from: deployer.address,
    waitConfirmations: 5,
    args: [
      deployer.address, // owner
      REMAINDER_RECEIVER_ADDRESS, // remainder receiver
      ZERO_TOKEN_ADDRESS, // underlying token (ZERO)
    ],
  });

  const rewardTokenAddress = await rewardToken.address;
  console.log("RewardToken deployed to:", rewardTokenAddress);

  // Verify the contract on Etherscan
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contract on Etherscan...");
    try {
      await run("verify:verify", {
        address: rewardTokenAddress,
        constructorArguments: [
          deployer.address,
          REMAINDER_RECEIVER_ADDRESS,
          ZERO_TOKEN_ADDRESS,
        ],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.error("Error verifying contract:", error);
    }
  } else {
    console.log("Skipping verification - ETHERSCAN_API_KEY not set");
  }

  console.log("Deployment completed successfully!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
