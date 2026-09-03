"use client";

import { useEffect, useState } from "react";

const MAX_ALT = 36000;

export default function AltitudeMeter({ light = false }: { light?: boolean }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setPct(p);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const altitude = Math.round((pct * MAX_ALT) / 100) * 100;
  const phase =
    pct < 0.05
      ? "BOARDING"
      : pct < 0.15
      ? "TAXI"
      : pct < 0.3
      ? "ASCENT"
      : pct < 0.85
      ? "CRUISING"
      : pct < 0.95
      ? "DESCENT"
      : "ARRIVAL";

  return (
    <div className={`hidden md:flex items-center gap-3 font-mono uppercase tracking-[0.25em] text-[10px] ${light ? "text-cream/80" : "text-navy/80"}`}>
      <span className={light ? "text-silver-pale" : "text-silver"}>●</span>
      <span className="tabular-nums">
        {altitude.toLocaleString()} FT
      </span>
      <span className="opacity-50">·</span>
      <span>{phase}</span>
      <div className={`relative w-24 h-1.5 rounded-sm overflow-hidden ${light ? "bg-cream/15" : "bg-navy/15"}`}>
        <div
          className={`absolute inset-y-0 left-0 transition-[width] duration-150 ${light ? "bg-silver-pale" : "bg-silver"}`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}
