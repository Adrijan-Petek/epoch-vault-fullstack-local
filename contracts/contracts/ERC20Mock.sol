// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initial) ERC20(name, symbol) {
        _mint(msg.sender, initial);
    }

    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
