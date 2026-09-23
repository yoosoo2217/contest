"use client";

import type { GameApi } from "@/components/GameShell";
import { Screen, TerminalButton } from "@/components/ui";

const SAFE182_LIST_URL = "https://www.safe182.go.kr/home/lcm/lcmMssList.do";

export default function Epilogue({ api }: { api: GameApi }) {
  return (
    <Screen>
      <div className="text-center space-y-1">
        <div className="text-xs tracking-[0.3em] text-muted uppercase">
          THE LAST RECORD
        </div>
        <div className="text-[11px] tracking-[0.25em] text-muted uppercase">
          STATION_ID: CL-902
        </div>
        <div className="text-[11px] tracking-[0.25em] text-muted uppercase">
          SYSTEM_STATUS: ARCHIVE_CLOSED
        </div>
      </div>

      <div className="border-t border-line mt-8" />

      <div className="text-center py-10 space-y-6">
        <div className="text-red-bright text-sm tracking-[0.4em] uppercase">
          EPILOGUE RECORD
        </div>

        <div className="font-serif text-2xl md:text-3xl text-ink tracking-wide leading-relaxed">
          THE STORY ENDS HERE.
          <br />
          THE RECORD DOESN&apos;T.
        </div>

        <div className="max-w-xl mx-auto space-y-3 text-secondary text-sm leading-relaxed pt-4">
          <p>방금까지의 사건은 허구였습니다.</p>
          <p>하지만 화면 밖에는 아직 가족에게 돌아가지 못한 사람들이 있습니다.</p>
          <p>
            이들의 이야기는 괴담이 아닙니다.
            <br />
            아직 끝나지 않은 현실입니다.
          </p>
        </div>
      </div>

      <div className="border-t border-line" />

      <div className="mt-10 flex flex-col items-center gap-4">
        <TerminalButton
          variant="danger"
          className="w-full max-w-sm"
          onClick={() => api.setStage("MISSING_PERSONS")}
        >
          VIEW REAL CASES →
        </TerminalButton>

        <a
          href={SAFE182_LIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-sm text-center px-5 py-3 text-sm tracking-widest uppercase border border-line text-secondary hover:border-secondary hover:text-ink transition-colors duration-150"
        >
          OFFICIAL MISSING PERSON INFORMATION
        </a>

        <TerminalButton
          variant="ghost"
          className="w-full max-w-sm"
          onClick={api.returnToTitle}
        >
          RETURN TO ARCHIVE
        </TerminalButton>
      </div>
    </Screen>
  );
}
