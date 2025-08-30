export interface LetterState {
  letter: string;
  status: 'correct' | 'present' | 'absent' | 'empty';
}

export interface WordleGameState {
  targetWord: string;
  guesses: LetterState[][];
  currentGuess: string;
  currentRow: number;
  gameStatus: 'playing' | 'won' | 'lost';
  keyboardStatus: Record<string, 'correct' | 'present' | 'absent'>;
}

export type KeyStatus = 'correct' | 'present' | 'absent' | 'unused';
