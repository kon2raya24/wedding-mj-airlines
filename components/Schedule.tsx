"use client";

import { wedding } from "@/lib/config";
import { FloralDivider } from "@/components/Decor";
import { SplitFlapText, useInView } from "@/components/SplitFlap";

const gates = ["A1", "A2", "B3", "B4", "C5", "C6", "D7"];
const statuses = ["BOARDING", "ON TIME", "ON TIME", "ON TIME", "ON TIME", "ON TIME", "FINAL CALL"];

export default function Schedule() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="schedule" className="section">
      <div className="section-title">
        <p className="section-eyebrow">Departure Board</p>
        <h2 className="section-heading">The day, by the hour</h2>
        <FloralDivider className="mt-6" />
      </div>

      <div
        ref={ref}
        className="max-w-5xl mx-auto bg-navy-deep text-cream rounded-sm overflow-hidden shadow-2xl shadow-navy-deep/40 border border-cream/10"
      >
        {/* Top header strip */}
        <div className="bg-black/40 px-3 sm:px-4 md:px-8 py-3 flex items-center justify-between gap-2 border-b border-cream/15 font-mono uppercase tracking-[0.18em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-gold">
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-2 w-2 rounded-full bg-rouge animate-pulse shrink-0" />
            <span className="truncate">
              <span className="hidden sm:inline">LIVE · MJ AIRLINES DEPARTURES</span>
              <span className="sm:hidden">LIVE · DEPARTURES</span>
            </span>
          </div>
          <span className="hidden md:inline">12 DEC 2026 · MNL</span>
          <span className="shrink-0">SCHED · {wedding.schedule.length}</span>
        </div>

        {/* Column header */}
        <div className="grid grid-cols-[56px_1fr_88px] sm:grid-cols-[80px_1fr_88px_120px] md:grid-cols-[110px_1fr_120px_160px] gap-2 sm:gap-3 px-3 sm:px-4 md:px-8 py-3 font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-gold border-b border-cream/15">
          <span>Time</span>
          <span>Event</span>
          <span className="hidden sm:inline text-center">Gate</span>
          <span className="text-right">Status</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-cream/10">
          {wedding.schedule.map((s, i) => {
            const time = s.time.replace(/\s?(AM|PM)/i, "").padStart(5, "0");
            const event = (s.title + " · " + s.note).toUpperCase().slice(0, 28);
            return (
              <div
                key={i}
                className="grid grid-cols-[56px_1fr_88px] sm:grid-cols-[80px_1fr_88px_120px] md:grid-cols-[110px_1fr_120px_160px] gap-2 sm:gap-3 px-3 sm:px-4 md:px-8 py-3 sm:py-4 items-center hover:bg-cream/5 transition-colors"
              >
                <div className="text-base md:text-xl">
                  <SplitFlapText text={time} trigger={inView} className="text-[12px] sm:text-[14px] md:text-[18px]" />
                </div>
                <div className="text-[10px] sm:text-[11px] md:text-[14px] truncate min-w-0">
                  <SplitFlapText text={event} trigger={inView} />
                </div>
                <div className="hidden sm:block text-center text-[11px] md:text-[14px]">
                  <SplitFlapText text={gates[i % gates.length]} trigger={inView} />
                </div>
                <div className="text-right text-[10px] sm:text-[11px] md:text-[14px] flex items-center justify-end gap-1.5 sm:gap-2 min-w-0">
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      statuses[i % statuses.length] === "BOARDING"
                        ? "bg-gold animate-pulse"
                        : statuses[i % statuses.length] === "FINAL CALL"
                        ? "bg-rouge animate-pulse"
                        : "bg-sky"
                    }`}
                  />
                  <span className="truncate">
                    <SplitFlapText text={statuses[i % statuses.length]} trigger={inView} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-black/40 px-3 sm:px-4 md:px-8 py-3 flex items-center justify-between gap-2 border-t border-cream/15 font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[9px] sm:text-[10px] text-cream/60">
          <span>FLT MJ1212</span>
          <span className="hidden md:inline">PILOT IN COMMAND · J. SANTOS</span>
          <span>SYS · OK</span>
        </div>
      </div>
    </section>
  );
}
