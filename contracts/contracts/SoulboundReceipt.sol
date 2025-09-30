// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Minimal soulbound token to represent user's stake position per epoch
contract SoulboundReceipt is ERC721Enumerable, Ownable {
    mapping(uint256 => bool) public locked;
    uint256 private _idCounter;

    constructor() ERC721("EpochReceipt", "EPOCH") {}

    function mint(address to) external onlyOwner returns (uint256) {
        _idCounter++;
        uint256 id = _idCounter;
        _safeMint(to, id);
        locked[id] = true;
        return id;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override {
        // Prevent transfers after mint (soulbound)
        require(from == address(0), "SBT: non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}
