"use client";

import { useEffect, useRef } from "react";

// Pulls its child gently toward the pointer while hovered, then springs
// back. Pointer devices only; reduced-motion users get a static element.
export default function Magnetic({
  children,
  className = "",
  strength = 0.28,
  max = 14,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const clamp = (v: number) => Math.max(-max, Math.min(max, v));
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transition = "transform 120ms ease-out";
      el.style.transform = `translate(${clamp(dx * strength)}px, ${clamp(dy * strength)}px)`;
    };
    const onLeave = () => {
      el.style.transition = "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.transform = "translate(0, 0)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, max]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
