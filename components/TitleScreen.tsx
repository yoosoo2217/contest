"use client";

import { TerminalButton } from "@/components/ui";

export default function TitleScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="min-h-screen w-full flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl text-center space-y-8">
        <div className="space-y-2">
          <div className="text-xs tracking-[0.3em] text-muted uppercase">
            보안 기록 시스템 // CL-902
          </div>
          <h1 className="text-3xl md:text-4xl tracking-[0.15em] uppercase text-ink font-semibold">
            THE LAST RECORD
          </h1>
          <div className="text-secondary text-sm tracking-widest uppercase">
            마지막 기록
          </div>
        </div>

        <div className="border-t border-b border-line py-6 space-y-1">
          <div className="text-muted text-xs tracking-[0.3em] uppercase">
            CASE_014
          </div>
          <div className="text-ink text-lg font-serif tracking-wide">
            한서연 실종 사건
          </div>
        </div>

        <p className="text-secondary font-serif text-lg italic">
          &ldquo;기록은 모든 것을 기억한다.&rdquo;
        </p>

        <div className="pt-2 flex justify-center">
          <TerminalButton onClick={onStart}>게임 시작</TerminalButton>
        </div>
      </div>
    </main>
  );
}
