"use client";

import { useState, useCallback, useEffect } from 'react';
import { WordleGameState, LetterState, KeyStatus } from '@/types/wordle';
import { getRandomTargetWord, isValidWord } from '@/constants/wordList';
import { useWordManager } from './useWordManager';

const evaluateGuess = (guess: string, target: string): LetterState[] => {
  const result: LetterState[] = Array(5).fill(null);
  const targetArray = target.split('');
  const guessArray = guess.split('');
  
  // 먼저 정확한 위치의 글자들을 체크
  for (let i = 0; i < 5; i++) {
    if (guessArray[i] === targetArray[i]) {
      result[i] = { letter: guessArray[i], status: 'correct' };
      targetArray[i] = '*'; // 사용된 글자는 표시
      guessArray[i] = '*';
    }
  }
  
  // 그 다음 존재하지만 위치가 틀린 글자들을 체크
  for (let i = 0; i < 5; i++) {
    if (result[i]) continue; // 이미 처리된 글자는 건너뛰기
    
    if (guessArray[i] && guessArray[i] !== '*') {
      const targetIndex = targetArray.indexOf(guessArray[i]);
      if (targetIndex !== -1) {
        result[i] = { letter: guess[i], status: 'present' };
        targetArray[targetIndex] = '*'; // 사용된 글자는 표시
      } else {
        result[i] = { letter: guess[i], status: 'absent' };
      }
    }
  }
  
  return result;
};

export const useWordleGame = () => {
  const { wordState, setNewWord, resetGame: resetWord, exitOwnerMode } = useWordManager();
  
  const [gameState, setGameState] = useState<WordleGameState>(() => {
    const targetWord = wordState.currentWord;
    console.log('🎯 오늘의 단어:', targetWord); // 디버깅용
    return {
      targetWord,
      guesses: Array(6).fill(null).map(() => 
        Array(5).fill(null).map(() => ({ letter: '', status: 'empty' as const }))
      ),
      currentGuess: '',
      currentRow: 0,
      gameStatus: 'playing',
      keyboardStatus: {}
    };
  });

  const addLetter = useCallback((letter: string) => {
    if (gameState.gameStatus !== 'playing' || gameState.currentGuess.length >= 5) {
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentGuess: prev.currentGuess + letter
    }));
  }, [gameState.gameStatus, gameState.currentGuess.length]);

  const removeLetter = useCallback(() => {
    if (gameState.gameStatus !== 'playing' || gameState.currentGuess.length === 0) {
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1)
    }));
  }, [gameState.gameStatus, gameState.currentGuess.length]);

  const submitGuess = useCallback(() => {
    console.log('submitGuess 함수 호출됨');
    
    setGameState(prevState => {
      console.log('현재 상태:', prevState.gameStatus);
      console.log('현재 입력 길이:', prevState.currentGuess.length);
      console.log('현재 입력:', prevState.currentGuess);
      
      if (prevState.gameStatus !== 'playing' || prevState.currentGuess.length !== 5) {
        console.log('조건 불만족으로 함수 종료');
        return prevState;
      }

      console.log('제출된 단어:', prevState.currentGuess, '정답:', prevState.targetWord);
      const guessResult = evaluateGuess(prevState.currentGuess, prevState.targetWord);
      console.log('평가 결과:', guessResult);
      
      const newKeyboardStatus = { ...prevState.keyboardStatus };
      
      // 키보드 상태 업데이트 (우선순위: correct > present > absent)
      guessResult.forEach(({ letter, status }) => {
        if (status === 'empty') return;
        
        const currentStatus = newKeyboardStatus[letter];
        if (!currentStatus || 
            (currentStatus === 'absent' && (status === 'present' || status === 'correct')) ||
            (currentStatus === 'present' && status === 'correct')) {
          newKeyboardStatus[letter] = status;
        }
      });

      const newGuesses = [...prevState.guesses];
      newGuesses[prevState.currentRow] = guessResult;

      const isWin = guessResult.every(letter => letter.status === 'correct');
      const isGameOver = isWin || prevState.currentRow >= 5;

      console.log('새로운 상태로 업데이트');
      return {
        ...prevState,
        guesses: newGuesses,
        currentGuess: '',
        currentRow: prevState.currentRow + 1,
        gameStatus: isWin ? 'won' : (isGameOver ? 'lost' : 'playing'),
        keyboardStatus: newKeyboardStatus
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    const newWord = resetWord();
    console.log('🎯 새로운 단어:', newWord); // 디버깅용
    setGameState(prev => ({
      targetWord: newWord,
      guesses: Array(6).fill(null).map(() => 
        Array(5).fill(null).map(() => ({ letter: '', status: 'empty' as const }))
      ),
      currentGuess: '',
      currentRow: 0,
      gameStatus: 'playing',
      keyboardStatus: {}
    }));
  }, [resetWord]);

  // Owner가 새로운 단어를 설정하는 함수
  const setOwnerWord = useCallback((word?: string) => {
    const newWord = setNewWord(word);
    console.log('🎯 Owner가 설정한 단어:', newWord);
    setGameState(prev => ({
      ...prev,
      targetWord: newWord,
      guesses: Array(6).fill(null).map(() => 
        Array(5).fill(null).map(() => ({ letter: '', status: 'empty' as const }))
      ),
      currentGuess: '',
      currentRow: 0,
      gameStatus: 'playing',
      keyboardStatus: {}
    }));
    return newWord;
  }, [setNewWord]);

  // Owner 모드 종료
  const exitOwnerGame = useCallback(() => {
    const newWord = exitOwnerMode();
    console.log('🎯 Owner 모드 종료, 새로운 단어:', newWord);
    setGameState(prev => ({
      ...prev,
      targetWord: newWord,
      guesses: Array(6).fill(null).map(() => 
        Array(5).fill(null).map(() => ({ letter: '', status: 'empty' as const }))
      ),
      currentGuess: '',
      currentRow: 0,
      gameStatus: 'playing',
      keyboardStatus: {}
    }));
  }, [exitOwnerMode]);

  const getKeyStatus = useCallback((key: string): KeyStatus => {
    return gameState.keyboardStatus[key] || 'unused';
  }, [gameState.keyboardStatus]);

  // 현재 입력 중인 글자들을 화면에 표시하기 위한 처리
  const displayGuesses = gameState.guesses.map((guess, rowIndex) => {
    if (rowIndex === gameState.currentRow && gameState.gameStatus === 'playing') {
      // 현재 입력 중인 행 - 빈 상태로 시작해서 현재 입력을 표시
      return Array(5).fill(null).map((_, colIndex) => ({
        letter: gameState.currentGuess[colIndex] || '',
        status: 'empty' as const
      }));
    }
    // 이미 제출된 행들 - 평가 결과를 그대로 사용
    return guess;
  });

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.gameStatus !== 'playing') return;

      const key = event.key.toUpperCase();
      
      if (key === 'ENTER') {
        submitGuess();
      } else if (key === 'BACKSPACE') {
        removeLetter();
      } else if (/^[A-Z]$/.test(key)) {
        addLetter(key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameStatus, addLetter, removeLetter, submitGuess]);

  return {
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
  };
};
