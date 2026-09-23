"use client";

import { useEffect, useState } from "react";
import type { GameApi } from "@/components/GameShell";
import { Panel, Screen, TerminalButton, Label } from "@/components/ui";

export default function HorrorEvent({ api }: { api: GameApi }) {
  const [phase, setPhase] = useState<"glitch" | "revealed">("glitch");

  useEffect(() => {
    const id = setTimeout(() => setPhase("revealed"), 2200);
    return () => clearTimeout(id);
  }, []);

  if (phase === "glitch") {
    return (
      <Screen>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="glitch text-red-bright text-2xl tracking-[0.3em] uppercase">
            시스템 오류
          </div>
          <div className="text-secondary tracking-[0.2em] uppercase blink">
            기록을 다시 불러오는 중...
          </div>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <div className="mb-8">
        <div className="text-xs tracking-[0.3em] text-muted uppercase">
          보안 기록 시스템 // CL-902
        </div>
        <h1 className="mt-2 text-2xl md:text-3xl tracking-[0.15em] uppercase text-red-bright font-semibold">
          기록 변경됨
        </h1>
      </div>

      <Panel className="p-6 space-y-5" border="border-red/60">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>대상</Label>
            <div className="text-ink text-lg font-serif mt-1">한서연</div>
          </div>
          <div>
            <Label>조사관</Label>
            <div className="text-ink text-lg font-serif mt-1">
              {api.state.investigatorName}
            </div>
          </div>
          <div>
            <Label>현재 위치</Label>
            <div className="text-red-bright mt-1 tracking-widest">B4</div>
          </div>
          <div>
            <Label>상태</Label>
            <div className="text-red-bright mt-1 tracking-widest">활성</div>
          </div>
        </div>
      </Panel>

      <div className="mt-8">
        <TerminalButton onClick={() => api.setStage("FINAL_DECISION")}>
          계속하기 →
        </TerminalButton>
      </div>
    </Screen>
  );
}
