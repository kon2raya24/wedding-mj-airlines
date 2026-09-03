"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { wedding } from "@/lib/config";
import { FloralDivider, PassportStamp } from "@/components/Decor";

// Postcards tossed on the table. As the desk pins and the guest scrolls,
// each card slides and turns into its slot in the grid, one after another
// (CSS scroll-driven animation on the --desk view timeline; see .desk-* in
// globals.css). `--sx/--sy/--sr` is where a card starts, `--tilt` how it
// rests. Below md the desk doesn't pin: cards land as they enter instead.
const scatter: [string, string, string, string][] = [
  ["24vw", "22vh", "-14deg", "-2deg"],
  ["3vw", "26vh", "7deg", "1.5deg"],
  ["-22vw", "18vh", "12deg", "-1deg"],
  ["26vw", "-16vh", "9deg", "2deg"],
  ["-2vw", "-24vh", "-11deg", "-1.5deg"],
  ["-25vw", "-20vh", "15deg", "1deg"],
];
const stampColors = ["text-rouge/80", "text-navy/70", "text-warm", "text-sky", "text-rouge/70", "text-navy/70"];

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = wedding.gallery.length;

  const step = useCallback(
    (dir: 1 | -1) => setActive((i) => (i === null ? i : (i + dir + count) % count)),
    [count],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, step]);

  return (
    <section id="gallery" className="section">
      <div className="section-title">
        <p className="section-eyebrow">Postcards from our travels</p>
        <h2 className="section-heading">Postcards</h2>
        <FloralDivider className="mt-6" />
        <p className="max-w-xl mx-auto font-serif italic text-cream/70 text-lg mt-6">
          Snapshots from every layover that made us, us.
        </p>
        <p className="mt-4 hidden md:block font-mono uppercase tracking-[0.3em] text-[9px] text-cream/60">
          Scroll · the pile sorts itself
        </p>
      </div>

      <div className="desk-track">
        <div className="desk-scene">
          <ul className="grid w-full max-w-5xl mx-auto grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {wedding.gallery.map((img, i) => {
              const [sx, sy, sr, tilt] = scatter[i % scatter.length];
              return (
                <li
                  key={i}
                  className="desk-card relative"
                  style={{ "--sx": sx, "--sy": sy, "--sr": sr, "--tilt": tilt, "--i": i, zIndex: i } as CSSProperties}
                >
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className="group relative block w-full bg-cream p-2.5 sm:p-3 pb-9 sm:pb-11 text-left shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6),0_2px_6px_rgba(0,0,0,0.18)] transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-[0_34px_60px_-20px_rgba(0,0,0,0.7),0_4px_10px_rgba(0,0,0,0.2)]"
                    aria-label={`Open postcard ${i + 1}: ${img.alt}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-navy/10">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        draggable={false}
                        sizes="(min-width: 1024px) 340px, (min-width: 768px) 30vw, 46vw"
                        className="object-cover sepia-[20%] group-hover:sepia-0 transition-[filter,transform] duration-[1200ms] ease-out-expo group-hover:scale-105 pointer-events-none"
                      />
                      <PassportStamp
                        text={img.stamp}
                        rotate={-15 + (i % 3) * 12}
                        className={`absolute -top-2 -right-2 w-14 h-14 sm:w-20 sm:h-20 ${stampColors[i % stampColors.length]} z-10`}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-navy/70">
                      <span>POSTCARD · {String(i + 1).padStart(2, "0")}</span>
                      <span className="hidden sm:inline">{img.stamp}</span>
                    </div>
                    <div className="font-script text-2xl sm:text-3xl text-navy text-center mt-1.5 truncate">{img.alt}</div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[60] bg-navy-deep/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in-fast"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Postcard ${active + 1} of ${count}`}
        >
          <figure
            key={active}
            className="relative max-w-[95vw] max-h-[90vh] flex flex-col items-center animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={wedding.gallery[active].src}
              alt={wedding.gallery[active].alt}
              width={1600}
              height={1200}
              sizes="95vw"
              className="max-h-[78vh] max-w-[95vw] w-auto h-auto object-contain rounded-sm shadow-2xl"
              priority
            />
            <figcaption className="mt-4 flex items-center gap-4 text-cream">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/60">
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
              <span className="font-script text-2xl sm:text-3xl">{wedding.gallery[active].alt}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-silver">
                {wedding.gallery[active].stamp}
              </span>
            </figcaption>
          </figure>

          <button
            aria-label="Previous postcard"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-cream/30 text-cream grid place-items-center hover:bg-cream hover:text-navy hover:border-cream transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            aria-label="Next postcard"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-cream/30 text-cream grid place-items-center hover:bg-cream hover:text-navy hover:border-cream transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            ref={closeRef}
            aria-label="Close"
            onClick={() => setActive(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full text-cream text-3xl font-sans leading-none grid place-items-center hover:bg-cream/10 hover:text-silver transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}
