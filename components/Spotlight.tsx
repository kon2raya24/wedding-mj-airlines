"use client";

import { useEffect } from "react";

// Pointer-tracked light on every glass surface: as the cursor crosses a
// card, a soft spot follows it (see .glass::before in globals.css). One
// delegated listener for the whole page; nothing on touch or reduced motion.
export default function Spotlight() {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>(".glass");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--sx", `${e.clientX - r.left}px`);
      el.style.setProperty("--sy", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}
