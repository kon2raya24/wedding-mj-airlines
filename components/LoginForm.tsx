"use client";

import { useState, useTransition } from "react";
import { FlightArc, Barcode, PaperPlane, CalendarIcon, PinIcon, ClockIcon } from "@/components/Decor";
import HeroVideo from "@/components/HeroVideo";

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 font-sans uppercase tracking-[0.25em] text-[10px] sm:text-[11px] text-cream/85">
      <span className="text-silver shrink-0">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

export default function LoginForm({
  next,
  brideFirst,
  groomFirst,
  flightNumber,
  shortDateCompact,
  gate,
  origin,
  destination,
  venue,
  ceremonyTime,
  videoUrl,
  lightVideoUrl,
  poster,
  action,
}: {
  next: string;
  brideFirst: string;
  groomFirst: string;
  flightNumber: string;
  shortDateCompact: string;
  gate: string;
  origin: string;
  destination: string;
  venue: string;
  ceremonyTime: string;
  videoUrl: string;
  lightVideoUrl: string;
  poster: string;
  action: (formData: FormData) => Promise<{ error?: string }>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
        setShake(true);
        window.setTimeout(() => setShake(false), 600);
      }
    });
  }

  return (
    <div className="grain relative min-h-[100svh] bg-navy text-cream overflow-x-hidden">
      {/* The film */}
      <div className="fixed inset-0" aria-hidden>
        <HeroVideo src={videoUrl} lightSrc={lightVideoUrl} poster={poster} />
      </div>
      <div className="fixed inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/30" aria-hidden />
      <div className="fixed inset-0 bg-gradient-to-r from-navy/75 via-navy/20 to-navy/60" aria-hidden />

      {/* Top strip */}
      <div className="fixed top-0 inset-x-0 z-10 border-b border-cream/10 backdrop-blur-sm bg-navy-deep/30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-2 font-mono uppercase tracking-[0.25em] text-[9px] sm:text-[10px] text-cream/70">
          <span className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-silver/70 animate-ping motion-reduce:hidden" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-silver" />
            </span>
            JM Airways · Self check-in
          </span>
          <span className="hidden md:inline">Flight {flightNumber} · {shortDateCompact}</span>
          <span className="shrink-0">Terminal {gate.replace(/\D/g, "") || "26"}</span>
        </div>
      </div>

      <div className="relative z-[1] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-24 sm:pt-28 pb-16 min-h-[100svh] grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-12 lg:gap-16 items-center">
        {/* Left — the invitation */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 animate-hero-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-cream/30 rounded-full font-sans uppercase tracking-[0.3em] text-[10px] text-cream/85 backdrop-blur-sm">
              <PaperPlane className="w-3.5 h-3.5 text-silver" />
              Pre-flight check-in
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream/5 border border-cream/10 font-mono uppercase tracking-[0.25em] text-[9px] text-cream/70 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {flightNumber} · On time
            </div>
          </div>

          <h1 className="mt-8 font-serif font-semibold uppercase leading-[0.84] tracking-[-0.02em] text-[14.5vw] sm:text-[12vw] lg:text-[7.5vw] drop-shadow-[0_10px_40px_rgba(28,41,64,0.45)]">
            <span className="block animate-hero-up" style={{ animationDelay: "120ms" }}>
              {groomFirst}
            </span>
            <span className="block animate-hero-up" style={{ animationDelay: "240ms" }}>
              <span className="font-script font-normal normal-case text-silver text-[0.42em] align-[0.12em] mr-[0.06em]">&amp;</span>
              {brideFirst}
            </span>
          </h1>

          <p className="mt-6 font-script text-3xl sm:text-4xl text-cream/90 animate-hero-up" style={{ animationDelay: "360ms" }}>
            flight {flightNumber.toLowerCase()} to forever
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 animate-hero-up" style={{ animationDelay: "440ms" }}>
            <Chip icon={<CalendarIcon className="w-4 h-4" />} text={shortDateCompact} />
            <Chip icon={<PinIcon className="w-4 h-4" />} text={venue} />
            <Chip icon={<ClockIcon className="w-4 h-4" />} text={ceremonyTime} />
          </div>
          <p className="mt-8 max-w-md font-serif italic text-cream/75 text-lg animate-hero-up" style={{ animationDelay: "520ms" }}>
            Please locate your reservation to view your invitation and reserve your seat.
          </p>
        </div>

        {/* Right — the kiosk */}
        <div className="w-full min-w-0 max-w-md lg:max-w-none mx-auto animate-hero-up" style={{ animationDelay: "300ms" }}>
          <form
            action={onSubmit}
            className={`bg-cream text-navy rounded-2xl overflow-hidden shadow-[0_50px_100px_-30px_rgba(0,0,0,0.6)] ring-1 ring-cream/20 ${
              shake ? "animate-[shake_0.45s_cubic-bezier(.36,.07,.19,.97)_both]" : ""
            }`}
          >
            <input type="hidden" name="next" value={next} />

            {/* Top stub */}
            <div className="bg-navy-deep text-cream px-6 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <PaperPlane className="w-5 h-5 text-sky shrink-0" />
                <div className="font-sans uppercase tracking-[0.25em] text-[9px] sm:text-[10px] min-w-0">
                  <div className="text-navy-deep truncate">JM Airways</div>
                  <div className="text-cream/70 truncate">Boarding pass · Check-in</div>
                </div>
              </div>
              <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-cream/70 text-right shrink-0">
                <div>FLT {flightNumber}</div>
                <div>{shortDateCompact}</div>
              </div>
            </div>

            {/* Route */}
            <div className="bg-sand/50 px-6 py-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="min-w-0">
                <div className="font-sans uppercase tracking-[0.25em] text-[10px] text-navy/70">From</div>
                <div className="font-serif text-3xl font-semibold text-navy leading-none mt-1">{origin}</div>
              </div>
              <div className="text-sky shrink-0">
                <FlightArc className="w-20 sm:w-28 h-9" />
              </div>
              <div className="text-right min-w-0">
                <div className="font-sans uppercase tracking-[0.25em] text-[10px] text-navy/70">To</div>
                <div className="font-serif text-3xl font-semibold text-navy leading-none mt-1">{destination}</div>
              </div>
            </div>

            <div className="perforation text-silver/60" />

            <div className="p-6 sm:p-7 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="font-sans uppercase tracking-[0.25em] text-[10px] font-medium text-navy/70">First name</span>
                  <input
                    type="text"
                    name="firstName"
                    required
                    autoComplete="given-name"
                    placeholder="e.g. Marjorie"
                    className="field mt-1.5"
                  />
                </label>
                <label className="block">
                  <span className="font-sans uppercase tracking-[0.25em] text-[10px] font-medium text-navy/70">Last name</span>
                  <input
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="e.g. Dela Cruz"
                    className="field mt-1.5"
                  />
                </label>
              </div>

              <label className="block">
                <span className="font-sans uppercase tracking-[0.25em] text-[10px] font-medium text-navy/70">Invitation code</span>
                <input
                  type="text"
                  name="code"
                  required
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  data-1p-ignore="true"
                  data-lpignore="true"
                  data-bwignore="true"
                  data-form-type="other"
                  placeholder="Code on your invitation"
                  maxLength={32}
                  className={`field mt-1.5 font-mono tracking-[0.25em] uppercase placeholder:tracking-[0.15em] ${
                    error ? "!border-rouge focus:!ring-rouge/25" : ""
                  }`}
                />
                {error ? (
                  <span className="mt-1.5 block font-sans text-[12px] font-medium text-rouge">{error}</span>
                ) : (
                  <span className="mt-1.5 block font-sans text-[12px] text-navy/70">
                    The code is printed on your invitation card — it&apos;s the same for everyone.
                  </span>
                )}
              </label>

              <button
                type="submit"
                disabled={pending}
                className="btn-motion btn-shine w-full font-sans uppercase tracking-[0.3em] text-[11px] px-6 py-4 bg-navy-deep text-cream rounded-full hover:bg-silver hover:text-navy hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0 shadow-lg shadow-navy-deep/30 inline-flex items-center justify-center gap-2"
              >
                <PaperPlane className="w-4 h-4" />
                {pending ? "Verifying…" : "Find my reservation"}
              </button>
            </div>

            <div className="bg-navy-deep text-cream px-6 py-3 flex items-center justify-between gap-3">
              <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-cream/60 truncate">
                Gate · {gate}
              </div>
              <Barcode className="w-24 h-7 text-cream shrink-0" />
            </div>
          </form>

          <p className="mt-5 text-center font-serif italic text-cream/70 text-sm">
            Lost your code? Message {groomFirst} or {brideFirst} and we&apos;ll re-issue your boarding pass.
          </p>
        </div>
      </div>

      {/* Bottom flight strip */}
      <div className="relative z-[1] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono uppercase tracking-[0.25em] text-[9px] text-cream/60">
        <span>JM Airways</span>
        <span className="text-silver/60">✈</span>
        <span>FLT {flightNumber}</span>
        <span className="text-silver/60">✈</span>
        <span>{origin} → {destination}</span>
        <span className="text-silver/60">✈</span>
        <span>{shortDateCompact} · {ceremonyTime}</span>
      </div>

      <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
}
