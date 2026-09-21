"use client";

import { useEffect, useState } from "react";

const MAX_ALT = 36000;

// One flight profile drives both the phase label and the altitude, so the two
// can never disagree the way they used to (the number climbed straight through
// to 36,000 ft while the label already read ARRIVAL). Each leg interpolates
// from `from` to `to` over the scroll range that ends at `until`, so the
// descent runs out over the closing sections and touches down at 0 ft exactly
// at the foot of the page — where the cabin window closes (.descent).
const PROFILE = [
  { until: 0.05, label: "BOARDING", from: 0, to: 0 },
  { until: 0.15, label: "TAXI", from: 0, to: 0 },
  { until: 0.3, label: "ASCENT", from: 0, to: MAX_ALT },
  { until: 0.85, label: "CRUISING", from: MAX_ALT, to: MAX_ALT },
  { until: 0.95, label: "DESCENT", from: MAX_ALT, to: 4000 },
  { until: 1, label: "ARRIVAL", from: 4000, to: 0 },
];

function readout(pct: number) {
  const found = PROFILE.findIndex((leg) => pct < leg.until);
  const i = found === -1 ? PROFILE.length - 1 : found;
  const leg = PROFILE[i];
  const start = i === 0 ? 0 : PROFILE[i - 1].until;
  const t = Math.min(1, Math.max(0, (pct - start) / (leg.until - start)));
  const alt = leg.from + (leg.to - leg.from) * t;
  return { label: leg.label, altitude: Math.round(alt / 100) * 100 };
}

export default function AltitudeMeter({ light = false }: { light?: boolean }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let frame = 0;
    function measure() {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    }
    // Scroll fires far more often than this can repaint — and Lenis emits one
    // event per animation frame of its own inertia — so coalesce to a single
    // measurement per frame instead of a render per event.
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(measure);
    }
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const { label: phase, altitude } = readout(pct);

  return (
    <div className={`hidden md:flex items-center gap-3 font-mono uppercase tracking-[0.25em] text-[10px] ${light ? "text-cream/80" : "text-navy/80"}`}>
      <span className={light ? "text-silver-pale" : "text-silver"}>
        {phase === "DESCENT" ? "▼" : "●"}
      </span>
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
