export type LearningMode = 'ko' | 'en';

export type CharacterId = 'minjun' | 'sarah' | 'halmeoni' | 'mrkim';

export interface StoryLine {
  characterId: CharacterId;
  partnerId: CharacterId;
  who: string;
  partner: string;
  ko: string;
  en: string;
}

export interface VocabWord {
  pic: string;
  ko: string;
  en: string;
}

export interface PuzzleData {
  ko: string;
  en: string;
  tokensKo: string[];
  tokensEn: string[];
  extraKo: string;
  extraEn: string;
  hintKo: string;
  hintEn: string;
}

export interface ListeningOption {
  ko: string;
  en: string;
  ok: boolean;
}

export interface ListeningQuestion {
  ko: string;
  en: string;
  opts: ListeningOption[];
}

export interface SpeakingData {
  ko: string;
  en: string;
  kwKo: string[];
  kwEn: string[];
}

export interface CultureChoice {
  ko: string;
  en: string;
  ok: boolean;
  fbKo: string;
  fbEn: string;
}

export interface CultureData {
  characterId: CharacterId;
  who: string;
  tipKo: string;
  tipEn: string;
  qKo: string;
  qEn: string;
  choices: CultureChoice[];
}

export interface LevelData {
  id: '1A' | '1B' | '2A' | '2B';
  nameKo: string;
  nameEn: string;
  sceneImage: string;
  sceneAlt: string;
  accentTint: string;
  grammar: string;
  story: StoryLine[];
  words: VocabWord[];
  puzzle: PuzzleData;
  listening: ListeningQuestion[];
  speaking: SpeakingData;
  culture: CultureData;
}

export interface LevelResult {
  stars: number;
  listenScore: number;
  speakInfo: string;
  done: boolean;
}

export interface SaveState {
  mode: LearningMode;
  coins: number;
  unlocked: number;
  results: Record<string, LevelResult>;
}

export type ScreenView = 'start' | 'levels' | 'play' | 'settings';

export type StepIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface ActiveSession {
  idx: number;
  step: StepIndex;
  storyIdx: number;
  puzzleMistakes: number;
  listenIdx: number;
  listenScore: number;
  speakInfo: string | null;
  speakDone: boolean;
  coins: number;
}
