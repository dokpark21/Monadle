"use client";

import React, { useState, useEffect } from "react";
import {
  AppContainer,
  GameContainer,
  Title,
  FeedbackMessage,
} from "@/components/styled/GameStyles";
import PianoKeyboard from "./PianoKeyboard";
import MelodyDisplay from "./MelodyDisplay";
import GameControls from "./GameControls";
import GameInfo from "./GameInfo";
import PotDisplay from "./PotDisplay";
import WalletButton from "@/components/wallet/WalletButton";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useContract } from "@/hooks/useContract";

const MelodleGame: React.FC = () => {
  const {
    gameState,
    playingIndex,
    showCoinDrops,
    selectNote,
    playMelody,
    checkAnswer,
    resetGame,
    removeNote,
  } = useGameLogic();

  const { getMelodyVault } = useContract();
  const [contractPotTokens, setContractPotTokens] = useState<number>(0);

  // 컨트랙트에서 melodyVault 값 주기적으로 가져오기
  useEffect(() => {
    const fetchPotTokens = async () => {
      try {
        const vaultValue = await getMelodyVault();
        // ETH 단위를 토큰 단위로 변환 (1 ETH = 100 토큰으로 가정)
        const tokens = Math.floor(parseFloat(vaultValue) * 100);
        setContractPotTokens(tokens);
        console.log('컨트랙트 Pot 토큰 업데이트:', tokens);
      } catch (error) {
        console.error('컨트랙트에서 Pot 토큰을 가져오는 중 오류:', error);
        // 오류 시 로컬 상태 사용
        setContractPotTokens(gameState.potTokens);
      }
    };

    // 초기 로드
    fetchPotTokens();

    // 10초마다 업데이트
    const interval = setInterval(fetchPotTokens, 10000);

    return () => clearInterval(interval);
  }, [getMelodyVault, gameState.potTokens]);

  return (
    <AppContainer>
      <WalletButton />
      <Title>MELODY WORDLE</Title>

      <GameContainer>
        <GameInfo
          tokens={gameState.tokens}
          attempts={gameState.attempts}
          maxAttempts={gameState.maxAttempts}
        />

        <PotDisplay
          potTokens={contractPotTokens > 0 ? contractPotTokens : gameState.potTokens}
          isAddingToPot={gameState.isAddingToPot}
          showCoinDrops={showCoinDrops}
        />

        {gameState.showFeedback && (
          <FeedbackMessage
            type={
              gameState.feedback.includes("정답")
                ? "success"
                : gameState.feedback.includes("틀렸습니다")
                ? "error"
                : "info"
            }
          >
            {gameState.feedback}
          </FeedbackMessage>
        )}

        <MelodyDisplay
          currentMelody={gameState.currentMelody}
          userMelody={gameState.userMelody}
          playingIndex={playingIndex}
        />

        <PianoKeyboard onNoteSelect={selectNote} isPlaying={gameState.isPlaying} />

        <GameControls
          userMelody={gameState.userMelody}
          currentMelody={gameState.currentMelody}
          isPlaying={gameState.isPlaying}
          isGameOver={gameState.isGameOver}
          tokens={gameState.tokens}
          onRemoveNote={removeNote}
          onPlayMelody={playMelody}
          onPlayAnswer={playMelody}
          onCheckAnswer={checkAnswer}
          onResetGame={resetGame}
          isWon={gameState.isWon}
        />
      </GameContainer>
    </AppContainer>
  );
};

export default MelodleGame;
