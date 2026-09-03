"use client";

import { useEffect, useState } from "react";
import { PaperPlane } from "@/components/Decor";

const R = 22;
const CIRC = 2 * Math.PI * R;

// "Return to gate": appears once the hero has scrolled away, with a ring
// that fills as the guest reads down the page.
export default function BackToTop() {
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
        setShown(y > window.innerHeight * 0.9);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
      className={`group fixed bottom-6 right-6 z-40 h-14 w-14 glass rounded-full text-cream hidden md:grid place-items-center transition-[opacity,transform,background-color] duration-500 ease-out-expo hover:bg-white/10 ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <svg viewBox="0 0 52 52" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
        <circle cx="26" cy="26" r={R} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
        <circle
          cx="26"
          cy="26"
          r={R}
          fill="none"
          stroke="#b9bec6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - progress)}
          className="transition-[stroke-dashoffset] duration-150 ease-out"
        />
      </svg>
      <PaperPlane className="relative w-5 h-5 text-silver -rotate-45 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-0.5" />
      <span className="sr-only">Return to gate</span>
    </button>
  );
}
