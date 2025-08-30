// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./MelodleToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MelodleVault is Ownable {
    MelodleToken public token;
    uint256 public melodyTotalAttempts;
    uint256 public wordTotalAttempts;
    bytes32 private melodyAnswer;
    bytes32 private wordAnswer;
    uint256 public melodyVault;
    uint256 public wordVault;

    modifier onlyMelodyProcessing() {
        require(melodyAnswer != bytes32(0), "No melody processing in progress");
        _;
    }

    modifier onlyWordProcessing() {
        require(wordAnswer != bytes32(0), "No word processing in progress");
        _;
    }

    constructor() payable Ownable(msg.sender) {
        token = new MelodleToken();
    }

    function _correctMelody(address user) internal {
        token.transfer(user, melodyVault);
    }

    function _correctWord(address user) internal {
        token.transfer(user, wordVault);
    }

    function _incorrect() internal {
        // msg.sender transfer eth to address(this)
    }

    function redeem(uint256 amount) external {
        // msg.sender로부터 이 컨트랙트로 토큰을 전송
        token.transferFrom(msg.sender, address(this), amount);

        // 컨트랙트가 보유한 ETH를 msg.sender에게 전송
        payable(msg.sender).transfer(amount / 100); // 1 MDL = 0.01 ETH
    }

    function createMelody(bytes32 answer) external onlyOwner {
        melodyTotalAttempts = 0;
        melodyAnswer = answer;
    }

    function createWord(bytes32 answer) external onlyOwner {
        wordTotalAttempts = 0;
        wordAnswer = answer;
    }

    function submitMelody(
        bytes32 guess
    ) external payable onlyMelodyProcessing returns (bool) {
        melodyTotalAttempts++;

        if (guess == melodyAnswer) {
            _correctMelody(msg.sender);
            payable(msg.sender).transfer(msg.value);
            melodyVault = 50000;
            melodyAnswer = bytes32(0);
            return true;
        } else {
            _incorrect();
            melodyVault += msg.value;
            melodyVault += 50000;
            return false;
        }
    }

    function submitWord(
        bytes32 guess
    ) external payable onlyWordProcessing returns (bool) {
        wordTotalAttempts++;

        if (guess == wordAnswer) {
            _correctWord(msg.sender);
            payable(msg.sender).transfer(msg.value);
            wordVault = 50000;
            wordAnswer = bytes32(0);
            return true;
        } else {
            _incorrect();
            wordVault += msg.value;
            wordVault += 50000;
            return false;
        }
    }
}
