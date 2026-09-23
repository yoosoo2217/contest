"use client";

import { useEffect, useState } from "react";
import type { GameApi } from "@/components/GameShell";
import { ClueId } from "@/lib/gameState";
import { Panel, Screen, SystemHeader, TerminalButton, Label, ClueTag } from "@/components/ui";
import { ObjectiveTracker, HintBox } from "@/components/InvestigationAids";

type AreaId = "ELEVATOR" | "HALLWAY" | "EXIT" | "SECOND_FIGURE";

const AREAS: {
  id: AreaId;
  label: string;
  objectiveLabel: string;
  result: { title: string; lines: string[]; clue?: ClueId };
}[] = [
  {
    id: "ELEVATOR",
    label: "엘리베이터",
    objectiveLabel: "엘리베이터 접근 기록 확인",
    result: {
      title: "접근 기록 발견",
      lines: ["시간:", "02:17:03"],
      clue: "TIME",
    },
  },
  {
    id: "HALLWAY",
    label: "복도",
    objectiveLabel: "복도 확인",
    result: {
      title: "특이사항 없음",
      lines: ["특이사항이 없습니다."],
    },
  },
  {
    id: "EXIT",
    label: "출입문",
    objectiveLabel: "출입문 확인",
    result: {
      title: "특이사항 없음",
      lines: ["특이사항이 없습니다."],
    },
  },
  {
    id: "SECOND_FIGURE",
    label: "두 번째 인물",
    objectiveLabel: "두 번째 인물 확인",
    result: {
      title: "이상 징후 발견",
      lines: [
        "인원 수:",
        "2",
        "공식 기록에는 존재하지 않는 두 번째 인물이 확인되었습니다.",
      ],
      clue: "UNKNOWN_FIGURE",
    },
  },
];

const TIMESTAMPS = ["02:16:48", "02:17:03", "02:17:18"];

const HINTS = [
  "각 구역을 순서대로 클릭해 화면을 확인해보세요.",
  "엘리베이터 쪽 기록에 사건의 마지막 시간이 남아있을 수 있습니다.",
  "두 번째 인물이 등장하는 구역을 반드시 확인하세요. 공식 기록과 다른 점이 있습니다.",
];

export default function CctvInvestigation({ api }: { api: GameApi }) {
  const [selected, setSelected] = useState<AreaId | null>(null);
  const [inspected, setInspected] = useState<Set<AreaId>>(new Set());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2500);
    return () => clearInterval(id);
  }, []);

  const allInspected = inspected.size === AREAS.length;

  function inspect(area: (typeof AREAS)[number]) {
    setSelected(area.id);
    setInspected((prev) => new Set(prev).add(area.id));
    if (area.result.clue) {
      api.addClue(area.result.clue);
    }
  }

  const activeResult = AREAS.find((a) => a.id === selected)?.result;

  return (
    <Screen>
      <SystemHeader title="CCTV 조사" subtitle="CAM_02 // 지하 접근 복도" />

      <ObjectiveTracker
        completed={AREAS.filter((a) => inspected.has(a.id)).map(
          (a) => a.objectiveLabel
        )}
        active={
          allInspected
            ? null
            : "조사 가능한 영역을 모두 확인하세요."
        }
      />

      <div className="flex items-center justify-between mb-4">
        <Label>기록 로그</Label>
        <div className="flex gap-3 font-mono text-xs">
          {TIMESTAMPS.map((t, i) => (
            <span
              key={t}
              className={
                i === tick % TIMESTAMPS.length
                  ? "text-red-bright"
                  : "text-muted"
              }
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <Panel className="p-3 mb-3">
        <div className="text-[10px] text-muted tracking-[0.3em] uppercase mb-2 px-1">
          조사 가능한 영역
        </div>
        <div className="aspect-video w-full border border-line bg-black relative overflow-hidden grid grid-cols-2 grid-rows-2">
          {AREAS.map((area) => (
            <button
              key={area.id}
              onClick={() => inspect(area)}
              className={`border border-line/60 flex items-center justify-center text-xs tracking-widest uppercase transition-colors ${
                selected === area.id
                  ? "bg-red/20 text-red-bright"
                  : "text-secondary hover:bg-white/5 hover:text-ink"
              }`}
            >
              <span className="flex items-center gap-2">
                {area.label}
                {inspected.has(area.id) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-bright inline-block" />
                )}
              </span>
            </button>
          ))}
          <div className="absolute top-2 left-2 text-[10px] text-muted tracking-widest">
            REC ●
          </div>
        </div>
      </Panel>

      <Panel className="p-5 min-h-[110px] mb-6">
        {activeResult ? (
          <div className="space-y-2">
            <div className="text-red-bright tracking-widest text-sm">
              {activeResult.title}
            </div>
            {activeResult.lines.map((line, i) => (
              <div key={i} className="text-ink text-sm tracking-wide">
                {line}
              </div>
            ))}
            {activeResult.clue && (
              <div className="pt-2">
                <ClueTag label={`단서 획득: ${activeResult.clue === "TIME" ? "02:17:03" : "두 번째 인물"}`} />
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted text-sm tracking-widest uppercase">
            조사할 영역을 선택하세요.
          </div>
        )}
      </Panel>

      <HintBox hints={HINTS} solved={allInspected} />

      {!allInspected && (
        <div className="text-xs text-muted tracking-widest uppercase mb-4">
          진행하기에 증거가 부족합니다.
        </div>
      )}

      <TerminalButton
        disabled={!allInspected}
        onClick={() => api.setStage("SECURITY_RECORD")}
      >
        다음으로 →
      </TerminalButton>
    </Screen>
  );
}
