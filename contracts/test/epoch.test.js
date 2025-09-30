const { expect } = require('chai');
const { ethers, network } = require('hardhat');

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

    await receipt.transferOwnership(vault.address);

    await token.faucet(user1.address, ethers.utils.parseEther('1000'));
    await token.faucet(user2.address, ethers.utils.parseEther('1000'));

    await token.connect(user1).approve(vault.address, ethers.utils.parseEther('100'));
    await vault.connect(user1).deposit(ethers.utils.parseEther('100'));

    await token.connect(user2).approve(vault.address, ethers.utils.parseEther('300'));
    await vault.connect(user2).deposit(ethers.utils.parseEther('300'));

    await token.transfer(vault.address, ethers.utils.parseEther('200'));

    // Fast forward time to end epoch
    await network.provider.send("evm_increaseTime", [3601]);
    await network.provider.send("evm_mine");

    await vault.distributeEpochRewards(ethers.utils.parseEther('200'));

    const bal1 = await token.balanceOf(user1.address);
    const bal2 = await token.balanceOf(user2.address);

    expect(bal1.eq(ethers.utils.parseEther('950'))).to.be.true;
    expect(bal2.eq(ethers.utils.parseEther('850'))).to.be.true;
  });
});
