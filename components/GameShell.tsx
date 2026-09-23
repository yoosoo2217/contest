"use client";

import { useState } from "react";
import { ClueId, GameState, Stage, initialGameState } from "@/lib/gameState";
import TitleScreen from "@/components/TitleScreen";
import PlayerIdentification from "@/components/PlayerIdentification";
import CaseFile from "@/components/CaseFile";
import CctvInvestigation from "@/components/CctvInvestigation";
import SecurityRecord from "@/components/SecurityRecord";
import MapInvestigation from "@/components/MapInvestigation";
import AudioForensics from "@/components/AudioForensics";
import EvidenceBoard from "@/components/EvidenceBoard";
import HorrorEvent from "@/components/HorrorEvent";
import FinalDecision from "@/components/FinalDecision";
import Ending from "@/components/Ending";
import Epilogue from "@/components/Epilogue";
import MissingPersonsSection from "@/components/MissingPersonsSection";

export interface GameApi {
  state: GameState;
  setStage: (stage: Stage) => void;
  addClue: (id: ClueId) => void;
  update: (partial: Partial<GameState>) => void;
  resetGame: () => void;
  returnToTitle: () => void;
}

export default function GameShell() {
  // Game state is intentionally session-only (in-memory), never persisted
  // to localStorage: a page refresh must always land back on the title
  // screen with a clean slate, from any stage.
  const [state, setState] = useState<GameState>(initialGameState);
  const [titleAcknowledged, setTitleAcknowledged] = useState(false);

  const api: GameApi = {
    state,
    setStage: (stage) => setState((s) => ({ ...s, currentStage: stage })),
    addClue: (id) =>
      setState((s) =>
        s.foundClues.includes(id)
          ? s
          : { ...s, foundClues: [...s.foundClues, id] }
      ),
    update: (partial) => setState((s) => ({ ...s, ...partial })),
    resetGame: () => setState(initialGameState),
    returnToTitle: () => {
      setState(initialGameState);
      setTitleAcknowledged(false);
    },
  };

  if (!titleAcknowledged) {
    return <TitleScreen onStart={() => setTitleAcknowledged(true)} />;
  }

  switch (state.currentStage) {
    case "IDENTIFICATION":
      return <PlayerIdentification api={api} />;
    case "CASE_FILE":
      return <CaseFile api={api} />;
    case "CCTV":
      return <CctvInvestigation api={api} />;
    case "SECURITY_RECORD":
      return <SecurityRecord api={api} />;
    case "MAP":
      return <MapInvestigation api={api} />;
    case "AUDIO":
      return <AudioForensics api={api} />;
    case "EVIDENCE_BOARD":
      return <EvidenceBoard api={api} />;
    case "HORROR":
      return <HorrorEvent api={api} />;
    case "FINAL_DECISION":
      return <FinalDecision api={api} />;
    case "ENDING":
      return <Ending api={api} />;
    case "EPILOGUE":
      return <Epilogue api={api} />;
    case "MISSING_PERSONS":
      return <MissingPersonsSection />;
    default:
      return <PlayerIdentification api={api} />;
  }
}
