"use client";

import type { GameApi } from "@/components/GameShell";
import { Panel, Screen, SystemHeader, TerminalButton, Label } from "@/components/ui";

export default function CaseFile({ api }: { api: GameApi }) {
  return (
    <Screen>
      <SystemHeader title="CASE_014" subtitle="실종 사건" />

      <Panel className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>대상</Label>
            <div className="text-ink text-lg font-serif mt-1">한서연</div>
          </div>
          <div>
            <Label>사건 상태</Label>
            <div className="text-red-bright text-lg font-serif mt-1">미해결</div>
          </div>
          <div>
            <Label>마지막 확인 기록</Label>
            <div className="text-ink mt-1 tracking-widest">02:17:03</div>
          </div>
          <div>
            <Label>마지막 위치</Label>
            <div className="text-ink mt-1 tracking-widest">확인되지 않음</div>
          </div>
        </div>

        <div className="border-t border-line pt-4">
          <Label>조사관</Label>
          <div className="text-ink mt-1 tracking-widest">
            {api.state.investigatorName}
          </div>
        </div>
      </Panel>

      <div className="mt-8">
        <TerminalButton onClick={() => api.setStage("CCTV")}>
          사건 파일 열기
        </TerminalButton>
      </div>
    </Screen>
  );
}
