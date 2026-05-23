"use client";

import { useMemo } from "react";
import { PaperPlane } from "@/components/Decor";

const COUNT = 8;

export default function Petals() {
  const planes = useMemo(
    () =>
      Array.from({ length: COUNT }).map((_, i) => {
        const top = 5 + Math.random() * 80;
        const size = 22 + Math.random() * 28;
        const duration = 22 + Math.random() * 18;
        const delay = -Math.random() * duration;
        const tilt = -6 + Math.random() * 12;
        const palette = i % 2 === 0 ? "#c89b3c" : "#0e2a47";
        const opacity = 0.4 + Math.random() * 0.45;
        return { top, size, duration, delay, tilt, palette, opacity, key: i };
      }),
    []
  );

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      >
        {planes.map((p) => (
          <span
            key={p.key}
            className="absolute -left-24 animate-plane-fly"
            style={{
              top: `${p.top}vh`,
              color: p.palette,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              ["--tilt" as string]: `${p.tilt}deg`,
            }}
          >
            <PaperPlane
              className="drop-shadow-[0_2px_4px_rgba(14,42,71,0.18)]"
              style={{ width: p.size, height: p.size }}
            />
          </span>
        ))}
      </div>
      <style>{`
        @keyframes plane-fly {
          0% {
            transform: translate3d(0, 0, 0) rotate(var(--tilt));
            opacity: 0;
          }
          8% { opacity: 1; }
          50% {
            transform: translate3d(50vw, -3vh, 0) rotate(calc(var(--tilt) + 2deg));
          }
          92% { opacity: 1; }
          100% {
            transform: translate3d(120vw, 4vh, 0) rotate(calc(var(--tilt) - 4deg));
            opacity: 0;
          }
        }
        .animate-plane-fly {
          animation-name: plane-fly;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-plane-fly { animation: none; opacity: 0; }
        }
      `}</style>
    </>
  );
}
