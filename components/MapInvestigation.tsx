"use client";

import { useState } from "react";
import type { GameApi } from "@/components/GameShell";
import { Panel, Screen, SystemHeader, TerminalButton, Label, ClueTag } from "@/components/ui";
import { ObjectiveTracker, HintBox } from "@/components/InvestigationAids";

const KNOWN_FLOORS = ["B1", "B2", "B3"];

const HINTS = [
  "B3 아래에 이상한 흔적이 있습니다.",
  "물음표로 표시된 영역을 스캔해보세요.",
  "스캔 버튼을 누르면 B4의 존재가 드러납니다.",
];

export default function MapInvestigation({ api }: { api: GameApi }) {
  const [scanning, setScanning] = useState(false);
  const discovered = api.state.discoveredB4;

  function runScan() {
    if (discovered) return;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      api.addClue("UNREGISTERED_FLOOR");
      api.update({ discoveredB4: true });
    }, 1200);
  }

  return (
    <Screen>
      <SystemHeader title="지도 조사" subtitle="건물 구조 분석 // CL-902" />

      <ObjectiveTracker
        completed={discovered ? ["미등록 공간 확인"] : []}
        active={discovered ? null : "B4가 존재하는지 확인하세요."}
      />

      <Panel className="p-6 mb-6">
        <Label>확인된 층</Label>
        <div className="mt-3 space-y-2">
          {KNOWN_FLOORS.map((f) => (
            <div
              key={f}
              className="border border-line px-4 py-3 flex items-center justify-between text-sm tracking-widest"
            >
              <span className="text-ink">{f}</span>
              <span className="text-muted text-xs">확인됨</span>
            </div>
          ))}
          <div
            className={`border px-4 py-3 flex items-center justify-between text-sm tracking-widest transition-colors ${
              discovered
                ? "border-red-bright/60"
                : "border-line/40 border-dashed"
            }`}
          >
            <span className={discovered ? "text-red-bright" : "text-muted"}>
              {discovered ? "B4" : "??? "}
            </span>
            <span className="text-muted text-xs">
              {discovered ? "미등록" : "신호 없음"}
            </span>
          </div>
        </div>
      </Panel>

      {!discovered ? (
        <Panel className="p-6 mb-6 space-y-4">
          <div className="text-secondary text-sm tracking-widest uppercase">
            B3 이하의 구조 데이터가 불완전합니다.
          </div>
          <TerminalButton onClick={runScan} disabled={scanning}>
            {scanning ? "스캔 중..." : "이상 구역 스캔"}
          </TerminalButton>
        </Panel>
      ) : (
        <Panel className="p-6 mb-6 space-y-3" border="border-red/50">
          <div className="text-red-bright text-sm tracking-widest uppercase">
            미등록 공간 발견
          </div>
          <div className="text-ink text-3xl font-serif tracking-widest">B4</div>
          <div className="text-muted text-xs tracking-widest">
            건물 공식 도면에 존재하지 않는 층입니다.
          </div>
          <ClueTag label="단서 획득: 미등록 층" />
        </Panel>
      )}

      <HintBox hints={HINTS} solved={discovered} />

      <TerminalButton
        disabled={!discovered}
        onClick={() => api.setStage("AUDIO")}
      >
        다음으로 →
      </TerminalButton>
    </Screen>
  );
}
