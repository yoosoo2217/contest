"use client";

import type { ReactNode } from "react";
import type { GameApi } from "@/components/GameShell";
import { Panel, Screen, SystemHeader, TerminalButton, Label } from "@/components/ui";
import { RecordReveal } from "@/components/RecordReveal";

function Field({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "red";
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div
        className={`mt-1 tracking-widest ${
          tone === "red" ? "text-red-bright" : "text-ink"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Stat({ value, label, tone = "default" }: { value: string; label: string; tone?: "default" | "red" }) {
  return (
    <div>
      <div
        className={`font-serif text-lg tracking-widest ${
          tone === "red" ? "text-red-bright" : "text-ink"
        }`}
      >
        {value}
      </div>
      <Label>{label}</Label>
    </div>
  );
}

function Narrative({ children }: { children: ReactNode }) {
  return <p className="text-secondary text-sm leading-relaxed">{children}</p>;
}

export default function Ending({ api }: { api: GameApi }) {
  const { ending, investigatorName } = api.state;
  const name = investigatorName || "UNKNOWN";

  return (
    <Screen>
      {ending === "A" && (
        <>
          <SystemHeader title="엔딩 A" subtitle="사라진 기록" />
          <Panel className="p-6">
            <RecordReveal
              entries={[
                <p key="1" className="text-ink font-serif text-lg tracking-widest">
                  02:17:03.
                </p>,
                <Narrative key="2">마지막으로 확인된 시간.</Narrative>,
                <Narrative key="3">그 이후의 기록은 존재하지 않는다.</Narrative>,
                <Narrative key="4">
                  CCTV는 끊겼고,
                  <br />
                  엘리베이터 기록도 사라졌다.
                </Narrative>,
                <Narrative key="5">
                  한서연이 어디로 갔는지는
                  <br />
                  끝내 확인할 수 없었다.
                </Narrative>,
                <Narrative key="6">
                  조사는 종료되었다.
                  <br />
                  사건 기록은 보관 처리되었다.
                </Narrative>,
                <Narrative key="7">하지만 이상한 점이 하나 있었다.</Narrative>,
                <Narrative key="8">
                  조사 종료 시간은
                  <br />
                  02:17:18.
                </Narrative>,
                <Narrative key="9">누군가 마지막 기록을 확인한 직후였다.</Narrative>,
                <Narrative key="10">
                  그리고 시스템에는
                  <br />
                  삭제되지 않은 기록 하나가 남아 있었다.
                </Narrative>,
                <div
                  key="11"
                  className="grid grid-cols-2 gap-6 border-t border-line pt-4"
                >
                  <Field label="INVESTIGATOR" value={name} />
                  <Field label="STATUS" value="ACTIVE" tone="red" />
                </div>,
                <p
                  key="12"
                  className="font-serif text-lg text-ink leading-relaxed pt-2"
                >
                  기록은 사라졌지만
                  <br />
                  누군가가 그 기록을 보고 있었다.
                </p>,
              ]}
            />
          </Panel>
        </>
      )}

      {ending === "B" && (
        <>
          <SystemHeader title="엔딩 B" subtitle="기록의 일부" />
          <Panel className="p-6" border="border-red/60">
            <RecordReveal
              entries={[
                <Narrative key="1">모든 기록이 하나로 연결되었다.</Narrative>,
                <div key="2" className="grid grid-cols-2 gap-6">
                  <Stat value="02:17:03" label="CCTV" />
                  <Stat value="02:17:18" label="보안 기록" />
                  <Stat value="B3" label="엘리베이터" />
                  <Stat value="B4" label="미등록 층" tone="red" />
                </div>,
                <Narrative key="3">그리고 마지막으로 발견된 기록.</Narrative>,
                <div key="4" className="border-t border-line pt-4">
                  <Field label="INVESTIGATOR" value={name} />
                </div>,
                <Narrative key="5">처음에는 오류라고 생각했다.</Narrative>,
                <Narrative key="6">
                  하지만 다음 기록에도
                  <br />
                  같은 이름이 나타났다.
                </Narrative>,
                <Narrative key="7">그리고 그 다음 기록에도.</Narrative>,
                <Narrative key="8">
                  기록의 작성자는
                  <br />
                  한서연이 아니었다.
                </Narrative>,
                <Narrative key="9">사건을 조사하던 사람도 아니었다.</Narrative>,
                <Narrative key="10">
                  기록은 계속해서
                  <br />
                  현재의 조사자를 가리키고 있었다.
                </Narrative>,
                <div key="11" className="grid grid-cols-2 gap-6 border-t border-line pt-4">
                  <Field label="LOCATION" value="B4" tone="red" />
                  <Field label="STATUS" value="ACTIVE" tone="red" />
                </div>,
                <p key="12" className="text-ink font-serif text-lg tracking-widest">
                  02:17:18
                </p>,
                <Narrative key="13">
                  마지막 기록의 시간이
                  <br />
                  다시 나타났다.
                </Narrative>,
                <Narrative key="14">
                  그 순간,
                  <br />
                  조사 화면에 새로운 문장이 기록되었다.
                </Narrative>,
                <p key="15" className="font-serif text-red-bright text-lg">
                  &ldquo;조사는 완료되었습니다.&rdquo;
                </p>,
                <p key="16" className="font-serif text-red-bright text-lg">
                  &ldquo;조사자 등록 완료.&rdquo;
                </p>,
                <p key="17" className="font-serif text-lg text-ink leading-relaxed pt-2">
                  당신은 사건을 조사한 사람이 아니었다.
                  <br />
                  당신 역시
                  <br />
                  사건의 일부였다.
                </p>,
              ]}
            />
          </Panel>
        </>
      )}

      {ending === "C" && (
        <>
          <SystemHeader title="엔딩 C" subtitle="마지막 기록" />
          <Panel className="p-6" border="border-red/60">
            <RecordReveal
              entries={[
                <p key="1" className="text-ink font-serif text-lg tracking-widest">
                  02:17:03.
                </p>,
                <Narrative key="2">CCTV에 한서연의 모습이 마지막으로 남았다.</Narrative>,
                <Narrative key="3">
                  하지만 그것은
                  <br />
                  사건의 마지막이 아니었다.
                </Narrative>,
                <p key="4" className="text-red-bright font-serif text-lg tracking-widest">
                  02:17:18.
                </p>,
                <Narrative key="5">보안 시스템에 새로운 기록이 생성되었다.</Narrative>,
                <div key="6" className="grid grid-cols-2 gap-6 border-t border-line pt-4">
                  <Field label="ACCESS" value="B3 → B4" tone="red" />
                  <Field label="LOCATION" value="UNREGISTERED FLOOR" tone="red" />
                  <Field label="INVESTIGATOR" value={name} />
                </div>,
                <Narrative key="7">
                  처음에는 누군가가 남긴
                  <br />
                  오류 기록이라고 생각했다.
                </Narrative>,
                <Narrative key="8">
                  하지만 기록의 생성 시간은
                  <br />
                  현재 시간과 일치하고 있었다.
                </Narrative>,
                <Narrative key="9">
                  그리고 AUDIO_06의 마지막 부분에서
                  <br />
                  희미한 목소리가 들렸다.
                </Narrative>,
                <p key="10" className="font-serif text-red-bright text-lg">
                  &ldquo;이미 찾았잖아.&rdquo;
                </p>,
                <Narrative key="11">
                  그 순간,
                  <br />
                  화면에 새로운 기록이 나타났다.
                </Narrative>,
                <div key="12" className="border-t border-line pt-4 space-y-3">
                  <Label>CASE_014</Label>
                  <div className="grid grid-cols-2 gap-6">
                    <Field label="SUBJECT" value="HAN SEO-YEON" />
                    <Field label="STATUS" value="MISSING" tone="red" />
                  </div>
                </div>,
                <div key="13" className="grid grid-cols-2 gap-6">
                  <Field label="SUBJECT 02" value={name} tone="red" />
                  <Field label="STATUS" value="ACTIVE" tone="red" />
                </div>,
                <Field key="14" label="LOCATION" value="B4" tone="red" />,
                <div key="15" className="h-2" aria-hidden />,
                <p key="16" className="text-ink font-serif text-lg tracking-widest">
                  02:17:18
                </p>,
                <Narrative key="17">기록 종료.</Narrative>,
                <p
                  key="18"
                  className="text-red-bright text-xs tracking-[0.3em] uppercase"
                >
                  NEW RECORD DETECTED
                </p>,
                <p key="19" className="text-red-bright font-serif text-xl tracking-widest">
                  02:17:19
                </p>,
                <p key="20" className="font-serif text-lg text-ink leading-relaxed pt-2">
                  당신이 마지막 기록을 찾은 것이 아니다.
                  <br />
                  <br />
                  마지막 기록이
                  <br />
                  당신을 찾은 것이다.
                </p>,
              ]}
            />
          </Panel>
        </>
      )}

      <Panel className="p-6 mt-8 space-y-3">
        <Label>CASE_014</Label>
        <div className="text-muted text-sm tracking-widest">
          ARCHIVE STATUS: CLOSED
        </div>
        <div className="font-serif text-lg text-ink pt-2 leading-relaxed">
          THE STORY ENDS HERE.
          <br />
          THE RECORD DOESN&apos;T.
        </div>
      </Panel>

      <div className="mt-10">
        <TerminalButton onClick={() => api.setStage("EPILOGUE")}>
          진짜 결말 보기 →
        </TerminalButton>
      </div>

      <div className="mt-4">
        <TerminalButton variant="ghost" onClick={api.resetGame}>
          조사 다시 시작
        </TerminalButton>
      </div>
    </Screen>
  );
}
