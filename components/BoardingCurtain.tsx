"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/config";
import { MJLogo } from "@/components/Decor";

export const BOARDED_COOKIE = "jm-boarded";
const LINGER_MS = 1500;
const EXIT_MS = 950;

// A short "now boarding" curtain on a guest's first visit of the session.
// The server decides `active` from a session cookie, so the very first paint
// is already the curtain (no flash) and returning visitors never see it.
// While it's up, globals.css holds the hero's entrance animation via
// `html:has(.boarding-curtain[data-active])`, releasing it as the curtain lifts.
export default function BoardingCurtain({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<"idle" | "shown" | "exit" | "done">(
    active ? "shown" : "done",
  );

  // One timer per phase: shown → exit → done. (A single effect owning both
  // timers would have its cleanup cancel the second one when `phase` changes.)
  useEffect(() => {
    const finish = () => {
      setPhase("done");
      document.cookie = `${BOARDED_COOKIE}=1; path=/; SameSite=Lax`;
    };
    if (phase === "shown") {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finish();
        return;
      }
      const lift = setTimeout(() => setPhase("exit"), LINGER_MS);
      return () => clearTimeout(lift);
    }
    if (phase === "exit") {
      const done = setTimeout(finish, EXIT_MS);
      return () => clearTimeout(done);
    }
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className="boarding-curtain fixed inset-0 z-[90] bg-navy text-cream place-items-center"
      data-active=""
      data-exit={phase === "exit" ? "" : undefined}
      aria-hidden
    >
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        <MJLogo className="boarding-logo w-20 h-12 text-cream" />
        <div className="boarding-copy font-sans uppercase tracking-[0.4em] text-[10px] text-cream/70">
          {wedding.brand} · Now boarding
        </div>
        <div className="boarding-copy font-script text-3xl sm:text-4xl text-cream">
          flight {wedding.flightNumber.toLowerCase()} to forever
        </div>
        <div className="relative h-px w-40 bg-cream/15 overflow-hidden">
          <span className="boarding-bar absolute inset-y-0 left-0 w-full bg-silver origin-left" />
        </div>
      </div>
    </div>
  );
}
