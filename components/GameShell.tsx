"use client";

import { useEffect, useState } from "react";
import {
  ClueId,
  GameState,
  Stage,
  clearGameState,
  initialGameState,
  loadGameState,
  saveGameState,
} from "@/lib/gameState";
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

export interface GameApi {
  state: GameState;
  setStage: (stage: Stage) => void;
  addClue: (id: ClueId) => void;
  update: (partial: Partial<GameState>) => void;
  resetGame: () => void;
}

export default function GameShell() {
  const [state, setState] = useState<GameState>(initialGameState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen post-mount to avoid a server/client
    // hydration mismatch, so this legitimately syncs from an external store.
    // Both updates are batched into one re-render, so the save effect below
    // never observes "hydrated" without the loaded state that goes with it.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadGameState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveGameState(state);
  }, [state, hydrated]);

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
    resetGame: () => {
      clearGameState();
      setState(initialGameState);
    },
  };

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
    default:
      return <PlayerIdentification api={api} />;
  }
}
