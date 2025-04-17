import { ethers } from "hardhat";

async function main() {
  console.log("Starting RewardToken deposit...");

  const [deployer] = await ethers.getSigners();

  const token = await ethers.getContractAt(
    "RewardToken",
    "0xe35e2DEC86d09d6F95FF4045985f4054592c5A6e"
  );

  const e18 = 10n ** 18n;

  const zero = await ethers.getContractAt(
    "ERC20WrapperLocked",
    "0x486E2f66cD5F38772164237C69d8304045eE1651"
  );

  const tx1 = await zero.approve(token.target, ethers.MaxUint256);
  console.log("tx1", tx1.hash);
  await tx1.wait();

  const statusAdmin = await token.WHITELIST_STATUS_ADMIN();
  const statusDistributor = await token.WHITELIST_STATUS_DISTRIBUTOR();

  const tx2 = await token["setWhitelistStatus(address,uint256)"](
    deployer.address,
    statusAdmin
  );
  console.log("tx2", tx2.hash);
  await tx2.wait();

  const tx3 = await token["setWhitelistStatus(address,uint256)"](
    "0x8BB4C975Ff3c250e0ceEA271728547f3802B36Fd", // merkl on linea
    statusDistributor
  );
  console.log("tx3", tx3.hash);

  const depositTx = await token.depositFor(deployer.address, e18 * 100000000n);
  console.log("depositTx", depositTx.hash);
  await depositTx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
