const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('EpochVault basic flow', function () {
  it('deposit and distribute', async function () {
    const [deployer, user1, user2] = await ethers.getSigners();
    const ERC20Mock = await ethers.getContractFactory('ERC20Mock');
    const token = await ERC20Mock.deploy('MockToken', 'MCK', ethers.utils.parseEther('1000000'));
    await token.deployed();

    const Receipt = await ethers.getContractFactory('SoulboundReceipt');
    const receipt = await Receipt.deploy();
    await receipt.deployed();

    const EpochVault = await ethers.getContractFactory('EpochVault');
    const vault = await EpochVault.deploy(token.address, receipt.address, 3600);
    await vault.deployed();

    await token.faucet(user1.address, ethers.utils.parseEther('1000'));
    await token.faucet(user2.address, ethers.utils.parseEther('1000'));

    await token.connect(user1).approve(vault.address, ethers.utils.parseEther('100'));
    await vault.connect(user1).deposit(ethers.utils.parseEther('100'));

    await token.connect(user2).approve(vault.address, ethers.utils.parseEther('300'));
    await vault.connect(user2).deposit(ethers.utils.parseEther('300'));

    await token.transfer(vault.address, ethers.utils.parseEther('200'));

    await vault.distributeEpochRewards(ethers.utils.parseEther('200'));

    const bal1 = await token.balanceOf(user1.address);
    const bal2 = await token.balanceOf(user2.address);

    expect(bal1).to.equal(ethers.utils.parseEther('950'));
    expect(bal2).to.equal(ethers.utils.parseEther('850'));
  });
});
