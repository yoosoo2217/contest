"use client";

export default function TitleScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4 py-16">
      {/* Faint scattered case-record fragments — atmosphere only, not meant to be read */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute inset-0 opacity-[0.12] font-mono text-[10px] md:text-xs text-secondary"
      >
        <div className="hidden sm:block absolute top-[12%] left-[6%] leading-relaxed">
          02:17:03
          <br />
          CAM_03
        </div>
        <div className="hidden sm:block absolute top-[18%] right-[8%] text-right leading-relaxed">
          SIGNAL LOST
          <br />
          B3
        </div>
        <div className="hidden md:block absolute bottom-[16%] left-[9%] leading-relaxed">
          ACCESS RECORD
        </div>
        <div className="hidden md:block absolute bottom-[20%] right-[10%] leading-relaxed">
          UNKNOWN
          <br />
          ---
        </div>
      </div>

      {/* Faint CCTV corner frame — background texture, never the focal point */}
      <div
        aria-hidden
        className="hidden sm:block pointer-events-none select-none absolute bottom-10 right-8 w-28 h-16 border border-line/50 opacity-25"
      >
        <div className="p-1.5 font-mono text-[9px] leading-tight text-muted">
          CAM_03
          <br />
          02:17:03
        </div>
      </div>

      <div className="relative z-10 w-full max-w-xl text-center space-y-8">
        <div className="title-fade flex items-center justify-between text-[11px] tracking-[0.25em] uppercase">
          <span className="flex items-center gap-2 text-[#52525b]">
            <span className="inline-block w-2 h-2 border border-[#52525b]" />
            보안 기록 시스템 // CL-902
          </span>
          <span className="text-[#52525b]">SYSTEM STATUS : ONLINE</span>
        </div>

        <div className="title-fade space-y-2" style={{ animationDelay: "0.5s" }}>
          <div className="relative inline-block overflow-hidden">
            <h1 className="title-crt-text text-2xl sm:text-3xl md:text-4xl tracking-[0.08em] sm:tracking-[0.15em] md:tracking-[0.2em] uppercase text-ink font-semibold">
              THE LAST RECORD
            </h1>
            <span className="title-scanline" aria-hidden />
          </div>
          <div className="text-secondary text-sm tracking-widest uppercase">
            마지막 기록
          </div>
        </div>

        <div
          className="title-fade border-t border-b border-line py-6 space-y-2"
          style={{ animationDelay: "1s" }}
        >
          <div className="flex items-center justify-center gap-2 text-muted text-xs tracking-[0.3em] uppercase">
            <span>CASE_014</span>
            <span className="border border-red/50 text-red-bright px-1.5 py-0.5 text-[9px] tracking-widest normal-case">
              ACTIVE FILE
            </span>
          </div>
          <div className="text-ink text-lg font-serif tracking-wide">
            한서연 실종 사건
          </div>
        </div>

        <div className="title-fade space-y-1" style={{ animationDelay: "1.3s" }}>
          <p className="text-secondary font-serif text-lg italic">
            &ldquo;Records remember everything.&rdquo;
          </p>
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#52525b]">
            RECORD STATUS // UNRESOLVED
          </div>
        </div>

        <div
          className="title-fade pt-2 flex flex-col items-center gap-2"
          style={{ animationDelay: "1.7s" }}
        >
          <div className="group inline-flex flex-col items-center gap-2">
            <button
              onClick={onStart}
              className="px-6 py-3 text-sm tracking-[0.3em] uppercase border border-[#52525b] text-ink transition-all duration-300 hover:border-red-bright hover:shadow-[0_0_14px_rgba(150,45,45,0.25)]"
            >
              게임 시작 →
            </button>
            <div className="h-4 text-[10px] tracking-widest text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              기록에 접근하시겠습니까?
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="title-fade text-[10px] tracking-widest text-[#3f3f46]"
          style={{ animationDelay: "2.1s" }}
        >
          INVESTIGATOR: UNKNOWN
        </div>
      </div>
    </main>
  );
}
