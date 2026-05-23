"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/config";
import { FloralDivider } from "@/components/Decor";
import Odometer from "@/components/Odometer";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diff(target: number): Parts {
  const total = Math.max(0, target - Date.now());
  const days = Math.floor(total / 86_400_000);
  const hours = Math.floor((total % 86_400_000) / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  const seconds = Math.floor((total % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

export default function Countdown() {
  const target = new Date(wedding.date).getTime();
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(diff(target));
    const id = setInterval(() => setParts(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const items: Array<{ label: string; value: number; pad: number }> = parts
    ? [
        { label: "Days", value: parts.days, pad: 3 },
        { label: "Hours", value: parts.hours, pad: 2 },
        { label: "Minutes", value: parts.minutes, pad: 2 },
        { label: "Seconds", value: parts.seconds, pad: 2 },
      ]
    : [
        { label: "Days", value: 0, pad: 3 },
        { label: "Hours", value: 0, pad: 2 },
        { label: "Minutes", value: 0, pad: 2 },
        { label: "Seconds", value: 0, pad: 2 },
      ];

  return (
    <section id="countdown" className="section">
      <div className="section-title">
        <p className="section-eyebrow">Estimated Time of Arrival</p>
        <h2 className="section-heading">Until take-off</h2>
        <FloralDivider className="mt-6" />
      </div>

      <div className="max-w-4xl mx-auto bg-navy text-cream rounded-md p-4 sm:p-6 md:p-10 shadow-2xl shadow-navy-deep/40 relative grain border border-cream/10">
        <div className="flex items-center justify-between gap-2 mb-5 sm:mb-6 font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-cream/60">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rouge animate-pulse" />
            LIVE
          </span>
          <span className="hidden sm:inline">FLIGHT MJ1212</span>
          <span>MNL → ∞</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {items.map((it) => (
            <div
              key={it.label}
              className="bg-navy-deep border border-cream/10 rounded text-center py-4 sm:py-6 px-2 sm:px-3 relative overflow-hidden"
            >
              <div className="font-mono text-4xl sm:text-6xl md:text-7xl text-gold leading-none">
                <Odometer value={it.value} pad={it.pad} />
              </div>
              <div className="font-sans uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[9px] sm:text-[10px] text-cream/60 mt-2 sm:mt-3">
                {it.label}
              </div>
              <div className="absolute inset-x-0 top-1/2 h-px bg-cream/5" />
            </div>
          ))}
        </div>

        <div className="mt-5 sm:mt-6 flex items-center justify-between gap-2 font-mono text-[9px] sm:text-[10px] tracking-widest text-cream/50">
          <span>SCHED · 14:00 PHT</span>
          <span>STATUS · ON-TIME</span>
        </div>
      </div>
    </section>
  );
}
