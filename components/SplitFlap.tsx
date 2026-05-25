"use client";

import { useEffect, useRef, useState } from "react";

const ALPHA = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-·:&/".split("");

function indexOf(ch: string) {
  const i = ALPHA.indexOf(ch.toUpperCase());
  return i < 0 ? 0 : i;
}

export function SplitFlapText({
  text,
  trigger = true,
  width,
  className = "",
}: {
  text: string;
  trigger?: boolean;
  width?: number;
  className?: string;
}) {
  const chars = [...text.toUpperCase()];
  const target = width ? chars.slice(0, width).concat(new Array(Math.max(0, width - chars.length)).fill(" ")) : chars;

  return (
    <span className={`inline-flex gap-[2px] ${className}`}>
      {target.map((c, i) => (
        <SplitFlapChar key={i} target={c} delay={i * 70} trigger={trigger} />
      ))}
    </span>
  );
}

function SplitFlapChar({
  target,
  delay,
  trigger,
}: {
  target: string;
  delay: number;
  trigger: boolean;
}) {
  // Initialize with the resolved target so the panel renders the real value
  // on mount (no "▢▢▢▢" placeholder flash). When trigger fires we spin and
  // land back on the same value, so the flap animation still plays.
  const [idx, setIdx] = useState(() => indexOf(target));
  const settledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!trigger) return;
    const targetIdx = indexOf(target);

    settledRef.current = false;
    startTimer.current = setTimeout(() => {
      let current = 0;
      timerRef.current = setInterval(() => {
        current += 1;
        setIdx(current % ALPHA.length);
        // Stop when we naturally land on target after at least 8 spins
        if (current >= 8 && current % ALPHA.length === targetIdx) {
          if (timerRef.current) clearInterval(timerRef.current);
          settledRef.current = true;
          setIdx(targetIdx);
        }
        // Safety: stop after too many
        if (current > 60) {
          if (timerRef.current) clearInterval(timerRef.current);
          settledRef.current = true;
          setIdx(targetIdx);
        }
      }, 55);
    }, delay);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (startTimer.current) clearTimeout(startTimer.current);
    };
  }, [target, delay, trigger]);

  const ch = ALPHA[idx] || " ";
  return (
    <span
      className="relative inline-flex items-stretch justify-center w-[0.7em] h-[1.1em] bg-navy-deep text-cream rounded-[2px] overflow-hidden shadow-inner shadow-black/40"
      aria-hidden
    >
      <span className="absolute inset-x-0 top-1/2 h-px bg-black/70 z-10" />
      <span
        key={ch + idx}
        className="flap-anim w-full h-full grid place-items-center font-mono tabular-nums"
        style={{ animationDuration: "120ms" }}
      >
        {ch === " " ? " " : ch}
      </span>
      <style jsx>{`
        .flap-anim {
          animation-name: flap;
          animation-timing-function: cubic-bezier(0.3, 0, 0.2, 1);
          animation-fill-mode: forwards;
          transform-origin: center;
        }
        @keyframes flap {
          0% {
            transform: rotateX(90deg);
            opacity: 0;
          }
          100% {
            transform: rotateX(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
}

export function useInView<T extends HTMLElement>(margin = "0px 0px -80px 0px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return { ref, inView };
}
