"use client";

import type { GameApi } from "@/components/GameShell";
import { Ending, FinalChoice } from "@/lib/gameState";
import { Screen, SystemHeader, TerminalButton } from "@/components/ui";

const OPTIONS: { choice: FinalChoice; ending: Ending; label: string }[] = [
  { choice: "ELEVATOR", ending: "B", label: "엘리베이터를 연다" },
  { choice: "RECORD", ending: "C", label: "마지막 기록을 확인한다" },
  { choice: "LEAVE", ending: "A", label: "건물을 떠난다" },
];

export default function FinalDecision({ api }: { api: GameApi }) {
  function choose(choice: FinalChoice, ending: Ending) {
    api.update({ finalChoice: choice, ending, currentStage: "ENDING" });
  }

  return (
    <Screen>
      <SystemHeader title="최종 선택" subtitle="마지막 기록이 발견되었습니다." />

      <p className="text-secondary text-sm tracking-widest uppercase mb-8">
        어떻게 하시겠습니까?
      </p>

      <div className="flex flex-col gap-4">
        {OPTIONS.map((opt) => (
          <TerminalButton
            key={opt.label}
            className="w-full text-left"
            onClick={() => choose(opt.choice, opt.ending)}
          >
            [ {opt.label} ]
          </TerminalButton>
        ))}
      </div>
    </Screen>
  );
}
