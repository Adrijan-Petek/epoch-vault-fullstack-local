// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./SoulboundReceipt.sol";

contract EpochVault {
    using SafeMath for uint256;

    IERC20 public immutable stakingToken;
    SoulboundReceipt public immutable receipt;
    address public owner;

    uint256 public epochDuration;
    uint256 public currentEpochStart;
    uint256 public epochId;

    mapping(uint256 => uint256) public snapshotBalances;
    mapping(uint256 => address) public receiptOwner;

    event Deposited(address indexed user, uint256 amount, uint256 receiptId);
    event EpochSnapshot(uint256 indexed epochId, uint256 timestamp);
    event RewardsDistributed(uint256 indexed epochId, uint256 rewardAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    constructor(IERC20 _stakingToken, SoulboundReceipt _receipt, uint256 _epochDuration) {
        stakingToken = _stakingToken;
        receipt = _receipt;
        owner = msg.sender;
        epochDuration = _epochDuration;
        currentEpochStart = block.timestamp;
        epochId = 1;
    }

    function deposit(uint256 amount) external returns (uint256) {
        require(amount > 0, "zero");
        stakingToken.transferFrom(msg.sender, address(this), amount);
        uint256 rid = receipt.mint(msg.sender);
        receiptOwner[rid] = msg.sender;
        snapshotBalances[rid] = snapshotBalances[rid].add(amount);
        emit Deposited(msg.sender, amount, rid);
        return rid;
    }

    function snapshotEpoch() external onlyOwner {
        currentEpochStart = block.timestamp;
        epochId = epochId.add(1);
        emit EpochSnapshot(epochId, block.timestamp);
    }

    function distributeEpochRewards(uint256 rewardAmount) external onlyOwner {
        require(rewardAmount > 0, "no rewards");
        uint256 total = 0;
        uint256 count = receipt.totalSupply();
        for (uint256 i = 1; i <= count; i++) {
            total = total.add(snapshotBalances[i]);
        }
        require(total > 0, "no stakes");
        for (uint256 i = 1; i <= count; i++) {
            uint256 bal = snapshotBalances[i];
            if (bal == 0) continue;
            address to = receipt.ownerOf(i);
            uint256 share = rewardAmount.mul(bal).div(total);
            stakingToken.transfer(to, share);
        }
        emit RewardsDistributed(epochId, rewardAmount);
    }

    function adminWithdraw(address to, uint256 amount) external onlyOwner {
        stakingToken.transfer(to, amount);
    }
}
