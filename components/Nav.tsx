"use client";

import { useEffect, useState } from "react";
import { PaperPlane } from "@/components/Decor";
import AltitudeMeter from "@/components/AltitudeMeter";

const links = [
  { href: "#story", label: "Log" },
  { href: "#details", label: "Stops" },
  { href: "#schedule", label: "Board" },
  { href: "#party", label: "Crew" },
  { href: "#gallery", label: "Postcards" },
  { href: "#travel", label: "Stay" },
  { href: "#registry", label: "Souvenirs" },
  { href: "#faq", label: "Info" },
  { href: "#rsvp", label: "RSVP" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/95 backdrop-blur shadow-sm border-b border-navy/10" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between gap-4">
        <a
          href="#top"
          className={`flex items-center gap-2 font-sans uppercase tracking-[0.35em] text-[11px] shrink-0 ${scrolled ? "text-navy" : "text-cream"}`}
        >
          <PaperPlane className="w-5 h-5 text-gold" />
          <span>M &amp; J</span>
        </a>

        <AltitudeMeter light={!scrolled} />

        <ul className={`hidden lg:flex items-center gap-5 text-[10px] font-sans uppercase tracking-[0.3em] ${scrolled ? "text-navy/80" : "text-cream/85"}`}>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-gold transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block h-0.5 w-6 transition-transform ${scrolled ? "bg-navy" : "bg-cream"} ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 transition-opacity ${scrolled ? "bg-navy" : "bg-cream"} ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`block h-0.5 w-6 transition-transform ${scrolled ? "bg-navy" : "bg-cream"} ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-cream/98 border-t border-gold/30">
          <ul className="flex flex-col px-6 py-4 gap-3 font-sans uppercase tracking-[0.3em] text-[11px] text-navy">
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
          </ul>
        </div>
      )}
    </header>
  );
}
