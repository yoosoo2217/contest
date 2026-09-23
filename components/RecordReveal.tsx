"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

export function RecordReveal({
  entries,
  stepMs = 140,
}: {
  entries: ReactNode[];
  stepMs?: number;
}) {
  const [skipped, setSkipped] = useState(false);

  return (
    <div onClick={() => setSkipped(true)} className="space-y-3 cursor-pointer">
      {entries.map((entry, i) => {
        const style: CSSProperties = skipped
          ? { animationDelay: "0ms", animationDuration: "150ms" }
          : { animationDelay: `${i * stepMs}ms` };
        return (
          <div key={i} className="record-reveal" style={style}>
            {entry}
          </div>
        );
      })}
    </div>
  );
}
