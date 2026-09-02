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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-out ${
        scrolled || open
          ? "bg-navy-deep backdrop-blur-md border-b border-cream/10"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-4">
        <a
          href="#top"
          className="flex items-center gap-3 shrink-0 text-cream"
        >
          <MJLogo className="w-12 h-7 sm:w-14 sm:h-8 text-cream" />
          <span className="hidden sm:block font-sans uppercase tracking-[0.3em] text-[9px] text-cream/70 leading-tight border-l border-cream/30 pl-3">
            Flight to
            <br />
            Forever
          </span>
        </a>

        <ul className="hidden xl:flex items-center gap-7 text-[11px] font-sans uppercase tracking-[0.25em] text-cream/85">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative py-2 hover:text-gold transition-colors after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#checkin"
          className="hidden md:inline-flex items-center gap-2 font-sans uppercase tracking-[0.3em] text-[10px] px-5 py-2.5 border border-cream/50 text-cream rounded-sm hover:bg-cream hover:text-navy-deep transition-colors shrink-0"
        >
          <PaperPlane className="w-3.5 h-3.5" />
          Check-in
        </a>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="xl:hidden flex flex-col gap-1.5 p-2 text-cream"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block h-0.5 w-6 bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-current transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`block h-0.5 w-6 bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {open && (
        <div className="xl:hidden bg-navy-deep border-t border-cream/10 max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-5rem)] overflow-y-auto">
          <ul className="flex flex-col px-6 py-4 gap-2 font-sans uppercase tracking-[0.3em] text-[11px] text-cream">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2 md:hidden">
              <a
                href="#checkin"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-cream/50 rounded-sm hover:bg-cream hover:text-navy-deep transition-colors"
              >
                <PaperPlane className="w-3.5 h-3.5" />
                Check-in
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
