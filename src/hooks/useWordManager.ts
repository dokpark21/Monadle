"use client";

import { useState, useCallback } from 'react';
import { getRandomTargetWord } from '@/constants/wordList';

interface WordState {
  currentWord: string;
  isWordSet: boolean;
  isOwnerMode: boolean;
}

export const useWordManager = () => {
  const [wordState, setWordState] = useState<WordState>(() => ({
    currentWord: getRandomTargetWord(),
    isWordSet: false,
    isOwnerMode: false
  }));

  // Owner가 새로운 단어를 설정
  const setNewWord = useCallback((word?: string) => {
    const newWord = word || getRandomTargetWord();
    setWordState({
      currentWord: newWord.toUpperCase(),
      isWordSet: true,
      isOwnerMode: true
    });
    return newWord.toUpperCase();
  }, []);

  // 게임 리셋 (owner가 다시 설정할 때까지 단어 고정)
  const resetGame = useCallback(() => {
    if (!wordState.isOwnerMode) {
      // Owner 모드가 아니면 새로운 랜덤 단어
      const newWord = getRandomTargetWord();
      setWordState(prev => ({
        ...prev,
        currentWord: newWord
      }));
      return newWord;
    }
    // Owner 모드면 현재 단어 유지
    return wordState.currentWord;
  }, [wordState.isOwnerMode, wordState.currentWord]);

  // Owner 모드 해제 (로컬 게임으로 전환)
  const exitOwnerMode = useCallback(() => {
    const newWord = getRandomTargetWord();
    setWordState({
      currentWord: newWord,
      isWordSet: false,
      isOwnerMode: false
    });
    return newWord;
  }, []);

  return {
    wordState,
    setNewWord,
    resetGame,
    exitOwnerMode
  };
};
