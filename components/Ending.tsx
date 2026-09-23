"use client";

import type { GameApi } from "@/components/GameShell";
import { Panel, Screen, SystemHeader, TerminalButton, Label } from "@/components/ui";
import MissingPersonsSection from "@/components/MissingPersonsSection";

export default function Ending({ api }: { api: GameApi }) {
  const { ending, investigatorName } = api.state;

  return (
    <>
      <Screen>
        {ending === "A" && (
          <>
            <SystemHeader title="엔딩 A" subtitle="사라진 기록" />
            <Panel className="p-6 space-y-4">
              <div className="text-secondary text-sm tracking-widest uppercase">
                기록에서 조사관의 흔적이 사라졌습니다.
              </div>
              <div>
                <Label>조사관</Label>
                <div className="text-ink mt-1 tracking-widest">
                  {investigatorName}
                </div>
              </div>
              <div>
                <Label>상태</Label>
                <div className="text-muted mt-1 tracking-widest">확인 불가</div>
              </div>
            </Panel>
          </>
        )}

        {ending === "B" && (
          <>
            <SystemHeader title="엔딩 B" subtitle="기록의 일부" />
            <Panel className="p-6 space-y-4" border="border-red/60">
              <div className="text-secondary text-sm tracking-widest uppercase">
                당신은 사건 기록의 일부가 되었습니다.
              </div>
              <div>
                <Label>조사관</Label>
                <div className="text-ink mt-1 tracking-widest">
                  {investigatorName}
                </div>
              </div>
              <div>
                <Label>현재 위치</Label>
                <div className="text-red-bright mt-1 tracking-widest">B4</div>
              </div>
              <div>
                <Label>상태</Label>
                <div className="text-red-bright mt-1 tracking-widest">기록됨</div>
              </div>
            </Panel>
          </>
        )}

        {ending === "C" && (
          <>
            <SystemHeader title="엔딩 C" subtitle="마지막 기록" />
            <Panel className="p-6 space-y-5">
              <div className="font-serif text-xl text-ink leading-relaxed">
                THE LAST RECORD
                <br />
                이야기는 여기서 끝난다.
                <br />
                하지만 기록은 끝나지 않는다.
              </div>
              <div className="border-t border-line pt-4">
                <Label>CASE_014</Label>
                <div className="text-muted mt-1 tracking-widest">기록 보관 완료</div>
              </div>
            </Panel>
          </>
        )}

        <div className="mt-10 text-center space-y-1.5">
          <p className="text-secondary text-sm tracking-wide">
            이 이야기는 여기서 끝나지 않습니다.
          </p>
          <p className="text-muted text-xs tracking-[0.25em] uppercase">
            THE RECORD DOESN&apos;T END HERE.
          </p>
        </div>

        <div className="mt-10">
          <TerminalButton variant="ghost" onClick={api.resetGame}>
            조사 다시 시작
          </TerminalButton>
        </div>
      </Screen>

      {/* The game's ending is fully over above this point. Everything below
          is a separate, real-world information section — not part of the
          fictional case file. */}
      <MissingPersonsSection />
    </>
  );
}
