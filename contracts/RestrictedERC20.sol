// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RestrictedERC20 is ERC20, Ownable {
    mapping(address => bool) public isWhitelisted;
    bool public paused;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender) {
        isWhitelisted[msg.sender] = true;
        isWhitelisted[address(0)] = true;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external onlyOwner {
        _burn(msg.sender, amount);
    }

    function togglePause() external onlyOwner {
        paused = !paused;
    }

    function whitelist(address account) external onlyOwner {
        isWhitelisted[account] = true;
    }

    function blacklist(address account) external onlyOwner {
        isWhitelisted[account] = false;
    }

    function _update(address from, address to, uint256 amount) internal virtual override {
        require(!paused, "Contract is paused");
        require(isWhitelisted[from], "Not whitelisted");
        super._update(from, to, amount);
    }
}
