import { NoteData } from "@/types/game";

// 음표 데이터와 Tone.js 호환 매핑 (피아노 한 옥타브)
export const NOTES: NoteData[] = [
  { display: "C", tone: "C4", isBlack: false },
  { display: "C#", tone: "C#4", isBlack: true },
  { display: "D", tone: "D4", isBlack: false },
  { display: "D#", tone: "D#4", isBlack: true },
  { display: "E", tone: "E4", isBlack: false },
  { display: "F", tone: "F4", isBlack: false },
  { display: "F#", tone: "F#4", isBlack: true },
  { display: "G", tone: "G4", isBlack: false },
  { display: "G#", tone: "G#4", isBlack: true },
  { display: "A", tone: "A4", isBlack: false },
  { display: "A#", tone: "A#4", isBlack: true },
  { display: "B", tone: "B4", isBlack: false },
];

// 샘플 멜로디들 (10개 음표로 구성)
export const SAMPLE_MELODIES = [
  ["C", "D", "E", "F", "G", "A", "B", "C", "D", "E"],
  ["G", "A", "B", "C", "D", "E", "F", "G", "A", "B"],
  ["E", "F", "G", "A", "B", "C", "D", "E", "F", "G"],
  ["A", "B", "C", "D", "E", "F", "G", "A", "B", "C"],
  ["F", "G", "A", "B", "C", "D", "E", "F", "G", "A"],
  ["C", "E", "G", "B", "D", "F", "A", "C", "E", "G"],
  ["D", "F", "A", "C", "E", "G", "B", "D", "F", "A"],
  ["G", "B", "D", "F", "A", "C", "E", "G", "B", "D"],
  ["C", "D#", "F", "G#", "A#", "C", "D#", "F", "G#", "A#"],
  ["F#", "G#", "A#", "C", "D", "E", "F#", "G#", "A#", "C"],
];

// 키보드 매핑
export const KEYBOARD_MAPPING: { [key: string]: string } = {
  "1": "C",
  "2": "C#",
  "3": "D",
  "4": "D#",
  "5": "E",
  "6": "F",
  "7": "F#",
  "8": "G",
  "9": "G#",
  "0": "A",
  "-": "A#",
  "=": "B",
};

// 게임 설정
export const GAME_CONFIG = {
  INITIAL_TOKENS: 1000,
  INITIAL_POT_TOKENS: 5000,
  MAX_ATTEMPTS: 6,
  ATTEMPT_COST: 50,
  REWARD_PERCENTAGE: 0.1, // 10%
  MAX_POT_FILL: 10000,
};
