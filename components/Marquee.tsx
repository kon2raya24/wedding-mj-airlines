"use client";

import { useEffect, useRef } from "react";
import { wedding } from "@/lib/config";
import { PaperPlane } from "@/components/Decor";

// A ribbon that reads scroll velocity: it drifts on its own, then speeds up
// and skews as the guest scrolls, settling back when they stop. Two
// identical groups make the loop seamless.
export default function Marquee() {
  const track = useRef<HTMLDivElement | null>(null);
  const group = useRef<HTMLDivElement | null>(null);
  const phrase = ` Flight ${wedding.flightNumber} · ${wedding.groomFirst} & ${wedding.brideFirst} · Departing ${wedding.shortDateCompact} · Here → Forever · ${wedding.hashtag} · Now Boarding · `;

  useEffect(() => {
    const el = track.current;
    const g = group.current;
    if (!el || !g) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.remove("marquee-css");

    let x = 0;
    let lastY = window.scrollY;
    let vel = 0;
    let raf = 0;
    const tick = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      vel += (dy - vel) * 0.12;
      const speed = 0.7 + Math.min(Math.abs(vel) * 0.3, 7);
      x -= speed;
      const half = g.offsetWidth;
      if (half > 0 && x <= -half) x += half;
      const skew = Math.max(-10, Math.min(10, -vel * 0.18));
      el.style.transform = `translate3d(${x}px, 0, 0) skewX(${skew}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="glass text-cream py-5 overflow-hidden border-y border-silver/25 !rounded-none">
      <div ref={track} className="marquee-css flex w-max whitespace-nowrap will-change-transform">
        {[0, 1].map((i) => (
          <div key={i} ref={i === 0 ? group : undefined} className="flex shrink-0 gap-10 pr-10" aria-hidden={i === 1}>
            {Array.from({ length: 3 }).map((_, j) => (
              <span
                key={j}
                className="font-sans uppercase tracking-[0.25em] sm:tracking-[0.4em] text-xs sm:text-sm md:text-base shrink-0 flex items-center gap-6 sm:gap-8"
              >
                {phrase}
                <PaperPlane className="w-5 h-5 text-silver shrink-0" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
