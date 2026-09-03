"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/config";
import { FloralDivider, PaperPlane } from "@/components/Decor";
import { SplitFlapText, useInView } from "@/components/SplitFlap";

const gates = ["A1", "A2", "B3", "B4", "C5", "C6", "D7"];
const statuses = ["BOARDING", "ON TIME", "ON TIME", "ON TIME", "ON TIME", "FINAL CALL", "DEPARTED"];

// Live clock in the venue's time zone, colon blinking like a hall display.
function BoardClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return <span className="tabular-nums">--:--:--</span>;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "--";
  const blink = now.getSeconds() % 2 === 0;
  return (
    <span className="tabular-nums">
      {get("hour")}
      <span className={blink ? "opacity-100" : "opacity-30"}>:</span>
      {get("minute")}
      <span className={blink ? "opacity-100" : "opacity-30"}>:</span>
      {get("second")}
      <span className="ml-2 text-[9px] text-cream/60">MNL</span>
    </span>
  );
}

function Remark({ status }: { status: string }) {
  const tone =
    status === "BOARDING"
      ? { dot: "bg-silver animate-pulse", text: "text-silver" }
      : status === "FINAL CALL"
      ? { dot: "bg-rouge animate-pulse", text: "text-[#e8a090]" }
      : status === "DEPARTED"
      ? { dot: "bg-cream/30", text: "text-cream/60" }
      : { dot: "bg-sky", text: "text-cream" };
  return (
    <span className={`inline-flex items-center justify-end gap-2 ${tone.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${tone.dot} motion-reduce:animate-none`} />
      <span className="truncate">{status}</span>
    </span>
  );
}

export default function Schedule() {
  const { ref, inView } = useInView<HTMLDivElement>();
  // Every few seconds one random row re-flaps, like a board catching up.
  const [pulses, setPulses] = useState<number[]>(() => wedding.schedule.map(() => 0));
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      const i = Math.floor(Math.random() * wedding.schedule.length);
      setPulses((p) => p.map((v, idx) => (idx === i ? v + 1 : v)));
    }, 7000);
    return () => clearInterval(id);
  }, [inView]);

  const cols =
    "grid-cols-[68px_1fr_96px] sm:grid-cols-[76px_92px_1fr_72px_120px] md:grid-cols-[110px_120px_1fr_96px_170px]";

  return (
    <section id="schedule" className="relative overflow-hidden text-cream border-y border-silver/20">
      {/* Hall: vignette + faint perspective grid so the board sits on a wall */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(246,239,224,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(246,239,224,0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,rgba(131,152,183,0.25),transparent_70%)]" />

      <div className="section relative">
        <div className="section-title">
          <p className="section-eyebrow">Departure Board · Terminal {wedding.seat.replace(/\D/g, "")}</p>
          <h2 className="section-heading !text-cream">The day, by the hour</h2>
          <FloralDivider className="mt-6" />
          <p className="max-w-xl mx-auto font-serif italic text-cream/70 text-lg mt-6">
            All times local. Please be seated ten minutes before the ceremony.
          </p>
        </div>

        {/* The board — bezel, glass, flaps */}
        <div ref={ref} className="relative mx-auto max-w-6xl">
          <div className="absolute -inset-x-3 -inset-y-3 sm:-inset-x-5 sm:-inset-y-5 rounded-[1.5rem] bg-black/40 ring-1 ring-cream/10 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.8)]" aria-hidden />
          <div className="relative rounded-xl overflow-hidden bg-[#0d1420] ring-1 ring-cream/10">
            {/* Glass sheen + a light band that sweeps the board */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.06),transparent_35%,transparent_65%,rgba(255,255,255,0.03))] z-10" />
            <div aria-hidden className="board-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent z-10" />

            {/* Header */}
            <div className="relative flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-b border-cream/10">
              <div className="flex items-center gap-4">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-rouge/70 animate-ping motion-reduce:hidden" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rouge" />
                </span>
                <span className="font-serif font-semibold uppercase tracking-[0.08em] text-2xl sm:text-3xl md:text-4xl leading-none">
                  Departures
                </span>
                <span className="hidden md:inline font-mono uppercase tracking-[0.3em] text-[10px] text-silver ml-2">
                  {wedding.brand} · Live
                </span>
              </div>
              <div className="flex items-center gap-4 sm:gap-8 font-mono text-[11px] sm:text-sm tracking-[0.15em] text-cream/85">
                <span className="hidden sm:inline text-cream/60">{wedding.shortDateCompact}</span>
                <BoardClock />
              </div>
            </div>

            {/* Column header */}
            <div className={`grid ${cols} gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-2.5 font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-silver/90 bg-black/30 border-b border-cream/10`}>
              <span>Time</span>
              <span className="hidden sm:inline">Flight</span>
              <span>Event</span>
              <span className="hidden sm:inline text-center">Gate</span>
              <span className="text-right">Remarks</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-cream/[0.07]">
              {wedding.schedule.map((s, i) => {
                const time = s.time.replace(/\s?(AM|PM)/i, "").padStart(5, "0");
                const event = (s.title + " · " + s.note).toUpperCase().slice(0, 30);
                // Phones only have room for the event name.
                const eventShort = s.title.toUpperCase().slice(0, 13);
                const status = statuses[i % statuses.length];
                const flight = `${wedding.flightNumber}-${String(i + 1).padStart(2, "0")}`;
                return (
                  <div
                    key={`${i}-${pulses[i]}`}
                    className={`group grid ${cols} gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-3.5 sm:py-4 items-center transition-colors hover:bg-cream/[0.04] ${
                      status === "BOARDING" ? "bg-silver/[0.06]" : ""
                    }`}
                  >
                    <div className="text-[12px] sm:text-[15px] md:text-[19px]">
                      <SplitFlapText text={time} trigger={inView} />
                    </div>
                    <div className="hidden sm:block text-[11px] md:text-[14px] text-cream/80">
                      <SplitFlapText text={flight} trigger={inView} />
                    </div>
                    <div className="text-[10px] sm:text-[11px] md:text-[14px] truncate min-w-0">
                      <span className="sm:hidden"><SplitFlapText text={eventShort} trigger={inView} /></span>
                      <span className="hidden sm:inline"><SplitFlapText text={event} trigger={inView} /></span>
                    </div>
                    <div className="hidden sm:block text-center text-[11px] md:text-[14px]">
                      <SplitFlapText text={gates[i % gates.length]} trigger={inView} />
                    </div>
                    <div className="text-right text-[10px] sm:text-[11px] md:text-[13px] font-mono uppercase tracking-[0.2em] min-w-0">
                      <Remark status={status} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="relative flex items-center justify-between gap-3 px-4 sm:px-6 md:px-8 py-3 bg-black/30 border-t border-cream/10 font-mono uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[9px] sm:text-[10px] text-cream/60">
              <span className="flex items-center gap-2">
                <PaperPlane className="w-3.5 h-3.5 text-silver" />
                FLT {wedding.flightNumber}
              </span>
              <span className="hidden md:inline">
                Pilot in command · {wedding.groomFirst[0]}. {wedding.groomLast} · First officer · {wedding.brideFirst[0]}. {wedding.brideLast}
              </span>
              <span>{wedding.destinationVenue} · GMT+8</span>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center font-mono uppercase tracking-[0.3em] text-[9px] text-cream/60">
          Board updates automatically · Times are subject to the captain&apos;s discretion
        </p>
      </div>
    </section>
  );
}
