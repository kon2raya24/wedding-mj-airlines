"use client";

import { useEffect, useRef, useState } from "react";

const TRAIL_LEN = 16;

export default function CursorPlane() {
  const [enabled, setEnabled] = useState(false);
  const planeRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // Stored positions (no React state in the loop)
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const trail = useRef<Array<{ x: number; y: number }>>(
    Array.from({ length: TRAIL_LEN }, () => ({ x: -100, y: -100 }))
  );
  const prev = useRef({ x: -100, y: -100 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || reduce) return;
    setEnabled(true);

    function onMove(e: MouseEvent) {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    }
    window.addEventListener("mousemove", onMove, { passive: true });

    function tick() {
      // Smooth lerp toward target
      const lerp = 0.18;
      current.current.x += (target.current.x - current.current.x) * lerp;
      current.current.y += (target.current.y - current.current.y) * lerp;

      const dx = current.current.x - prev.current.x;
      const dy = current.current.y - prev.current.y;
      prev.current.x = current.current.x;
      prev.current.y = current.current.y;

      // Rotate slightly with movement direction
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const plane = planeRef.current;
      if (plane) {
        plane.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%) rotate(${angle}deg)`;
      }

      // Shift trail buffer (newest first)
      trail.current.pop();
      trail.current.unshift({ x: current.current.x, y: current.current.y });

      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = trail.current[i];
        if (!p) return;
        const t = i / TRAIL_LEN;
        const scale = 1 - t * 0.6;
        const op = 1 - t;
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(op * 0.55);
      });

      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 hidden md:block" aria-hidden>
      {/* Dotted trail */}
      {Array.from({ length: TRAIL_LEN }).map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-gold"
        />
      ))}

      {/* The paper plane */}
      <div
        ref={planeRef}
        className="absolute top-0 left-0 will-change-transform"
        style={{ transition: "filter 0.2s" }}
      >
        <svg viewBox="0 0 32 32" className="w-7 h-7 drop-shadow-[0_2px_4px_rgba(14,42,71,0.45)]">
          <path
            d="M1 16 L31 2 L20 30 L15 19 L1 16 Z"
            fill="#c89b3c"
            stroke="#0e2a47"
            strokeWidth="1"
          />
          <path d="M15 19 L31 2" stroke="#0e2a47" strokeWidth="0.8" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
}
