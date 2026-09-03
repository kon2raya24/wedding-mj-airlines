"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/config";
import { PaperPlane } from "@/components/Decor";
import Odometer from "@/components/Odometer";

type Parts = { days: number; hours: number; minutes: number; seconds: number; total: number };

function diff(target: number): Parts {
  const total = Math.max(0, target - Date.now());
  const days = Math.floor(total / 86_400_000);
  const hours = Math.floor((total % 86_400_000) / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  const seconds = Math.floor((total % 60_000) / 1000);
  return { days, hours, minutes, seconds, total };
}

// The runway shows the last year before departure: a plane creeps from
// "Today" to "Forever" as the days run down.
const RUNWAY_DAYS = 365;

export default function Countdown() {
  const target = new Date(wedding.date).getTime();
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(diff(target));
    const id = setInterval(() => setParts(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const items = [
    { label: "Days", value: parts?.days ?? 0, pad: parts && parts.days > 99 ? 3 : 2 },
    { label: "Hrs", value: parts?.hours ?? 0, pad: 2 },
    { label: "Mins", value: parts?.minutes ?? 0, pad: 2 },
    { label: "Secs", value: parts?.seconds ?? 0, pad: 2 },
  ];
  const progress = parts ? Math.min(1, Math.max(0, 1 - parts.total / (RUNWAY_DAYS * 86_400_000))) : 0;
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "Asia/Manila" }).format(target);

  return (
    <section
      id="countdown"
      className="relative h-full overflow-hidden rounded-md bg-[#0d1420] text-cream ring-1 ring-cream/10 shadow-2xl shadow-black/30"
      aria-live="off"
    >
      {/* Faint venue behind the glass */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.18]"
        style={{ backgroundImage: "url('/images/venue-aerial.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1420] via-[#0d1420]/70 to-navy-deep/40" aria-hidden />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.05),transparent_40%)]" />

      <div className="relative h-full flex flex-col p-6 sm:p-7 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 font-mono uppercase tracking-[0.3em] text-[9px] sm:text-[10px]">
          <span className="flex items-center gap-2 text-silver">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-silver/70 animate-ping motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-silver" />
            </span>
            Final boarding call
          </span>
          <span className="text-cream/60">Gate {wedding.gate}</span>
        </div>

        {/* Flap digits */}
        <div
          className={`mt-6 grid grid-cols-4 gap-3 sm:gap-4 transition-opacity duration-700 ${parts ? "opacity-100" : "opacity-0"}`}
        >
          {items.map((it) => (
            <div key={it.label} className="min-w-0">
              <Odometer
                value={it.value}
                pad={it.pad}
                className="gap-[3px] font-mono font-semibold text-[26px] sm:text-[32px] lg:text-[38px] text-cream"
                digitClassName="bg-[#161d2b] rounded-[4px] ring-1 ring-black/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.6)] after:content-[''] after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-black/70"
              />
              <div className="mt-2 font-sans uppercase tracking-[0.3em] text-[9px] sm:text-[10px] text-cream/60">
                {it.label}
              </div>
            </div>
          ))}
        </div>

        {/* Runway: Today → Forever */}
        <div className="mt-7">
          <div className="flex items-center justify-between font-mono uppercase tracking-[0.3em] text-[9px] text-cream/60">
            <span>{wedding.origin}</span>
            <span>Flight progress · {Math.round(progress * 100)}%</span>
            <span>{wedding.destination}</span>
          </div>
          <div className="relative mt-2 h-px bg-cream/15">
            <div
              className="absolute inset-y-0 left-0 bg-silver/80 transition-[width] duration-1000 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
            {/* runway lights */}
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                aria-hidden
                className="absolute top-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-cream/25"
                style={{ left: `${(i / 11) * 100}%` }}
              />
            ))}
            <PaperPlane
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 text-silver drop-shadow-[0_0_6px_rgba(185,190,198,0.8)] transition-[left] duration-1000 ease-out"
              style={{ left: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Departure details */}
        <div className="mt-auto pt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="font-mono uppercase tracking-[0.3em] text-[9px] text-cream/60">Departs</div>
            <div className="font-serif text-lg sm:text-xl leading-tight mt-1">
              {weekday} · {wedding.shortDateCompact} · {wedding.ceremonyTime}
            </div>
          </div>
          <p className="font-serif italic text-cream/70 text-sm sm:text-base">We can&apos;t wait to celebrate with you!</p>
        </div>
      </div>
    </section>
  );
}
