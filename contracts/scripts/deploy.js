const hre = require('hardhat');

async function main() {
  const [deployer, user1] = await hre.ethers.getSigners();
  console.log('Deploying with account:', deployer.address);

  const ERC20Mock = await hre.ethers.getContractFactory('ERC20Mock');
  const token = await ERC20Mock.deploy('MockToken', 'MCK', hre.ethers.utils.parseEther('1000000'));
  await token.deployed();
  console.log('ERC20Mock deployed:', token.address);

  const Receipt = await hre.ethers.getContractFactory('SoulboundReceipt');
  const receipt = await Receipt.deploy();
  await receipt.deployed();
  console.log('Receipt deployed:', receipt.address);

  const EpochVault = await hre.ethers.getContractFactory('EpochVault');
  const vault = await EpochVault.deploy(token.address, receipt.address, 3600);
  await vault.deployed();
  console.log('EpochVault deployed:', vault.address);
}

main().catch((e) => { console.error(e); process.exit(1); });
