"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useWordleGame } from "@/hooks/useWordleGame";
import { useContract } from "@/hooks/useContract";
import { useMetaMask } from "@/hooks/useMetaMask";
import WalletButton from "@/components/wallet/WalletButton";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const GameContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 600px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
  line-height: 1.6;
`;

const GameInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 5px;
    font-size: 0.9rem;
  }
`;

const CurrentWord = styled.div`
  font-family: monospace;
  font-size: 1.2rem;
  font-weight: bold;
  color: #60a5fa;
  letter-spacing: 4px;
  min-height: 1.5rem;
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  gap: 5px;
  margin: 30px auto;
  max-width: 350px;
`;

const WordRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
`;

const Letter = styled.div<{ status?: 'correct' | 'present' | 'absent' | 'empty'; delay?: number }>`
  width: 62px;
  height: 62px;
  border: 2px solid ${props => {
    switch (props.status) {
      case 'correct': return '#6aaa64';
      case 'present': return '#c9b458';
      case 'absent': return '#787c7e';
      default: return 'rgba(255, 255, 255, 0.3)';
    }
  }};
  background: ${props => {
    switch (props.status) {
      case 'correct': return '#6aaa64';
      case 'present': return '#c9b458';
      case 'absent': return '#787c7e';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  border-radius: 3px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: ${props => props.status !== 'empty' ? 'flipIn 0.6s ease-in-out' : 'none'};
  animation-delay: ${props => props.delay ? `${props.delay * 100}ms` : '0ms'};

  @keyframes flipIn {
    0% {
      transform: rotateY(0deg);
      background: rgba(255, 255, 255, 0.1);
    }
    50% {
      transform: rotateY(90deg);
      background: rgba(255, 255, 255, 0.1);
    }
    100% {
      transform: rotateY(0deg);
    }
  }

  /* 입력 중일 때 살짝 확대 효과 */
  ${props => props.status === 'empty' && props.children ? `
    transform: scale(1.1);
    border-color: rgba(255, 255, 255, 0.6);
  ` : ''}
`;

const Keyboard = styled.div`
  margin-top: 30px;
`;

const KeyboardRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  gap: 6px;
`;

const Key = styled.button<{ wide?: boolean; status?: 'correct' | 'present' | 'absent' | 'unused'; isEnter?: boolean; canSubmit?: boolean }>`
  padding: 0;
  margin: 0;
  border: none;
  background: ${props => {
    if (props.isEnter) {
      return props.canSubmit 
        ? 'linear-gradient(135deg, #10b981, #059669)' 
        : 'rgba(255, 255, 255, 0.1)';
    }
    switch (props.status) {
      case 'correct': return '#6aaa64';
      case 'present': return '#c9b458';
      case 'absent': return '#787c7e';
      default: return 'rgba(255, 255, 255, 0.2)';
    }
  }};
  color: white;
  border-radius: 4px;
  cursor: ${props => (props.isEnter && !props.canSubmit) ? 'not-allowed' : 'pointer'};
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  ${props => props.wide ? `
    flex: 1.5;
    padding: 12px;
  ` : `
    flex: 1;
    padding: 12px;
    max-width: 43px;
  `}
  
  &:hover {
    opacity: ${props => (props.isEnter && !props.canSubmit) ? 0.5 : 0.8};
    transform: ${props => (props.isEnter && !props.canSubmit) ? 'none' : 'scale(1.05)'};
  }
  
  &:active {
    transform: ${props => (props.isEnter && !props.canSubmit) ? 'none' : 'scale(0.95)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const WalletButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
`;

const OwnerControls = styled.div`
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
`;

const OwnerTitle = styled.h3`
  color: #22c55e;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const OwnerButton = styled.button`
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin: 0 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const WordStatus = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  color: #3b82f6;
  font-weight: 600;
  font-size: 1rem;
`;

const GameStatus = styled.div<{ status: 'playing' | 'won' | 'lost' }>`
  padding: 20px;
  margin-top: 20px;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'won': return 'rgba(34, 197, 94, 0.2)';
      case 'lost': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(59, 130, 246, 0.2)';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'won': return 'rgba(34, 197, 94, 0.5)';
      case 'lost': return 'rgba(239, 68, 68, 0.5)';
      default: return 'rgba(59, 130, 246, 0.5)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'won': return '#22c55e';
      case 'lost': return '#ef4444';
      default: return '#3b82f6';
    }
  }};
`;

const ResetButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 15px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
  }
`;

const WordPlayPage: React.FC = () => {
  const [isCreatingWord, setIsCreatingWord] = useState(false);
  const {
    gameState,
    wordState,
    displayGuesses,
    addLetter,
    removeLetter,
    submitGuess,
    resetGame,
    setOwnerWord,
    exitOwnerGame,
    getKeyStatus
  } = useWordleGame();
  
  const { createWord } = useContract();
  const { account } = useMetaMask();
  
  // Owner 주소 (실제 컨트랙트 owner 주소)
  const OWNER_ADDRESS = "0xa2e4fb945b572bdf4f8cb11b5cb2d5d9765d91fb";
  const isOwner = account?.toLowerCase() === OWNER_ADDRESS.toLowerCase();

  const handleCreateWord = async () => {
    if (!createWord) return;
    
    try {
      setIsCreatingWord(true);
      
      // 새로운 랜덤 단어 생성
      const newWord = await setOwnerWord();
      if (newWord) {
        // 블록체인에 단어 해시 저장
        await createWord(newWord);
        console.log('Word created successfully:', newWord);
      }
    } catch (error) {
      console.error('Error creating word:', error);
    } finally {
      setIsCreatingWord(false);
    }
  };

  const handleExitOwnerMode = () => {
    exitOwnerGame();
  };

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ];

  const handleKeyClick = (key: string) => {
    console.log('키 클릭:', key, '현재 상태:', gameState.gameStatus, '현재 입력:', gameState.currentGuess);
    
    if (gameState.gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      console.log('ENTER 키 눌림, submitGuess 호출');
      submitGuess();
    } else if (key === '⌫') {
      removeLetter();
    } else {
      addLetter(key);
    }
  };

  const getStatusMessage = () => {
    switch (gameState.gameStatus) {
      case 'won':
        const attempts = gameState.currentRow;
        const attemptText = attempts === 1 ? '1번만에' : `${attempts}번만에`;
        return `🎉 축하합니다! ${attemptText} 정답을 맞추셨습니다!\n정답: "${gameState.targetWord}"`;
      case 'lost':
        return `😞 아쉽네요! 정답은 "${gameState.targetWord}"였습니다.\n다시 도전해보세요!`;
      default:
        if (gameState.currentGuess.length === 5) {
          return 'ENTER를 눌러 단어를 제출하세요!';
        } else if (gameState.currentGuess.length > 0) {
          return `${5 - gameState.currentGuess.length}글자 더 입력하세요.`;
        } else {
          const remaining = 6 - gameState.currentRow;
          return `${remaining}번의 기회가 남았습니다. 5글자 영어 단어를 입력하세요.`;
        }
    }
  };

  return (
    <Container>
      <BackButton href="/">← Back to Home</BackButton>
      <WalletButtonContainer>
        <WalletButton />
      </WalletButtonContainer>
      <GameContainer>
        <Title>🔤 Wordle Game</Title>
        
        {/* Owner Controls */}
        {isOwner && (
          <OwnerControls>
            <OwnerTitle>Owner Controls</OwnerTitle>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <OwnerButton 
                onClick={handleCreateWord}
                disabled={isCreatingWord}
              >
                {isCreatingWord ? 'Creating...' : 'Create New Word'}
              </OwnerButton>
              {wordState?.isOwnerMode && (
                <>
                  <WordStatus>
                    Current Word: {wordState.currentWord}
                  </WordStatus>
                  <OwnerButton onClick={handleExitOwnerMode}>
                    Exit Owner Mode
                  </OwnerButton>
                </>
              )}
            </div>
          </OwnerControls>
        )}
        
        <Description>
          5글자 영어 단어를 6번의 기회로 맞춰보세요!<br/>
          🟩 초록: 정확한 위치 | 🟨 노랑: 다른 위치에 존재 | 🟫 회색: 포함되지 않음
        </Description>

        <GameInfo>
          <span>시도 {gameState.currentRow + 1}/6</span>
          <CurrentWord>{gameState.currentGuess.padEnd(5, '_')}</CurrentWord>
          <span>남은 기회: {6 - gameState.currentRow}번</span>
        </GameInfo>

        <GameBoard>
          {displayGuesses.map((row, rowIndex) => (
            <WordRow key={rowIndex}>
              {row.map((letterData, colIndex) => (
                <Letter 
                  key={`${rowIndex}-${colIndex}`}
                  status={letterData.status}
                  delay={letterData.status !== 'empty' ? colIndex : 0}
                >
                  {letterData.letter}
                </Letter>
              ))}
            </WordRow>
          ))}
        </GameBoard>

        <Keyboard>
          {keyboardRows.map((row, rowIndex) => (
            <KeyboardRow key={rowIndex}>
              {row.map((key) => {
                const isEnter = key === 'ENTER';
                const canSubmit = gameState.currentGuess.length === 5;
                const isDisabled = gameState.gameStatus !== 'playing' || (isEnter && !canSubmit);
                
                return (
                  <Key
                    key={key}
                    wide={key === 'ENTER' || key === '⌫'}
                    status={getKeyStatus(key)}
                    isEnter={isEnter}
                    canSubmit={canSubmit}
                    onClick={() => handleKeyClick(key)}
                    disabled={isDisabled}
                  >
                    {key}
                  </Key>
                );
              })}
            </KeyboardRow>
          ))}
        </Keyboard>

        <GameStatus status={gameState.gameStatus}>
          <div style={{ whiteSpace: 'pre-line', lineHeight: '1.4' }}>
            {getStatusMessage()}
          </div>
          {gameState.gameStatus !== 'playing' && (
            <div>
              <ResetButton onClick={resetGame}>
                🎮 새 게임 시작
              </ResetButton>
            </div>
          )}
        </GameStatus>
      </GameContainer>
    </Container>
  );
};

export default WordPlayPage;
