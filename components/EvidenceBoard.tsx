"use client";

import { useState } from "react";
import type { GameApi } from "@/components/GameShell";
import { CLUES, ClueId } from "@/lib/gameState";
import { Panel, Screen, SystemHeader, TerminalButton, Label } from "@/components/ui";

const REQUIRED_PAIRS: [ClueId, ClueId][] = [
  ["TIME", "ELEVATOR"],
  ["ELEVATOR", "B3"],
  ["B3", "UNREGISTERED_FLOOR"],
  ["UNKNOWN_FIGURE", "HIDDEN_VOICE"],
];

function pairKey(a: ClueId, b: ClueId) {
  return [a, b].sort().join("::");
}

const REQUIRED_KEYS = REQUIRED_PAIRS.map(([a, b]) => pairKey(a, b));

export default function EvidenceBoard({ api }: { api: GameApi }) {
  const [firstSelected, setFirstSelected] = useState<ClueId | null>(null);
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);

  const complete = REQUIRED_KEYS.every((k) => connections.has(k));

  function selectCard(id: ClueId) {
    if (complete) return;
    if (firstSelected === null) {
      setFirstSelected(id);
      setMessage(null);
      return;
    }
    if (firstSelected === id) {
      setFirstSelected(null);
      return;
    }
    const key = pairKey(firstSelected, id);
    if (REQUIRED_KEYS.includes(key)) {
      const next = new Set(connections);
      next.add(key);
      setConnections(next);
      setMessage(null);
      if (REQUIRED_KEYS.every((k) => next.has(k))) {
        api.update({
          solvedPuzzles: Array.from(
            new Set([...api.state.solvedPuzzles, "evidence_board"])
          ),
        });
      }
    } else {
      setMessage("연관성을 찾을 수 없습니다.");
    }
    setFirstSelected(null);
  }

  function isLinked(id: ClueId) {
    return REQUIRED_KEYS.some(
      (k) => connections.has(k) && k.split("::").includes(id)
    );
  }

  return (
    <Screen>
      <SystemHeader title="증거 보드" subtitle="사건 재구성" />

      <p className="text-secondary text-sm mb-6">
        지금까지 발견한 단서를 연결하여 사건의 흐름을 재구성하세요.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {(Object.keys(CLUES) as ClueId[]).map((id) => {
          const clue = CLUES[id];
          const selected = firstSelected === id;
          const linked = isLinked(id);
          return (
            <button
              key={id}
              onClick={() => selectCard(id)}
              className={`text-left p-4 border transition-colors ${
                selected
                  ? "border-red-bright bg-red/10"
                  : linked
                  ? "border-red-bright/50"
                  : "border-line hover:border-secondary"
              }`}
            >
              <div className="text-[10px] text-muted tracking-widest">
                {clue.code}
              </div>
              <div className="text-ink font-serif text-lg tracking-wide mt-1">
                {clue.label}
              </div>
              <div className="text-[11px] text-muted mt-1">{clue.desc}</div>
              {id === "UNREGISTERED_FLOOR" &&
                connections.has(pairKey("B3", "UNREGISTERED_FLOOR")) && (
                  <div className="text-red-bright text-xs mt-2 tracking-widest">
                    → B4
                  </div>
                )}
            </button>
          );
        })}
      </div>

      {message && (
        <div className="text-muted text-xs tracking-widest uppercase mb-4">
          {message}
        </div>
      )}

      <Panel className="p-5 mb-6">
        <Label>연결된 단서</Label>
        <div className="mt-2 space-y-1">
          {REQUIRED_PAIRS.map(([a, b]) => {
            const linked = connections.has(pairKey(a, b));
            return (
              <div
                key={pairKey(a, b)}
                className={`text-sm tracking-wide ${
                  linked ? "text-red-bright" : "text-muted"
                }`}
              >
                {linked ? "●" : "○"} {CLUES[a].label} ↔ {CLUES[b].label}
              </div>
            );
          })}
        </div>
      </Panel>

      {complete && (
        <Panel className="p-6 mb-6" border="border-red/50">
          <div className="text-red-bright tracking-[0.2em] uppercase text-lg font-serif">
            사건 재구성 완료
          </div>
        </Panel>
      )}

      <TerminalButton
        disabled={!complete}
        onClick={() => api.setStage("HORROR")}
      >
        다음으로 →
      </TerminalButton>
    </Screen>
  );
}
