"use client";

import { useState } from "react";
import { wedding } from "@/lib/config";
import { FloralDivider, PaperPlane } from "@/components/Decor";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section">
      <div className="section-title">
        <p className="section-eyebrow">Pre-flight briefing</p>
        <h2 className="section-heading">Travel Info</h2>
        <FloralDivider className="mt-6" />
        <p className="mt-6 font-mono uppercase tracking-[0.3em] text-[9px] text-cream/60">
          Safety card · Please read before boarding
        </p>
      </div>

      {/* Safety information card */}
      <div className="max-w-4xl mx-auto relative rounded-2xl border-2 border-dashed border-navy/25 bg-cream shadow-[0_40px_80px_-40px_rgba(28,41,64,0.4)] overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-6 sm:px-8 py-4 bg-navy-deep text-cream">
          <div className="flex items-center gap-3">
            <PaperPlane className="w-4 h-4 text-silver" />
            <span className="font-sans uppercase tracking-[0.3em] text-[10px]">Safety information card</span>
          </div>
          <span className="font-mono uppercase tracking-[0.25em] text-[9px] text-cream/90">
            {wedding.flightNumber} · {wedding.faq.length} items
          </span>
        </div>

        <ol className="divide-y divide-navy/10">
          {wedding.faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={i} className={`relative transition-colors duration-300 ${isOpen ? "bg-sand/40" : "hover:bg-sand/20"}`}>
                {/* Silver marker on the open item */}
                <span
                  aria-hidden
                  className={`absolute left-0 top-0 h-full w-1 bg-sky transition-transform duration-500 ease-out-expo origin-top ${
                    isOpen ? "scale-y-100" : "scale-y-0"
                  }`}
                />
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full grid grid-cols-[auto_1fr_auto] items-start gap-5 sm:gap-8 px-6 sm:px-8 py-6 sm:py-7 text-left"
                >
                  <span className="font-mono text-2xl sm:text-3xl text-navy-deep leading-none pt-1 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl text-navy leading-tight">{item.q}</span>
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full border border-navy/25 text-navy transition-[transform,background-color,color] duration-500 ease-out-expo ${
                      isOpen ? "rotate-45 bg-navy-deep text-cream border-navy-deep" : ""
                    }`}
                    aria-hidden
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-serif text-lg sm:text-xl text-navy/80 leading-relaxed px-6 sm:px-8 pb-7 sm:pl-[calc(2rem+3.5rem+2rem)] sm:pr-24">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="perforation text-navy/20 mx-6 sm:mx-8" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-8 py-6">
          <p className="font-serif italic text-navy/70 text-lg">
            Still have a question? Call the cabin crew.
          </p>
          <a
            href={`mailto:${wedding.contact.email}`}
            className="btn-motion inline-flex items-center justify-center gap-2 font-sans uppercase tracking-[0.3em] text-[10px] px-6 py-3.5 bg-navy-deep text-cream rounded-full hover:bg-silver hover:text-navy"
          >
            <PaperPlane className="w-3.5 h-3.5" />
            Message {wedding.groomFirst} &amp; {wedding.brideFirst}
          </a>
        </div>
      </div>
    </section>
  );
}
