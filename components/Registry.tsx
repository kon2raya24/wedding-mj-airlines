"use client";

import { useState } from "react";
import { wedding } from "@/lib/config";
import { FloralDivider, PaperPlane } from "@/components/Decor";
import Reveal from "@/components/Reveal";
import QR from "@/components/QRCode";

type Gift = (typeof wedding.registry)[number];

// One colour strip per tag so the three read as a set, not triplets.
const STRIPS = [
  "bg-navy-deep text-cream",
  "bg-silver text-navy",
  "bg-sky text-navy",
];
const TILTS = [-3, 2, -2];

function GiftTag({ gift, index }: { gift: Gift; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const tilt = TILTS[index % TILTS.length];

  return (
    <div className="relative pt-16">
      {/* String + ring hanging from the belt rail above */}
      <span aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-cream/50 bg-navy" />
      <span aria-hidden className="absolute top-4 left-1/2 -translate-x-1/2 h-12 w-px bg-cream/40" />

      <div
        className="tag-swing [perspective:1200px]"
        style={{ ["--tilt" as string]: `${tilt}deg`, transform: `rotate(${tilt}deg)` }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => setFlipped((f) => !f)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          }}
          aria-pressed={flipped}
          aria-label={`${gift.title} — show ${flipped ? "QR code" : "details"}`}
          className="relative block w-full min-h-[470px] cursor-pointer rounded-[1.75rem] transition-transform duration-700 ease-out-expo [transform-style:preserve-3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-silver focus-visible:ring-offset-4"
          style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
        >
          {/* FRONT — the QR is what guests need, so it faces up. */}
          <div className="absolute inset-0 flex flex-col bg-cream rounded-[1.75rem] shadow-[0_30px_60px_-30px_rgba(28,41,64,0.45)] ring-1 ring-navy/10 overflow-hidden [backface-visibility:hidden]">
            <div className={`relative flex items-center justify-between px-6 py-3 font-mono uppercase tracking-[0.3em] text-[9px] ${STRIPS[index % STRIPS.length]}`}>
              {/* Eyelet */}
              <span aria-hidden className="absolute -top-1 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-cream ring-2 ring-navy/30" />
              <span>Tag · {String(index + 1).padStart(2, "0")}</span>
              <span>Belt {wedding.seat.replace(/\D/g, "")}</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-7 pt-7 pb-6 text-center">
              <span className="block font-script text-5xl text-navy leading-none">{gift.title}</span>
              <span className="mt-2 block font-serif italic text-sm text-navy/70">{gift.note}</span>

              {/* QR with scan brackets */}
              <div className="relative mt-6 p-3 bg-white rounded-md ring-1 ring-navy/10">
                {["top-1 left-1 border-t-2 border-l-2", "top-1 right-1 border-t-2 border-r-2", "bottom-1 left-1 border-b-2 border-l-2", "bottom-1 right-1 border-b-2 border-r-2"].map((c) => (
                  <span key={c} aria-hidden className={`absolute h-4 w-4 border-sky ${c}`} />
                ))}
                {gift.qr ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={gift.qr} alt={`${gift.title} QR code`} className="w-[210px] h-[210px] object-contain" />
                ) : (
                  <QR text={gift.handle} size={210} />
                )}
              </div>

              <span className="mt-5 block font-mono text-[11px] tracking-[0.15em] text-navy break-words">{gift.handle}</span>
              <span className="mt-4 inline-flex items-center gap-2 font-sans uppercase tracking-[0.3em] text-[9px] text-navy-deep">
                <span className="h-1.5 w-1.5 rounded-full bg-sky animate-pulse motion-reduce:animate-none" />
                Scan to send · Tap for details
              </span>
            </div>

            <div className="perforation text-navy/20 mx-6" />
            <div className="px-6 py-3 flex items-center justify-between font-mono uppercase tracking-[0.25em] text-[9px] text-navy/70">
              <span>{wedding.brand}</span>
              <PaperPlane className="w-3.5 h-3.5 text-sky" />
              <span>{wedding.flightNumber}</span>
            </div>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-deep text-cream rounded-[1.75rem] p-8 text-center shadow-2xl ring-1 ring-cream/10 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <PaperPlane className="w-8 h-8 text-silver mb-5" />
            <span className="block font-sans uppercase tracking-[0.3em] text-[10px] text-silver-pale">Where it goes</span>
            <span className="mt-3 block font-script text-5xl leading-none">{gift.title}</span>
            <span className="mt-5 block font-mono text-[12px] tracking-[0.15em] text-cream break-words">{gift.handle}</span>
            <span className="mt-3 block font-serif italic text-base text-cream/90 max-w-xs">{gift.note}</span>
            <span className="mt-8 block font-sans uppercase tracking-[0.3em] text-[9px] text-silver-pale">Tap to go back</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Registry() {
  return (
    <section id="registry" className="relative overflow-hidden border-y border-silver/20">
      {/* Big, faint monogram behind the belt */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 right-[-4%] font-script text-[34vw] leading-none text-cream/[0.04] select-none"
      >
        J&amp;M
      </div>

      <div className="section relative">
        <div className="section-title">
          <p className="section-eyebrow">Baggage claim · Belt {wedding.seat.replace(/\D/g, "")}</p>
          <h2 className="section-heading">Gift Registry</h2>
          <FloralDivider className="mt-6" />
          <p className="max-w-3xl mx-auto font-serif italic text-cream/85 text-xl sm:text-2xl leading-snug mt-8">
            Your presence is truly the greatest gift we could ask for. As we begin our
            journey together and prepare to build our family abroad, a monetary
            contribution toward our future would be sincerely appreciated.
          </p>
          <p className="max-w-2xl mx-auto font-serif italic text-cream/60 text-base mt-4">
            Thank you for being part of this special chapter of our lives.
          </p>
        </div>

        {/* The belt rail the tags hang from */}
        <div className="relative mt-4">
          <div className="absolute inset-x-0 top-2 border-t-2 border-dotted border-silver/60" aria-hidden />
          <div className="absolute right-0 -top-5 font-mono uppercase tracking-[0.3em] text-[9px] text-cream/60" aria-hidden>
            Now arriving · Belt {wedding.seat.replace(/\D/g, "")}
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {wedding.registry.map((r, i) => (
              <Reveal key={r.title} delay={i * 140} variant="zoom">
                <GiftTag gift={r} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
