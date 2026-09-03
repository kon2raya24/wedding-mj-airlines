import { wedding } from "@/lib/config";
import { PaperPlane } from "@/components/Decor";

// A cinematic in-flight moment: the golden-hour photo full-bleed and mostly
// unwashed, the quote as large left-aligned display type, and quiet
// flight-data details in the corners like a seat-back screen.
export default function Quote() {
  const words = wedding.quote.text.split(" ");
  return (
    <section className="quote-scene grain relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-navy">
      {/* The view opens like a cabin window as the section scrolls in
          (.cabin-window in globals.css); the photo keeps its own drift. */}
      <div className="cabin-window absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="parallax-bg absolute inset-0 bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url('${wedding.quote.image}')` }}
        />
        {/* Grade: keep the warmth, darken only where type sits. */}
        <div className="absolute inset-0 bg-navy-deep/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/25 to-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/60 via-transparent to-transparent" />
      </div>

      {/* Top strip — seat-back data */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-24 sm:pt-28 flex items-start justify-between gap-6 font-mono uppercase tracking-[0.3em] text-[9px] sm:text-[10px] text-cream/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-silver animate-pulse motion-reduce:animate-none" />
            In-flight · Window seat {wedding.seat}
          </div>
          <div className="text-cream/60">Alt 36,000 ft · Cruising · {wedding.route.from} → {wedding.route.to}</div>
        </div>
        <div className="text-right space-y-1.5">
          <div>{wedding.brand}</div>
          <div className="text-cream/60">{wedding.flightNumber} · {wedding.shortDateCompact}</div>
        </div>
      </div>

      {/* The line */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24 pt-16">
        <PaperPlane className="w-8 h-8 sm:w-10 sm:h-10 text-silver -rotate-12 mb-8 drop-shadow-[0_4px_16px_rgba(185,190,198,0.35)]" />
        <blockquote className="font-serif italic text-cream leading-[0.98] tracking-[-0.015em] text-[11vw] sm:text-[8.5vw] lg:text-[6.2vw] max-w-6xl drop-shadow-[0_8px_30px_rgba(28,41,64,0.5)]">
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
              <span
                className="word-up inline-block"
                style={{ animationRange: `entry ${10 + i * 4}% entry ${46 + i * 4}%` } as React.CSSProperties}
              >
                {word}
              </span>
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </blockquote>

        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="flex items-center gap-4 text-silver">
            <span className="h-px w-12 sm:w-20 bg-silver/70" />
            <span className="font-sans uppercase tracking-[0.35em] sm:tracking-[0.5em] text-[10px] sm:text-[11px]">
              {wedding.quote.author}
            </span>
          </div>
          <div className="font-mono uppercase tracking-[0.3em] text-[9px] text-cream/60">
            Golden hour · Somewhere above {wedding.destinationVenue}
          </div>
        </div>
      </div>
    </section>
  );
}
