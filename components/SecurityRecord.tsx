"use client";

import { useState } from "react";
import type { GameApi } from "@/components/GameShell";
import { Panel, Screen, SystemHeader, TerminalButton, Label, ClueTag } from "@/components/ui";

const PASSWORD = "0217";

export default function SecurityRecord({ api }: { api: GameApi }) {
  const [input, setInput] = useState("");
  const [denied, setDenied] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const granted = api.state.unlockedRecords.includes("security_record");

  function submit() {
    if (input.trim() === PASSWORD) {
      setDenied(false);
      api.addClue("ELEVATOR");
      api.addClue("B3");
      api.update({
        unlockedRecords: Array.from(
          new Set([...api.state.unlockedRecords, "security_record"])
        ),
      });
    } else {
      setDenied(true);
      setAttempts((a) => a + 1);
    }
  }

  return (
    <Screen>
      <SystemHeader
        title="보안 기록"
        subtitle={granted ? "상태: 접근 승인" : "상태: 잠김"}
      />

      {!granted ? (
        <Panel className="p-6 space-y-5">
          <div className="text-secondary text-sm tracking-widest uppercase">
            이 기록을 열려면 비밀번호가 필요합니다.
          </div>
          <div className="text-muted text-xs tracking-widest">
            힌트: 방금 확인한 마지막 기록의 시간을 입력하세요.
          </div>
          <div className="flex items-center gap-3 border border-line bg-panel px-4 py-3">
            <span className="text-red-bright">{">"}</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              maxLength={8}
              placeholder="비밀번호 입력"
              className="flex-1 bg-transparent outline-none text-ink placeholder:text-muted tracking-[0.3em]"
            />
          </div>
          {denied && (
            <div className="space-y-1">
              <div className="text-red-bright text-sm tracking-widest uppercase">
                접근 거부
              </div>
              <div className="text-muted text-xs tracking-widest uppercase">
                비밀번호가 일치하지 않습니다. 기록 일부가 손상되었습니다.
              </div>
              <div className="text-muted text-xs tracking-widest uppercase">
                다시 시도하세요.
              </div>
            </div>
          )}
          {attempts > 0 && (
            <div className="text-muted text-[11px] tracking-widest uppercase">
              시도 횟수: {attempts}
            </div>
          )}
          <TerminalButton onClick={submit}>기록 열기</TerminalButton>
        </Panel>
      ) : (
        <div className="space-y-6">
          <Panel className="p-6 space-y-4">
            <div className="text-red-bright text-sm tracking-widest uppercase">
              접근 승인
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>엘리베이터 접근</Label>
                <div className="text-ink mt-1 tracking-widest">02:17</div>
              </div>
              <div>
                <Label>출발 층</Label>
                <div className="text-ink mt-1 tracking-widest">B3</div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <ClueTag label="단서 획득: 엘리베이터" />
              <ClueTag label="단서 획득: B3" />
            </div>
          </Panel>

          <Panel className="p-6 space-y-3" border="border-red/50">
            <Label>이상 기록</Label>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>목적 층</Label>
                <div className="text-red-bright mt-1 tracking-widest">B4</div>
              </div>
              <div>
                <Label>경고</Label>
                <div className="text-red-bright mt-1 tracking-widest text-sm">
                  건물 공식 도면에는 B4층이 존재하지 않습니다.
                </div>
              </div>
            </div>
          </Panel>

          <TerminalButton onClick={() => api.setStage("MAP")}>
            다음으로 →
          </TerminalButton>
        </div>
      )}
    </Screen>
  );
}
