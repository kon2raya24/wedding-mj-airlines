"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { wedding } from "@/lib/config";
import { FloralDivider, PassportStamp } from "@/components/Decor";
import Reveal from "@/components/Reveal";

const tilts = [
  "sm:-rotate-3",
  "sm:rotate-2",
  "sm:-rotate-2",
  "sm:rotate-3",
  "sm:-rotate-1",
  "sm:rotate-1",
];
const stampColors = ["text-rouge/80", "text-navy/70", "text-gold", "text-sky", "text-rouge/70", "text-navy/60"];

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active]);

  return (
    <section id="gallery" className="section">
      <div className="section-title">
        <p className="section-eyebrow">Postcards from our travels</p>
        <h2 className="section-heading">Postcards</h2>
        <FloralDivider className="mt-6" />
        <p className="max-w-xl mx-auto font-serif italic text-navy/70 text-lg mt-6">
          Snapshots from every layover that made us, us.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
        {wedding.gallery.map((img, i) => (
          <Reveal
            key={i}
            delay={i * 100}
            className={`group ${tilts[i % tilts.length]} hover:rotate-0 hover:scale-105 transition-transform duration-500`}
          >
            <button
              onClick={() => setActive(i)}
              className="relative w-full bg-cream p-3 pb-12 shadow-md hover:shadow-2xl transition-shadow duration-500 block"
              aria-label={`Open postcard ${i + 1}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-navy/10">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover sepia-[20%] group-hover:sepia-0 transition-all duration-700 group-hover:scale-110"
                />
                <PassportStamp
                  text={img.stamp}
                  rotate={-15 + (i % 3) * 12}
                  className={`absolute -top-2 -right-2 w-20 h-20 ${stampColors[i % stampColors.length]} z-10`}
                />
              </div>

              <div className="flex items-center justify-between mt-3 font-mono text-[10px] uppercase tracking-widest text-navy/70">
                <span>POSTCARD · {String(i + 1).padStart(2, "0")}</span>
                <span>{img.stamp}</span>
              </div>
              <div className="font-script text-2xl text-navy text-center mt-2">
                {img.alt}
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[60] bg-navy-deep/95 grid place-items-center p-4 animate-fade-in"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <Image
            src={wedding.gallery[active].src}
            alt={wedding.gallery[active].alt}
            width={1600}
            height={1200}
            sizes="95vw"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[95vw] w-auto h-auto object-contain rounded-sm shadow-2xl"
            priority
          />
          <button
            ref={closeRef}
            aria-label="Close"
            onClick={() => setActive(null)}
            className="absolute top-6 right-6 text-cream text-4xl font-sans hover:text-gold"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}
