"use client";

import { useState } from "react";
import { wedding } from "@/lib/config";
import { FloralDivider } from "@/components/Decor";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section">
      <div className="section-title">
        <p className="section-eyebrow">Pre-flight briefing</p>
        <h2 className="section-heading">Travel Info</h2>
        <FloralDivider className="mt-6" />
      </div>

      <div className="max-w-2xl mx-auto">
        {wedding.faq.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={`group relative my-3 rounded-sm border transition-all duration-300 ${
                isOpen
                  ? "border-gold bg-cream shadow-md"
                  : "border-navy/20 bg-cream/60 hover:border-gold/60"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-3 sm:gap-4 py-4 sm:py-5 px-4 sm:px-6 text-left"
              >
                <span className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <span className="font-mono text-sm sm:text-base text-gold shrink-0 tracking-widest">
                    Q.{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-base sm:text-lg md:text-xl text-navy">{item.q}</span>
                </span>
                <span
                  className={`text-gold text-3xl transition-transform shrink-0 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="font-serif text-sm sm:text-base text-navy/80 leading-relaxed px-4 sm:px-6 pb-5 sm:pb-6 sm:pl-[88px] sm:pr-12">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
