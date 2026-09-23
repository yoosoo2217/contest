"use client";

import { useState } from "react";
import type { GameApi } from "@/components/GameShell";
import { Panel, Screen, SystemHeader, TerminalButton, ClueTag } from "@/components/ui";
import { ObjectiveTracker } from "@/components/InvestigationAids";

const DURATION = 60;
const TARGET_START = 31;
const TARGET_END = 34;

const SEGMENTS = [
  { key: "s1", label: "00:00 ~ 00:10", start: 0, end: 10, correct: false },
  { key: "s2", label: "00:20 ~ 00:30", start: 20, end: 30, correct: false },
  { key: "s3", label: "00:31 ~ 00:34", start: TARGET_START, end: TARGET_END, correct: true },
] as const;

function barHeight(i: number) {
  const base = Math.abs(Math.sin(i * 0.7) * 0.5 + Math.sin(i * 0.31) * 0.35);
  const spike = i >= TARGET_START && i < TARGET_END ? 0.25 : 0;
  return Math.min(1, 0.15 + base + spike);
}

export default function AudioForensics({ api }: { api: GameApi }) {
  const [selected, setSelected] = useState<(typeof SEGMENTS)[number] | null>(
    null
  );
  const [hiddenRevealed, setHiddenRevealed] = useState(
    api.state.foundClues.includes("HIDDEN_VOICE")
  );

  const analyzed = selected?.correct ?? false;

  function selectSegment(segment: (typeof SEGMENTS)[number]) {
    setSelected(segment);
  }

  function isolateHiddenLayer() {
    setHiddenRevealed(true);
    api.addClue("HIDDEN_VOICE");
  }

  return (
    <Screen>
      <SystemHeader title="음성 분석" subtitle="AUDIO_06 // 파형 분석" />

      <ObjectiveTracker
        completed={analyzed ? ["이상 신호 구간 확인"] : []}
        active={analyzed ? null : "오디오 파형에서 의심스러운 구간을 조사하세요."}
      />

      <Panel className="p-5 mb-3">
        <div className="flex h-32 items-end gap-[2px]">
          {Array.from({ length: DURATION }, (_, i) => {
            const inSelection =
              selected !== null && i >= selected.start && i < selected.end;
            return (
              <div
                key={i}
                style={{ height: `${barHeight(i) * 100}%` }}
                className={`flex-1 min-w-[2px] transition-colors ${
                  inSelection ? "bg-red-bright" : "bg-secondary/40"
                }`}
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

      <div className="mb-6 space-y-2">
        <div className="text-[10px] tracking-[0.3em] uppercase text-muted">
          조사 구간 선택
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SEGMENTS.map((segment) => (
            <button
              key={segment.key}
              onClick={() => selectSegment(segment)}
              className={`border px-4 py-3 text-sm tracking-widest transition-colors ${
                selected?.key === segment.key
                  ? "border-red-bright text-red-bright bg-red/10"
                  : "border-line text-secondary hover:border-secondary"
              }`}
            >
              [ {segment.label} ]
            </button>
          ))}
        </div>
      </div>

      {selected && !analyzed && (
        <Panel className="p-5 mb-6">
          <div className="text-muted text-sm tracking-widest uppercase">
            이 구간에서는 특별한 신호가 없습니다.
          </div>
        </Panel>
      )}

      {analyzed && (
        <Panel className="p-6 mb-6 space-y-4">
          <div className="text-red-bright text-sm tracking-widest uppercase">
            AUDIO_06 — 분석 결과
          </div>
          <div className="space-y-3 text-lg">
            <div>
              <div className="text-muted text-[10px] tracking-[0.3em] uppercase mb-1">
                정상 음성
              </div>
              <p className="font-serif text-ink">
                &ldquo;이곳은 거기가 아니에요.&rdquo;
              </p>
            </div>
            <div>
              <div className="text-muted text-[10px] tracking-[0.3em] uppercase mb-1">
                정상 음성
              </div>
              <p className="font-serif text-ink">
                &ldquo;아직 나를 찾으러 오지 마.&rdquo;
              </p>
            </div>
          </div>

          {!hiddenRevealed ? (
            <TerminalButton onClick={isolateHiddenLayer}>
              배경음 분리
            </TerminalButton>
          ) : (
            <div className="border-t border-line pt-4 space-y-3">
              <div>
                <div className="text-muted text-[10px] tracking-[0.3em] uppercase mb-1">
                  숨겨진 음성 — 낮은 음량
                </div>
                <p className="font-serif text-red-bright text-lg">
                  &ldquo;이미 찾았잖아.&rdquo;
                </p>
              </div>
              <ClueTag label="단서 획득: 숨겨진 음성" />
              <div className="text-secondary text-xs tracking-wide pt-1">
                ▸ 음성의 발화자는 조사관의 존재를 알고 있었던 것으로 보입니다.
              </div>
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
