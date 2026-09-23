"use client";

import { useEffect, useState } from "react";
import { TerminalButton } from "@/components/ui";

export function ObjectiveTracker({
  completed,
  active,
}: {
  completed: string[];
  active: string | null;
}) {
  return (
    <div className="border border-line bg-panel/60 px-4 py-3 mb-6">
      <div className="text-[10px] tracking-[0.3em] uppercase text-muted mb-2">
        현재 조사 목표
      </div>
      <div className="space-y-1 text-sm">
        {completed.map((c, i) => (
          <div key={i} className="text-muted">
            ✓ {c}
          </div>
        ))}
        {active && <div className="text-red-bright">▸ {active}</div>}
      </div>
    </div>
  );
}

const NUDGE_DELAY_MS = 45000;

export function HintBox({
  hints,
  solved = false,
}: {
  hints: string[];
  solved?: boolean;
}) {
  const [revealed, setRevealed] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (solved || revealed > 0 || dismissed) return;
    const id = setTimeout(() => setShowNudge(true), NUDGE_DELAY_MS);
    return () => clearTimeout(id);
  }, [solved, revealed, dismissed]);

  return (
    <div className="mb-6 space-y-3">
      {showNudge && !dismissed && revealed === 0 && (
        <div className="flex items-center justify-between gap-3 border border-line/60 bg-panel/60 px-4 py-3 text-xs text-secondary">
          <span>조사가 오래 진행되고 있습니다. 힌트가 필요하신가요?</span>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setRevealed(1);
                setShowNudge(false);
              }}
              className="text-red-bright tracking-widest uppercase underline underline-offset-2"
            >
              힌트 보기
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-muted tracking-widest uppercase"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {revealed > 0 && (
        <div className="space-y-2">
          {hints.slice(0, revealed).map((hint, i) => (
            <div
              key={i}
              className="border border-line/60 px-4 py-3 text-xs text-secondary"
            >
              <div className="text-muted text-[10px] tracking-[0.3em] uppercase mb-1">
                HINT 0{i + 1}
              </div>
              {hint}
            </div>
          ))}
        </div>
      )}

      {revealed < hints.length && (
        <TerminalButton
          variant="ghost"
          onClick={() => {
            setRevealed((r) => r + 1);
            setShowNudge(false);
          }}
        >
          힌트{revealed > 0 ? ` (${revealed + 1}/${hints.length})` : ""}
        </TerminalButton>
      )}
    </div>
  );
}
