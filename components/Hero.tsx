import { wedding } from "@/lib/config";
import { Monogram, FlightArc, PaperPlane, Barcode } from "@/components/Decor";
import AnimatedName from "@/components/AnimatedName";
import MagneticLink from "@/components/MagneticLink";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-navy"
    >
      {/* Background — clouds / sky */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-55"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=2000&q=85')",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-navy/30 to-navy" aria-hidden />
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(8,26,46,0.85)_100%)]" aria-hidden />

      {/* Airline header strip */}
      <div className="absolute top-0 inset-x-0 z-10 border-b border-cream/15 backdrop-blur-sm bg-navy-deep/30">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex items-center justify-between font-mono uppercase tracking-[0.3em] text-[10px] text-cream/70">
          <span className="flex items-center gap-2">
            <span className="text-gold">●</span> M &amp; J AIRLINES
          </span>
          <span className="hidden md:inline">FLIGHT MJ · 12.12.26 · MNL → ∞</span>
          <span>BOARDING PASS</span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 pt-24 pb-12 animate-fade-in">
        {/* Pre-title */}
        <div className="text-center mb-6">
          <p className="font-sans uppercase tracking-[0.6em] text-[10px] md:text-xs text-gold mb-3">
            Now boarding
          </p>
          <h1 className="font-script text-[clamp(3.5rem,11vw,11rem)] text-cream leading-[0.85]">
            <AnimatedName text={wedding.brideFirst} />
            <span className="text-gold mx-2 md:mx-4 align-middle">&amp;</span>
            <AnimatedName text={wedding.groomFirst} delay={500} />
          </h1>
          <p className="font-serif italic text-cream/70 text-lg md:text-xl mt-3">
            invite you to take flight with them
          </p>
        </div>

        {/* Boarding pass card */}
        <div className="mt-10 mx-auto max-w-4xl">
          <div className="relative bg-cream text-navy rounded-md overflow-hidden shadow-2xl shadow-navy-deep/60 grid grid-cols-1 md:grid-cols-[1fr_auto_180px]">
            {/* Decorative corner sprig — removed in favor of clean stub */}

            {/* MAIN STUB */}
            <div className="p-6 md:p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Monogram className="w-10 h-10 text-gold" />
                  <div className="font-sans uppercase tracking-[0.3em] text-[10px]">
                    <div className="text-navy">M&amp;J Airlines</div>
                    <div className="text-navy/60">Boarding Pass</div>
                  </div>
                </div>
                <div className="font-mono text-[10px] tracking-widest text-navy/50">
                  MJ · 12.12.26
                </div>
              </div>

              {/* Route */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-6">
                <div>
                  <div className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/55">From</div>
                  <div className="font-serif text-3xl md:text-4xl mt-1 leading-none">MNL</div>
                  <div className="font-sans text-xs text-navy/70 mt-1">Manila</div>
                </div>
                <div className="text-gold">
                  <FlightArc className="w-32 md:w-44 h-12" />
                </div>
                <div className="text-right">
                  <div className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/55">To</div>
                  <div className="font-serif text-3xl md:text-4xl mt-1 leading-none">FOREVER</div>
                  <div className="font-sans text-xs text-navy/70 mt-1">Together</div>
                </div>
              </div>

              <div className="perforation text-gold/60 my-6" />

              {/* Pass details */}
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div>
                  <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">Passenger</dt>
                  <dd className="font-serif text-base mt-1">You + 1</dd>
                </div>
                <div>
                  <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">Date</dt>
                  <dd className="font-serif text-base mt-1">12 Dec 2026</dd>
                </div>
                <div>
                  <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">Gate</dt>
                  <dd className="font-serif text-base mt-1">San Agustin</dd>
                </div>
                <div>
                  <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">Boarding</dt>
                  <dd className="font-serif text-base mt-1">14:00</dd>
                </div>
              </dl>
            </div>

            {/* Tear line */}
            <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px border-l border-dashed border-navy/30" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-navy" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-4 w-4 rounded-full bg-navy" />
            </div>

            {/* RIGHT STUB */}
            <div className="bg-navy text-cream p-6 md:p-8 relative flex flex-col">
              <div className="font-sans uppercase tracking-[0.3em] text-[9px] text-gold mb-2">Stub</div>
              <div className="font-script text-3xl text-cream leading-none mb-4">
                M &amp; J
              </div>
              <div className="space-y-2 font-mono text-[10px] text-cream/80 mb-4">
                <div>SEAT · 12A</div>
                <div>FLT  · MJ1212</div>
                <div>GATE · MNL-A</div>
              </div>
              <div className="mt-auto text-gold">
                <Barcode className="w-full h-10" />
                <div className="font-mono text-[9px] text-center mt-1 tracking-widest text-cream/70">
                  MARJORIE+JOSEPH-12122026
                </div>
              </div>
            </div>
          </div>

          {/* Decorative paper plane crossing the stub */}
          <PaperPlane className="hidden md:block w-10 h-10 text-gold absolute right-[12%] -mt-12 rotate-12 animate-float-slow" />
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticLink
            href="#rsvp"
            className="font-sans uppercase tracking-[0.4em] text-[10px] px-8 py-4 bg-gold text-navy hover:bg-cream transition-colors shadow-lg shadow-navy-deep/40"
            strength={0.4}
          >
            Confirm boarding <span>→</span>
          </MagneticLink>
          <MagneticLink
            href="#story"
            className="font-sans uppercase tracking-[0.4em] text-[10px] text-cream/80 hover:text-gold transition-colors"
            strength={0.3}
          >
            Read flight log
          </MagneticLink>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#countdown"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/50 hover:text-gold transition-colors"
        aria-label="Scroll down"
      >
        <span className="font-sans uppercase tracking-[0.4em] text-[9px]">Pre-departure</span>
        <span className="w-px h-10 bg-cream/30 animate-pulse" />
      </a>
    </section>
  );
}
