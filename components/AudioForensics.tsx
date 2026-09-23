"use client";

import { useState } from "react";
import type { GameApi } from "@/components/GameShell";
import { Panel, Screen, SystemHeader, TerminalButton, Label, ClueTag } from "@/components/ui";

const DURATION = 60;
const TARGET_START = 31;
const TARGET_END = 34;
const MAX_SELECTION = 8;

function barHeight(i: number) {
  const base = Math.abs(Math.sin(i * 0.7) * 0.5 + Math.sin(i * 0.31) * 0.35);
  const spike = i >= TARGET_START && i < TARGET_END ? 0.25 : 0;
  return Math.min(1, 0.15 + base + spike);
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function AudioForensics({ api }: { api: GameApi }) {
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [hiddenRevealed, setHiddenRevealed] = useState(
    api.state.foundClues.includes("HIDDEN_VOICE")
  );

  function clickBar(i: number) {
    setAnalyzed(false);
    setInvalid(false);
    if (start === null || (start !== null && end !== null)) {
      setStart(i);
      setEnd(null);
    } else {
      setEnd(Math.max(i, start));
      setStart(Math.min(i, start));
    }
  }

  const hasSelection = start !== null && end !== null;

  function analyze() {
    if (start === null || end === null) return;
    const width = end - start;
    const containsTarget = start <= TARGET_START && end >= TARGET_END - 1;
    if (containsTarget && width <= MAX_SELECTION) {
      setAnalyzed(true);
      setInvalid(false);
    } else {
      setAnalyzed(false);
      setInvalid(true);
    }
  }

  function isolateHiddenLayer() {
    setHiddenRevealed(true);
    api.addClue("HIDDEN_VOICE");
  }

  return (
    <Screen>
      <SystemHeader title="음성 분석" subtitle="AUDIO_06 // 파형 분석" />

      <Panel className="p-5 mb-3">
        <div className="flex h-32 items-end gap-[2px]">
          {Array.from({ length: DURATION }, (_, i) => {
            const inSelection =
              start !== null && end !== null && i >= start && i <= end;
            return (
              <button
                key={i}
                onClick={() => clickBar(i)}
                style={{ height: `${barHeight(i) * 100}%` }}
                className={`flex-1 min-w-[2px] transition-colors ${
                  inSelection
                    ? "bg-red-bright"
                    : "bg-secondary/40 hover:bg-secondary/70"
                }`}
                aria-label={`select ${formatTime(i)}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-muted mt-2 tracking-widest">
          <span>00:00</span>
          <span>00:15</span>
          <span>00:30</span>
          <span>00:45</span>
          <span>01:00</span>
        </div>
      </Panel>

      <div className="flex items-center justify-between mb-6 text-sm">
        <Label>
          {hasSelection
            ? `선택 구간: ${formatTime(start!)} - ${formatTime(end! + 1)}`
            : "시작 지점과 끝 지점을 순서대로 클릭하세요."}
        </Label>
        <div className="flex gap-3">
          <TerminalButton
            variant="ghost"
            onClick={() => {
              setStart(null);
              setEnd(null);
              setAnalyzed(false);
              setInvalid(false);
            }}
          >
            초기화
          </TerminalButton>
          <TerminalButton disabled={!hasSelection} onClick={analyze}>
            분석하기
          </TerminalButton>
        </div>
      </div>

      {invalid && !analyzed && (
        <Panel className="p-5 mb-6">
          <div className="text-muted text-sm tracking-widest uppercase">
            이 구간에서는 신호가 감지되지 않았습니다.
          </div>
        </Panel>
      )}

      {analyzed && (
        <Panel className="p-6 mb-6 space-y-4">
          <div className="text-red-bright text-sm tracking-widest uppercase">
            음성 감지
          </div>
          <div className="space-y-2 font-serif text-ink text-lg">
            <p>&ldquo;이곳은 거기가 아니에요.&rdquo;</p>
            <p>&ldquo;아직 나를 찾으러 오지 마.&rdquo;</p>
          </div>

          {!hiddenRevealed ? (
            <TerminalButton onClick={isolateHiddenLayer}>
              배경음 분리
            </TerminalButton>
          ) : (
            <div className="border-t border-line pt-4 space-y-2">
              <div className="text-muted text-xs tracking-widest uppercase">
                숨겨진 음성 — 낮은 음량
              </div>
              <p className="font-serif text-red-bright text-lg">
                &ldquo;이미 찾았잖아.&rdquo;
              </p>
              <ClueTag label="단서 획득: 숨겨진 음성" />
            </div>
          )}
        </Panel>
      )}

      <TerminalButton
        disabled={!hiddenRevealed}
        onClick={() => api.setStage("EVIDENCE_BOARD")}
      >
        다음으로 →
      </TerminalButton>
    </Screen>
  );
}
