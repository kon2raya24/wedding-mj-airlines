"use client";

import { useEffect, useRef, useState } from "react";
import { PaperPlane, ItineraryIcon, PinIcon, UsersIcon } from "@/components/Decor";

// Floating bottom dock — the four places a guest actually needs. Slides in
// once the hero is behind them; a pill of light glides to the section in
// view. Anchors go through Lenis like every other in-page link.
const stops = [
  { href: "#top", label: "Board", Icon: PaperPlane },
  { href: "#story", label: "Journey", Icon: ItineraryIcon },
  { href: "#details", label: "Venue", Icon: PinIcon },
  { href: "#rsvp", label: "RSVP", Icon: UsersIcon },
];

export default function Dock() {
  const [active, setActive] = useState("#top");
  const [shown, setShown] = useState(false);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Show after the first screen; hide again right at the top.
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: the last stop whose section top has crossed the middle of
  // the viewport wins, so the pill never lags a section behind.
  useEffect(() => {
    const targets = stops
      .map((s) => document.querySelector<HTMLElement>(s.href))
      .filter((el): el is HTMLElement => !!el);
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const mid = window.innerHeight / 2;
        let current = stops[0].href;
        for (const el of targets) {
          if (el.getBoundingClientRect().top <= mid) current = `#${el.id}`;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Measure the active link so the highlight can glide to it.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const el = list.querySelector<HTMLElement>(`[data-href="${active}"]`);
      if (el) setPill({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <nav
      aria-label="Quick navigation"
      className={`fixed bottom-5 sm:bottom-6 left-1/2 z-40 -translate-x-1/2 transition-[transform,opacity] duration-700 ease-out-expo ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      <div
        ref={listRef}
        className="dock relative flex items-center gap-1 rounded-[14px] p-1.5"
      >
        {pill && (
          <span
            aria-hidden
            className="dock-pill absolute top-1.5 bottom-1.5 rounded-[10px] bg-cream/[0.12] ring-1 ring-cream/10 transition-[transform,width] duration-500 ease-out-expo"
            style={{ transform: `translateX(${pill.x}px)`, width: pill.w, left: 0 }}
          >
            <span className="absolute -top-1.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-silver shadow-[0_0_8px_rgba(185,190,198,0.8)]" />
          </span>
        )}
        {stops.map(({ href, label, Icon }) => {
          const on = active === href;
          return (
            <a
              key={href}
              href={href}
              data-href={href}
              aria-current={on ? "location" : undefined}
              className={`relative z-10 inline-flex items-center gap-2 rounded-[10px] px-3 sm:px-4 py-3 font-sans text-[11px] sm:text-[12px] font-semibold tracking-[0.08em] transition-colors duration-300 ${
                on ? "text-cream" : "text-cream/70 hover:text-cream"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 shrink-0 transition-colors duration-300 ${on ? "text-silver" : "text-cream/60"}`} />
              <span>{label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
