"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/config";
import { MJLogo } from "@/components/Decor";
import { lockScroll } from "@/lib/scroll-lock";

const SHADE_MS = 750;
const ZOOM_MS = 1300;

// Opening the link lands a guest in the cabin with the window shade still
// down: an invitation that has not been opened yet. Clicking the window lifts
// the shade, then the frame rushes past the camera and leaves them on the
// check-in form behind it.
//
// It is a real link, not a button: without JavaScript the click still works
// because `openHref` renders the same page with the cover suppressed
// server-side. With JavaScript we intercept it and play the animation
// instead, so nothing has to navigate. That also means there is no timed
// failsafe here — an unopened invitation waits as long as the guest likes.
export default function Porthole({
  active,
  openHref,
}: {
  active: boolean;
  openHref: string;
}) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "zoom" | "done">(
    active ? "sealed" : "done",
  );

  // One timer per phase: opening → zoom → done. (A single effect owning both
  // timers would have its cleanup cancel the second one when `phase` changes.)
  useEffect(() => {
    if (phase === "opening") {
      const push = setTimeout(() => setPhase("zoom"), SHADE_MS);
      return () => clearTimeout(push);
    }
    if (phase === "zoom") {
      const done = setTimeout(() => setPhase("done"), ZOOM_MS);
      return () => clearTimeout(done);
    }
  }, [phase]);

  // Hold the page while the cover is up, and release the form's entrance
  // animation as the push-in starts. Applied from the client, so a guest
  // whose JS never runs is never locked.
  useEffect(() => {
    if (phase === "done") return;
    const root = document.documentElement;
    const release = lockScroll();
    root.classList.add("porthole-active");
    root.classList.toggle("porthole-zooming", phase === "zoom");
    return () => {
      release();
      root.classList.remove("porthole-active", "porthole-zooming");
    };
  }, [phase]);

  function open(e: React.MouseEvent) {
    if (phase !== "sealed") return;
    // The href is the no-JS fallback; here we animate in place instead.
    e.preventDefault();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }
    setPhase("opening");
  }

  if (phase === "done") return null;

  return (
    <div
      className="porthole-intro fixed inset-0 z-[90] grid place-items-center"
      data-active=""
      data-open={phase === "sealed" ? undefined : ""}
      data-zoom={phase === "zoom" ? "" : undefined}
    >
      {/* One centred column: who it is from, the window, how to open it. The
          copy needs a z-index because the cabin wall is the window's own
          box-shadow and would otherwise paint over it. */}
      <div className="flex flex-col items-center gap-7 sm:gap-9 px-6 text-center">
        <div className="porthole-copy relative z-10">
          <p className="font-sans uppercase tracking-[0.4em] text-[10px] text-navy/60">
            You have an invitation
          </p>
          <p className="mt-5 font-script text-lg text-navy/50 leading-none">from</p>
          <p className="mt-4 font-script text-4xl sm:text-5xl text-navy leading-[1.25]">
            {wedding.groomFirst}
            <br />
            &amp; {wedding.brideFirst}
          </p>
        </div>

        {/* The porthole. Its own 60vmax box-shadow is the cabin wall, so
            scaling the window is what pushes the wall past the edges. */}
        <a
          href={openHref}
          onClick={open}
          className="porthole-open"
          aria-label={`Open your invitation from ${wedding.groomFirst} and ${wedding.brideFirst}`}
        >
          <span className="porthole">
            <span className="porthole-glass" />
            <span className="porthole-shade">
              <MJLogo className="porthole-seal" />
              <span className="porthole-tab" />
            </span>
          </span>
        </a>

        <p className="porthole-copy relative z-10 font-sans uppercase tracking-[0.35em] text-[10px] text-navy/60">
          Click the window to open
        </p>
      </div>
    </div>
  );
}
