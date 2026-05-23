"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/config";
import { PaperPlane } from "@/components/Decor";

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

  const items: Array<{ label: string; value: number }> = parts
    ? [
        { label: "Days", value: parts.days },
        { label: "Hrs", value: parts.hours },
        { label: "Mins", value: parts.minutes },
        { label: "Secs", value: parts.seconds },
      ]
    : [
        { label: "Days", value: 0 },
        { label: "Hrs", value: 0 },
        { label: "Mins", value: 0 },
        { label: "Secs", value: 0 },
      ];

  return (
    <section
      id="countdown"
      className="relative bg-cream rounded-md border border-navy/10 shadow-sm overflow-hidden h-full"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1600&q=85')",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/85 to-cream/20" aria-hidden />

      <div className="relative p-6 sm:p-8 lg:p-10 h-full flex flex-col">
        <div className="flex items-center gap-2 font-sans uppercase tracking-[0.3em] text-[11px] text-navy mb-6">
          Final Boarding Call
          <PaperPlane className="w-4 h-4 text-gold" />
        </div>

        <div className="grid grid-cols-4 gap-4 sm:gap-6 max-w-md">
          {items.map((it) => (
            <div key={it.label}>
              <div className="font-serif text-4xl sm:text-5xl md:text-6xl text-navy leading-none tabular-nums">
                {String(it.value).padStart(2, "0")}
              </div>
              <div className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/55 mt-2">
                {it.label}
              </div>
            </div>
          ))}
        </div>

        <p className="font-serif italic text-navy/75 text-base sm:text-lg mt-6 sm:mt-8">
          We can&apos;t wait to celebrate with you!
        </p>
      </div>
    </section>
  );
}
