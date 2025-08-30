"use client";

import { useState, useEffect } from "react";
import * as Tone from "tone";
import { GameState, Note } from "@/types/game";
import {
  SAMPLE_MELODIES,
  KEYBOARD_MAPPING,
  GAME_CONFIG,
} from "@/constants/gameData";

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentMelody: [],
    userMelody: [],
    attempts: 0,
    maxAttempts: GAME_CONFIG.MAX_ATTEMPTS,
    isGameOver: false,
    isWon: false,
    tokens: GAME_CONFIG.INITIAL_TOKENS,
    potTokens: GAME_CONFIG.INITIAL_POT_TOKENS,
    dailyMelody: "",
    showFeedback: false,
    feedback: "",
    isPlaying: false,
    isAddingToPot: false,
  });

  const [synth, setSynth] = useState<Tone.Synth | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number>(-1);
  const [showCoinDrops, setShowCoinDrops] = useState<boolean>(false);

  // Tone.js 초기화
  useEffect(() => {
    const newSynth = new Tone.Synth().toDestination();
    setSynth(newSynth);

    return () => {
      newSynth.dispose();
    };
  }, []);

  // 일일 멜로디 설정
  useEffect(() => {
    const today = new Date().toDateString();
    const melodyIndex = new Date().getDate() % SAMPLE_MELODIES.length;
    const dailyMelody = SAMPLE_MELODIES[melodyIndex];

    setGameState((prev) => ({
      ...prev,
      currentMelody: dailyMelody.map((note) => ({ note, duration: "4n" })),
      dailyMelody: today,
    }));
  }, []);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.isGameOver) return;

      const note = KEYBOARD_MAPPING[event.key];
      if (
        note &&
        gameState.userMelody.length < gameState.currentMelody.length
      ) {
        selectNote(note);
      }

      // 백스페이스로 마지막 음표 제거
      if (event.key === "Backspace") {
        removeNote();
      }

      // 엔터로 정답 확인
      if (
        event.key === "Enter" &&
        gameState.userMelody.length === gameState.currentMelody.length
      ) {
        checkAnswer();
      }

      // 스페이스바로 내 멜로디 재생
      if (event.key === " " && gameState.userMelody.length > 0) {
        event.preventDefault();
        playMelody(gameState.userMelody);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    gameState.isGameOver,
    gameState.userMelody.length,
    gameState.currentMelody.length,
  ]);

  // 피드백 메시지 표시
  const showFeedback = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setGameState((prev) => ({
      ...prev,
      showFeedback: true,
      feedback: message,
    }));

    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        showFeedback: false,
        feedback: "",
      }));
    }, 3000);
  };

  // 음표를 Tone.js 호환 형식으로 변환
  const getToneNote = (displayNote: string): string => {
    const noteObj = SAMPLE_MELODIES.flat().find((n) => n === displayNote);
    return noteObj ? `${noteObj}4` : "C4";
  };

  // 음표 재생
  const playNote = (displayNote: string) => {
    if (synth) {
      const toneNote = getToneNote(displayNote);
      try {
        synth.triggerAttackRelease(toneNote, "4n");
      } catch (error) {
        console.error("음표 재생 오류:", error);
      }
    }
  };

  // 음표 선택
  const selectNote = (displayNote: string) => {
    if (
      gameState.userMelody.length < gameState.currentMelody.length &&
      !gameState.isGameOver
    ) {
      setGameState((prev) => ({
        ...prev,
        userMelody: [...prev.userMelody, { note: displayNote, duration: "4n" }],
      }));
      playNote(displayNote);
    }
  };

  // 멜로디 재생 (시각적 피드백 포함)
  const playMelody = async (melody: Note[]) => {
    if (!synth || melody.length === 0) return;

    setGameState((prev) => ({ ...prev, isPlaying: true }));

    const now = Tone.now();
    for (let i = 0; i < melody.length; i++) {
      setPlayingIndex(i);
      const toneNote = getToneNote(melody[i].note);
      try {
        synth.triggerAttackRelease(toneNote, melody[i].duration, now + i * 0.6);
        await new Promise((resolve) => setTimeout(resolve, 600));
      } catch (error) {
        console.error("멜로디 재생 오류:", error);
      }
    }

    setPlayingIndex(-1);
    setGameState((prev) => ({ ...prev, isPlaying: false }));
  };

  // 항아리에 토큰 추가 애니메이션
  const addTokensToPot = (amount: number) => {
    setGameState((prev) => ({ ...prev, isAddingToPot: true }));
    setShowCoinDrops(true);

    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        potTokens: prev.potTokens + amount,
        isAddingToPot: false,
      }));
      setShowCoinDrops(false);
    }, 1000);
  };

  // 정답 확인
  const checkAnswer = () => {
    if (gameState.userMelody.length !== gameState.currentMelody.length) {
      showFeedback("멜로디를 완성해주세요!", "error");
      return;
    }

    const cost = GAME_CONFIG.ATTEMPT_COST;
    if (gameState.tokens < cost) {
      showFeedback("토큰이 부족합니다!", "error");
      return;
    }

    const isCorrect = gameState.userMelody.every(
      (note, index) => note.note === gameState.currentMelody[index].note
    );

    const newAttempts = gameState.attempts + 1;
    const isWon = isCorrect;
    const isGameOver = isWon || newAttempts >= gameState.maxAttempts;

    let newTokens = gameState.tokens - cost;
    let newPotTokens = gameState.potTokens;

    // 항아리에 토큰 추가 애니메이션
    addTokensToPot(cost);

    if (isWon) {
      // 정답을 맞췄을 때 보상
      const reward = Math.floor(
        gameState.potTokens * GAME_CONFIG.REWARD_PERCENTAGE
      );
      newTokens += reward;
      newPotTokens -= reward;
      showFeedback(`🎉 정답입니다! ${reward} 토큰을 획득했습니다!`, "success");
    } else {
      showFeedback("틀렸습니다. 다시 시도해보세요!", "error");
    }

    setGameState((prev) => ({
      ...prev,
      attempts: newAttempts,
      isWon,
      isGameOver,
      tokens: newTokens,
      userMelody: [],
    }));
  };

  // 게임 리셋
  const resetGame = () => {
    setGameState((prev) => ({
      ...prev,
      userMelody: [],
      attempts: 0,
      isGameOver: false,
      isWon: false,
    }));
  };

  // 선택된 음표 제거
  const removeNote = () => {
    setGameState((prev) => ({
      ...prev,
      userMelody: prev.userMelody.slice(0, -1),
    }));
  };

  return {
    gameState,
    playingIndex,
    showCoinDrops,
    selectNote,
    playMelody,
    checkAnswer,
    resetGame,
    removeNote,
    showFeedback,
  };
};
