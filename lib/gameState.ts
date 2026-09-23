export type Stage =
  | "IDENTIFICATION"
  | "CASE_FILE"
  | "CCTV"
  | "SECURITY_RECORD"
  | "MAP"
  | "AUDIO"
  | "EVIDENCE_BOARD"
  | "HORROR"
  | "FINAL_DECISION"
  | "ENDING"
  | "EPILOGUE"
  | "MISSING_PERSONS";

export const STAGE_ORDER: Stage[] = [
  "IDENTIFICATION",
  "CASE_FILE",
  "CCTV",
  "SECURITY_RECORD",
  "MAP",
  "AUDIO",
  "EVIDENCE_BOARD",
  "HORROR",
  "FINAL_DECISION",
  "ENDING",
  "EPILOGUE",
  "MISSING_PERSONS",
];

export type ClueId =
  | "TIME"
  | "ELEVATOR"
  | "B3"
  | "UNKNOWN_FIGURE"
  | "UNREGISTERED_FLOOR"
  | "HIDDEN_VOICE";

export const CLUES: Record<
  ClueId,
  { code: string; label: string; desc: string }
> = {
  TIME: { code: "EVIDENCE_01", label: "02:17:03", desc: "실종 직전 마지막 기록 시각" },
  ELEVATOR: { code: "EVIDENCE_02", label: "엘리베이터", desc: "접근 기록 발견" },
  B3: { code: "EVIDENCE_03", label: "B3", desc: "엘리베이터 출발 층" },
  UNKNOWN_FIGURE: { code: "EVIDENCE_04", label: "두 번째 인물", desc: "인원 수 불일치" },
  UNREGISTERED_FLOOR: { code: "EVIDENCE_05", label: "미등록 층", desc: "건물 도면에 없는 층" },
  HIDDEN_VOICE: { code: "EVIDENCE_06", label: "숨겨진 음성", desc: "숨겨진 음성 레이어" },
};

export type FinalChoice = "ELEVATOR" | "RECORD" | "LEAVE" | null;
export type Ending = "A" | "B" | "C" | null;

export interface GameState {
  investigatorName: string;
  currentStage: Stage;
  foundClues: ClueId[];
  solvedPuzzles: string[];
  unlockedRecords: string[];
  discoveredB4: boolean;
  finalChoice: FinalChoice;
  ending: Ending;
}

export const initialGameState: GameState = {
  investigatorName: "",
  currentStage: "IDENTIFICATION",
  foundClues: [],
  solvedPuzzles: [],
  unlockedRecords: [],
  discoveredB4: false,
  finalChoice: null,
  ending: null,
};
