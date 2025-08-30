// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

// import erc20
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MelodleToken is ERC20 {
    constructor() ERC20("MelodleToken", "MDL") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
