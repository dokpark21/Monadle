"use client";

import React, { useState } from "react";
import { ControlButton, PlayButton } from "@/components/styled/GameStyles";
import { Note } from "@/types/game";
import { useContract } from "@/hooks/useContract";
import { useMetaMask } from "@/hooks/useMetaMask";

interface GameControlsProps {
  userMelody: Note[];
  currentMelody: Note[];
  isPlaying: boolean;
  isGameOver: boolean;
  tokens: number;
  onRemoveNote: () => void;
  onPlayMelody: () => void;
  onPlayAnswer: () => void;
  onCheckAnswer: () => void;
  onResetGame: () => void;
  isWon: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  userMelody,
  currentMelody,
  isPlaying,
  isGameOver,
  tokens,
  onRemoveNote,
  onPlayMelody,
  onPlayAnswer,
  onCheckAnswer,
  onResetGame,
  isWon,
}) => {
  const [isCreatingMelody, setIsCreatingMelody] = useState(false);
  const [isSubmittingMelody, setIsSubmittingMelody] = useState(false);
  const { createMelody, submitMelody, contractState } = useContract();
  const { account } = useMetaMask();
  
  // Owner 주소 (실제 컨트랙트 owner 주소)
  const OWNER_ADDRESS = "0xa2e4fb945b572bdf4f8cb11b5cb2d5d9765d91fb";

  const isOwner = account?.toLowerCase() === OWNER_ADDRESS.toLowerCase();

  const handlePlayMelody = async () => {
    if (isOwner && userMelody.length === 10) {
      // Owner이고 10개의 음이 있으면 createMelody 호출
      setIsCreatingMelody(true);
      try {
        const melodyNotes = userMelody.map(note => note.note);
        const result = await createMelody(melodyNotes);
        console.log('멜로디가 성공적으로 생성되었습니다:', result);
        alert(`멜로디가 생성되었습니다!\nTx Hash: ${result.txHash}\nMelody Hash: ${result.melodyHash}`);
      } catch (error) {
        console.error('멜로디 생성 실패:', error);
        alert('멜로디 생성에 실패했습니다. 콘솔을 확인해주세요.');
      } finally {
        setIsCreatingMelody(false);
      }
    } else {
      // 일반 사용자는 기존 기능
      onPlayMelody();
    }
  };

  const handleCheckAnswer = async () => {
    // 먼저 기본 검증 (로컬 게임 로직)
    if (userMelody.length !== currentMelody.length) {
      alert("멜로디를 완성해주세요!");
      return;
    }

    if (tokens < 50) {
      alert("토큰이 부족합니다! (50 토큰 필요)");
      return;
    }

    // 항상 블록체인 제출을 시도 (MetaMask 연결 여부와 관계없이)
    setIsSubmittingMelody(true);
    try {
      const melodyNotes = userMelody.map(note => note.note);
      const valueInEth = "0.001"; // 50 토큰 = 0.001 ETH

      console.log('블록체인에 멜로디 제출 중...');
      const result = await submitMelody(melodyNotes, valueInEth);
      
      console.log('멜로디 제출 결과:', result);
      
      if (result.isCorrect) {
        alert(`🎉 정답입니다! 🎉\n블록체인에서 확인되었습니다!\nTx Hash: ${result.txHash}`);
      } else {
        alert(`❌ 틀렸습니다! ❌\n다시 시도해보세요.\nTx Hash: ${result.txHash}`);
      }
      
      // 블록체인 제출 후 로컬 게임 로직도 실행
      onCheckAnswer();
      
    } catch (error) {
      console.error('멜로디 제출 실패:', error);
      
      if (error instanceof Error && error.message.includes('MetaMask')) {
        alert('MetaMask를 연결해주세요! 로컬 게임만 진행됩니다.');
      } else {
        alert('블록체인 제출에 실패했습니다. 로컬 게임만 진행됩니다.');
      }
      
      // 블록체인 제출 실패해도 로컬 게임은 진행
      onCheckAnswer();
    } finally {
      setIsSubmittingMelody(false);
    }
  };

  return (
    <>
      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <ControlButton
          onClick={onRemoveNote}
          disabled={userMelody.length === 0}
        >
          Clear
        </ControlButton>
        <PlayButton
          onClick={handlePlayMelody}
          disabled={userMelody.length === 0 || isPlaying || isCreatingMelody}
          isPlaying={isPlaying || isCreatingMelody}
        >
          {isCreatingMelody 
            ? "Creating Melody..." 
            : isPlaying 
            ? "Playing..." 
            : isOwner && userMelody.length === 10
            ? "Create Melody (Owner)"
            : "Play My Melody"
          }
        </PlayButton>
        
        {isOwner && (
          <div style={{ 
            fontSize: '0.8rem', 
            color: '#10b981', 
            marginTop: '5px',
            fontWeight: '600'
          }}>
            Owner Mode: {userMelody.length}/10 notes
            {userMelody.length === 10 && " - Ready to create!"}
          </div>
        )}
        
        <ControlButton onClick={onPlayAnswer}>Play Answer (Hint)</ControlButton>
        <ControlButton
          onClick={handleCheckAnswer}
          disabled={userMelody.length !== currentMelody.length || isGameOver || isSubmittingMelody}
          style={{
            background:
              tokens < 50
                ? "rgba(255, 255, 255, 0.1)"
                : "linear-gradient(45deg, #8b5cf6, #7c3aed)",
          }}
        >
          {isSubmittingMelody ? "Submitting..." : "Check Answer (50 Tokens)"}
        </ControlButton>
      </div>

      {contractState.error && (
        <div style={{ 
          textAlign: "center", 
          color: "#ef4444", 
          fontSize: "0.9rem",
          margin: "10px 0",
          background: "rgba(239, 68, 68, 0.1)",
          padding: "10px",
          borderRadius: "8px"
        }}>
          Contract Error: {contractState.error}
        </div>
      )}

      {isGameOver && (
        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <h2
            style={{
              color: isWon ? "#10b981" : "#ef4444",
              fontSize: "2rem",
              fontWeight: "700",
              textShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
            }}
          >
            {isWon ? "🎉 Correct! 🎉" : "😢 Game Over 😢"}
          </h2>
          <ControlButton onClick={onResetGame}>Play Again</ControlButton>
        </div>
      )}
    </>
  );
};

export default GameControls;
