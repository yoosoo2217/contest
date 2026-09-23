"use client";

import { useState } from "react";
import type { GameApi } from "@/components/GameShell";
import { Panel, Screen, SystemHeader, TerminalButton, Label, ClueTag } from "@/components/ui";
import { ObjectiveTracker, HintBox } from "@/components/InvestigationAids";

const PASSWORD = "0217";

const HINTS = [
  "사건 파일에서 마지막 확인 기록을 다시 확인해보세요.",
  "CCTV에서 확인한 시간이 중요합니다.",
  "마지막 확인 기록은 02:17:03입니다. 비밀번호는 시와 분만 사용합니다.",
];

export default function SecurityRecord({ api }: { api: GameApi }) {
  const [input, setInput] = useState("");
  const [denied, setDenied] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const granted = api.state.unlockedRecords.includes("security_record");
  const compared = api.state.foundClues.includes("UNREGISTERED_FLOOR");

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

  function compareWithBlueprint() {
    api.addClue("UNREGISTERED_FLOOR");
  }

  return (
    <Screen>
      <SystemHeader
        title="보안 기록"
        subtitle={granted ? "상태: 접근 승인" : "상태: 잠김"}
      />

      <ObjectiveTracker
        completed={[
          ...(granted ? ["보안 기록 접근 승인"] : []),
          ...(compared ? ["건물 도면과 대조 완료"] : []),
        ]}
        active={
          !granted
            ? "발견한 시간을 이용해 보안 기록을 열어보세요."
            : !compared
            ? "건물 도면과 대조해 이상 여부를 확인하세요."
            : null
        }
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
              onChange={(e) =>
                setInput(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              placeholder="비밀번호 입력 (4자리)"
              className="flex-1 bg-transparent outline-none text-ink placeholder:text-muted tracking-[0.3em]"
            />
          </div>
          {denied && (
            <div className="space-y-1">
              <div className="text-red-bright text-sm tracking-widest uppercase">
                접근 실패
              </div>
              <div className="text-muted text-xs tracking-widest uppercase">
                힌트: 마지막 확인 기록의 시각을 다시 확인하십시오.
              </div>
            </div>
          )}
          {attempts > 0 && (
            <div className="text-muted text-[11px] tracking-widest uppercase">
              시도 횟수: {attempts}
            </div>
          )}
          <HintBox hints={HINTS} solved={granted} />
          <TerminalButton onClick={submit} disabled={input.length !== 4}>
            접근
          </TerminalButton>
        </Panel>
      ) : (
        <div className="space-y-6">
          <Panel className="p-6 space-y-4">
            <div className="text-red-bright text-sm tracking-widest uppercase">
              접근 승인 — ACCESS RECORD
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>출발 층</Label>
                <div className="text-ink mt-1 tracking-widest">B3</div>
              </div>
              <div>
                <Label>목적 층</Label>
                <div className="text-ink mt-1 tracking-widest">B4</div>
              </div>
              <div>
                <Label>접근 시간</Label>
                <div className="text-ink mt-1 tracking-widest">02:17:03</div>
              </div>
              <div>
                <Label>기록 상태</Label>
                <div className="text-red-bright mt-1 tracking-widest">비정상</div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <ClueTag label="단서 획득: 엘리베이터" />
              <ClueTag label="단서 획득: B3" />
            </div>
          </Panel>

          {!compared ? (
            <Panel className="p-6 space-y-4">
              <div className="text-secondary text-sm tracking-widest uppercase">
                목적 층 B4가 건물 도면에 있는지 확인해야 합니다.
              </div>
              <TerminalButton onClick={compareWithBlueprint}>
                건물 도면과 대조
              </TerminalButton>
            </Panel>
          ) : (
            <Panel className="p-6 space-y-3" border="border-red/50">
              <Label>대조 결과</Label>
              <div className="text-red-bright text-sm tracking-widest">
                B4층은 공식 건물 도면에 존재하지 않습니다.
              </div>
              <ClueTag label="단서 획득: 미등록 층" />
            </Panel>
          )}

          <TerminalButton
            disabled={!compared}
            onClick={() => api.setStage("MAP")}
          >
            지도 조사로 이동 →
          </TerminalButton>
        </div>
      )}
    </Screen>
  );
}
