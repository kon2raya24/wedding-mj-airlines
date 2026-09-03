"use client";

import { useEffect, useState } from "react";
import { MJLogo, PaperPlane } from "@/components/Decor";

const links = [
  { href: "#top", label: "Home" },
  { href: "#story", label: "Our Story" },
  { href: "#schedule", label: "Itinerary" },
  { href: "#details", label: "Destination" },
  { href: "#checkin", label: "Check-in" },
  { href: "#gallery", label: "Gallery" },
  { href: "#prenup", label: "Save the Date" },
  { href: "#attire", label: "Attire" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("#top");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    let lastY = window.scrollY;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(y > 40);
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
        // Tuck the bar away while reading down; bring it back on the first
        // upward nudge or near the top.
        const dy = y - lastY;
        if (y < 200 || dy < -6) setHidden(false);
        else if (dy > 6 && y > 400) setHidden(true);
        lastY = y;
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

  // Scroll-spy: the link whose section currently crosses the upper third
  // of the viewport is the active one. `#prenup` lives inside the hero,
  // so it's excluded from the spy and only ever highlighted on click.
  useEffect(() => {
    const targets = links
      .filter((l) => l.href !== "#prenup")
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = `#${e.target.id}`;
          if (e.isIntersecting) visible.set(id, e.boundingClientRect.top);
          else visible.delete(id);
        }
        if (visible.size === 0) return;
        // Of the intersecting sections, pick the one nearest the top edge.
        let best: string | null = null;
        let bestTop = Infinity;
        visible.forEach((top, id) => {
          const d = Math.abs(top);
          if (d < bestTop) {
            bestTop = d;
            best = id;
          }
        });
        if (best) setActive(best);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow,border-color,transform] duration-500 ease-out-expo border-b ${
        scrolled || open
          ? "bg-navy/80 backdrop-blur-xl border-cream/10 shadow-lg shadow-black/30"
          : "bg-transparent border-transparent"
      } ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
    >
      <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-4">
        <a
          href="#top"
          className="flex items-center gap-3 shrink-0 text-cream transition-opacity hover:opacity-80"
        >
          <MJLogo className="w-12 h-7 sm:w-14 sm:h-8 text-cream" />
          <span className="hidden sm:block font-sans uppercase tracking-[0.3em] text-[9px] text-cream/70 leading-tight border-l border-cream/30 pl-3">
            Flight to
            <br />
            Forever
          </span>
        </a>

        <ul className="hidden xl:flex items-center gap-7 text-[11px] font-sans uppercase tracking-[0.25em] text-cream/85">
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setActive(l.href)}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative py-2 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-silver after:transition-transform after:duration-500 after:ease-out-expo after:origin-left ${
                    isActive
                      ? "text-silver after:scale-x-100"
                      : "hover:text-silver after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href="#checkin"
          className="btn-motion hidden md:inline-flex items-center gap-2 font-sans uppercase tracking-[0.3em] text-[10px] px-5 py-2.5 border border-cream/50 text-cream rounded-sm hover:bg-cream hover:text-navy-deep hover:border-cream shrink-0"
        >
          <PaperPlane className="w-3.5 h-3.5" />
          Check-in
        </a>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="xl:hidden flex flex-col justify-center gap-1.5 p-3 -mr-3 text-cream"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block h-0.5 w-6 bg-current transition-transform duration-300 ease-out-expo ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`block h-0.5 w-6 bg-current transition-transform duration-300 ease-out-expo ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Reading progress — a silver hairline that fills as guests scroll. */}
      <div
        className="absolute bottom-0 left-0 h-px bg-silver/80 transition-[width,opacity] duration-150 ease-out"
        style={{ width: `${progress * 100}%`, opacity: scrolled ? 1 : 0 }}
        aria-hidden
      >
        <PaperPlane className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 text-silver drop-shadow-[0_0_4px_rgba(185,190,198,0.7)]" />
      </div>

      {/* Mobile drawer — always mounted so it can slide open and closed. */}
      <div
        id="mobile-menu"
        className={`xl:hidden grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <ul className="flex flex-col px-6 py-4 gap-1 font-sans uppercase tracking-[0.3em] text-[11px] text-cream border-t border-cream/10 max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-5rem)] overflow-y-auto">
            {links.map((l, i) => (
              <li
                key={l.href}
                className={`transition-[opacity,transform] duration-500 ease-out-expo ${
                  open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
                style={{ transitionDelay: open ? `${60 + i * 35}ms` : "0ms" }}
              >
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className={`flex items-center justify-between py-2.5 border-b border-cream/5 transition-colors hover:text-silver ${
                    active === l.href ? "text-silver" : ""
                  }`}
                >
                  {l.label}
                  <span className="font-mono text-[9px] text-cream/60">{String(i + 1).padStart(2, "0")}</span>
                </a>
              </li>
            ))}
            <li className="pt-4 pb-2 md:hidden">
              <a
                href="#checkin"
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="btn-motion inline-flex items-center gap-2 px-5 py-2.5 border border-cream/50 rounded-sm hover:bg-cream hover:text-navy-deep"
              >
                <PaperPlane className="w-3.5 h-3.5" />
                Check-in
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
