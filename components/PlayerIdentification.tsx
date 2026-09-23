"use client";

import { useState } from "react";
import type { GameApi } from "@/components/GameShell";
import { Screen, SystemHeader, TerminalButton, Label } from "@/components/ui";

export default function PlayerIdentification({ api }: { api: GameApi }) {
  const [name, setName] = useState(api.state.investigatorName);
  const [touched, setTouched] = useState(false);

  const trimmed = name.trim();
  const canProceed = trimmed.length > 0;

  function begin() {
    if (!canProceed) {
      setTouched(true);
      return;
    }
    api.update({ investigatorName: trimmed, currentStage: "CASE_FILE" });
  }

  return (
    <Screen>
      <SystemHeader
        title="THE LAST RECORD"
        subtitle="시스템 상태: 조사관 대기 중"
      />

      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-lg tracking-wide text-ink font-serif">
            조사관 등록
          </h2>
          <p className="text-secondary text-sm leading-relaxed">
            「마지막 기록을 읽게 될 사람은 누구인가?」
            <br />
            이 기록을 조사할 사람의 이름을 입력하세요.
          </p>
        </div>

        <div className="space-y-2">
          <Label>조사관 이름</Label>
          <div className="flex items-center gap-3 border border-line bg-panel px-4 py-3">
            <span className="text-red-bright">{">"}</span>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") begin();
              }}
              maxLength={24}
              placeholder="이름 입력"
              className="flex-1 bg-transparent outline-none text-ink placeholder:text-muted tracking-widest uppercase"
            />
          </div>
          {touched && !canProceed ? (
            <div className="text-red-bright text-xs tracking-widest uppercase">
              이름을 입력해야 진행할 수 있습니다.
            </div>
          ) : null}
        </div>

        <p className="text-xs text-muted tracking-widest uppercase">
          주의: 입력한 이름은 조사 기록에 저장됩니다.
        </p>

        <TerminalButton onClick={begin} disabled={!canProceed}>
          {canProceed ? "조사 시작 →" : "이름 등록"}
        </TerminalButton>
      </div>
    </Screen>
  );
}
