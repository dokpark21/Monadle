// 게임 관련 타입 정의
export interface Note {
  note: string;
  duration: string;
}

export interface GameState {
  currentMelody: Note[];
  userMelody: Note[];
  attempts: number;
  maxAttempts: number;
  isGameOver: boolean;
  isWon: boolean;
  tokens: number;
  potTokens: number;
  dailyMelody: string;
  showFeedback: boolean;
  feedback: string;
  isPlaying: boolean;
  isAddingToPot: boolean;
}

export interface NoteData {
  display: string;
  tone: string;
  isBlack: boolean;
}
