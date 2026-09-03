import { wedding } from "@/lib/config";
import { weddingPhase } from "@/lib/day-of";
import { PaperPlane, CalendarIcon, PinIcon, ClockIcon, Scribble } from "@/components/Decor";
import HeroVideo from "@/components/HeroVideo";
import WatchFilm from "@/components/WatchFilm";
import Magnetic from "@/components/Magnetic";

// Staggered entrance: every hero element shares one animation and only
// the delay differs, so the sequence reads as a single choreographed lift.
function enter(ms: number) {
  return { animationDelay: `${ms}ms` };
}

// Each letter rises on its own beat so the names feel typed onto the film.
function Letters({ text, from }: { text: string; from: number }) {
  return (
    <>
      {[...text].map((ch, i) => (
        <span key={i} className="hero-letter inline-block" style={{ "--d": ((i * 7 + text.length * 3) % 13) - 4 } as React.CSSProperties}>
          <span className="inline-block animate-hero-up" style={enter(from + i * 45)}>
            {ch}
          </span>
        </span>
      ))}
    </>
  );
}

function InfoChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 font-sans uppercase tracking-[0.25em] text-[11px] text-cream/85">
      <span className="text-silver shrink-0">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

export default function Hero() {
  const phase = weddingPhase();
  const badge =
    phase === "before"
      ? "Boarding Soon"
      : phase === "day-of"
      ? "Now Boarding"
      : "Thank you for flying with us";

  return (
    <section
      id="top"
      className="grain relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-navy"
    >
      {/* The film. Muted loop, graded dark, drifting slower than the page. */}
      <div className="hero-bg absolute inset-0 will-change-transform" aria-hidden>
        <div className="hero-pointer-bg absolute inset-0">
          <HeroVideo src={wedding.prenup.videoUrl} lightSrc={wedding.prenup.loopUrl} poster={wedding.prenup.poster} />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-navy/20" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/70 via-transparent to-navy/30" aria-hidden />

      <div className="hero-exit relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-40 sm:pb-44 lg:pb-52 will-change-transform">
        {/* Status pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8 animate-hero-up" style={enter(0)}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-cream/30 rounded-full font-sans uppercase tracking-[0.3em] text-[10px] text-cream/85 backdrop-blur-sm">
            <PaperPlane className="w-3.5 h-3.5 text-silver" />
            {badge}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream/5 border border-cream/10 font-mono uppercase tracking-[0.25em] text-[9px] text-cream/70 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70 animate-ping motion-reduce:hidden" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {wedding.flightNumber} · On time
          </div>
        </div>

        {/* The names — the whole hero is really just this. */}
        <h1 className="hero-pointer-fg font-serif font-semibold uppercase text-cream leading-[0.84] tracking-[-0.02em] text-[17vw] sm:text-[14vw] lg:text-[10.5vw] drop-shadow-[0_10px_40px_rgba(28,41,64,0.45)]">
          <span className="block">
            <Letters text={wedding.groomFirst} from={120} />
          </span>
          <span className="block">
            <span
              className="inline-block animate-hero-up font-script font-normal normal-case text-silver text-[0.42em] align-[0.12em] mr-[0.06em]"
              style={enter(120 + wedding.groomFirst.length * 45)}
            >
              &amp;
            </span>
            <Letters text={wedding.brideFirst} from={180 + wedding.groomFirst.length * 45} />
          </span>
        </h1>

        {/* Below the names: tagline + chips on the left, actions on the right */}
        <div className="mt-10 lg:mt-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12">
          <div className="animate-hero-up" style={enter(380)}>
            <p className="relative inline-block font-script text-3xl sm:text-4xl text-cream/90">
              flight {wedding.flightNumber.toLowerCase()} to forever
              <Scribble className="absolute left-0 -bottom-2 h-4 w-full text-silver" />
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3">
              <InfoChip icon={<CalendarIcon className="w-4 h-4" />} text={wedding.shortDateCompact} />
              <InfoChip icon={<PinIcon className="w-4 h-4" />} text={wedding.destinationVenue} />
              <InfoChip icon={<ClockIcon className="w-4 h-4" />} text={wedding.ceremonyTime} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 animate-hero-up" style={enter(500)}>
            <Magnetic>
              <a
                href="#checkin"
                className="btn-motion btn-shine inline-flex items-center justify-center gap-2 font-sans uppercase tracking-[0.3em] text-[11px] px-7 py-4 bg-cream text-navy-deep rounded-full hover:bg-silver hover:text-navy hover:shadow-[0_0_40px_rgba(185,190,198,0.45)] shadow-lg shadow-black/40"
              >
                <PaperPlane className="w-4 h-4" />
                Begin Check-in
              </a>
            </Magnetic>
            <Magnetic>
              <WatchFilm
                src={wedding.prenup.videoUrl}
                poster={wedding.prenup.coverImage}
                duration={wedding.prenup.duration}
                title={`${wedding.groomFirst} & ${wedding.brideFirst} — ${wedding.prenup.tagline}`}
              />
            </Magnetic>
            <a
              href="/api/calendar.ics"
              className="inline-flex items-center gap-2 font-sans uppercase tracking-[0.3em] text-[10px] text-cream/70 hover:text-silver transition-colors px-2 py-3.5"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Add to calendar
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#checkin"
        aria-label="Scroll to check-in"
        className="hidden lg:flex absolute bottom-40 right-10 z-10 flex-col items-center gap-2 font-sans uppercase tracking-[0.35em] text-[9px] text-cream/60 hover:text-silver transition-colors animate-hero-up [writing-mode:vertical-rl]"
        style={enter(900)}
      >
        Scroll to board
        <span className="animate-bob block w-px h-8 bg-gradient-to-b from-silver to-transparent" aria-hidden />
      </a>
    </section>
  );
}
