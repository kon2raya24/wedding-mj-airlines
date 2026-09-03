"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Inertia scrolling for pointer devices. Touch keeps native scrolling and
// reduced-motion users are left alone. Lenis drives the real window scroll
// position, so sticky elements, scroll-spy and CSS scroll-driven animations
// all keep working — they just glide.
export default function SmoothScroll() {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      anchors: { offset: -72 },
    });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
