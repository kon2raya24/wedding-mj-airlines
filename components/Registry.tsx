"use client";

import { useState } from "react";
import { wedding } from "@/lib/config";
import { FloralDivider, PaperPlane } from "@/components/Decor";
import Reveal from "@/components/Reveal";
import QR from "@/components/QRCode";

type Gift = (typeof wedding.registry)[number];

function GiftTag({ gift, index }: { gift: Gift; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="[perspective:1200px]">
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
        aria-label={`${gift.title} — show ${flipped ? "details" : "QR code"}`}
        className="relative block w-full min-h-[440px] cursor-pointer rounded-sm transition-transform duration-500 [transform-style:preserve-3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
        style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-cream border-2 border-dashed border-navy/30 rounded-sm p-7 text-center shadow-sm [backface-visibility:hidden]">
          {/* Luggage-tag string */}
          <span aria-hidden className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-6 bg-navy rounded-full" />
          <span aria-hidden className="absolute -top-9 left-1/2 -translate-x-1/2 w-px h-6 bg-navy" />

          <PaperPlane className="w-7 h-7 text-gold mb-3" />
          <span className="block font-mono uppercase tracking-[0.4em] text-[10px] text-navy/55 mb-2">
            Tag · {String(index + 1).padStart(2, "0")}
          </span>
          <span className="block font-script text-4xl text-navy mb-3">{gift.title}</span>
          <span className="block font-serif font-medium text-navy mb-3 break-words">{gift.handle}</span>
          <span className="block font-serif text-sm text-navy/70 italic">{gift.note}</span>
          <span className="mt-5 block font-sans uppercase tracking-[0.3em] text-[9px] text-gold">
            Tap to view QR
          </span>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-deep border-2 border-dashed border-gold/50 rounded-sm p-7 text-center shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="block font-script text-3xl text-cream mb-4">{gift.title}</span>
          <div className="bg-white p-3 rounded-sm text-navy">
            {gift.qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={gift.qr} alt={`${gift.title} QR code`} className="w-[230px] h-[230px] object-contain" />
            ) : (
              <QR text={gift.handle} size={230} />
            )}
          </div>
          <span className="mt-5 block font-serif text-sm text-cream/80 break-words">{gift.handle}</span>
          <span className="mt-3 block font-sans uppercase tracking-[0.3em] text-[9px] text-gold">
            Tap to go back
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Registry() {
  return (
    <section id="registry" className="relative section overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center -z-20 brightness-50"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=2000&q=80')",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-navy-deep/50 -z-10" aria-hidden />

      <div className="section-title">
        <p className="section-eyebrow !text-gold">Help us pack for the journey</p>
        <h2 className="section-heading !text-cream">Honeymoon Fund</h2>
        <FloralDivider className="mt-6 !text-gold" />
        <p className="max-w-xl mx-auto font-serif italic text-cream text-lg mt-6">
          Your presence is the greatest gift. But if you&apos;d like to send us off in style,
          a contribution to our travels is most appreciated.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {wedding.registry.map((r, i) => (
          <Reveal key={r.title} delay={i * 120}>
            <GiftTag gift={r} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
