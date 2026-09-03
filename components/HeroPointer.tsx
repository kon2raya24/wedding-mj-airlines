"use client";

import { useEffect } from "react";

// Pointer parallax for the hero: the film drifts against the cursor and the
// type drifts with it, so the opening screen has depth before anyone
// scrolls. Writes --px/--py (-1..1) on #top; the layers read them in CSS
// (.hero-pointer-bg / .hero-pointer-fg). Desktop pointers only.
export default function HeroPointer() {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }
    const hero = document.getElementById("top");
    if (!hero) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const onMove = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth) * 2 - 1;
      py = (e.clientY / window.innerHeight) * 2 - 1;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        hero.style.setProperty("--px", px.toFixed(3));
        hero.style.setProperty("--py", py.toFixed(3));
      });
    };
    const onLeave = () => {
      hero.style.setProperty("--px", "0");
      hero.style.setProperty("--py", "0");
    };
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
