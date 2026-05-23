"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/config";
import { DEFAULT_GUEST_CODE, readAuth, writeAuth } from "@/lib/auth";
import { Monogram, FlightArc, Barcode, PaperPlane } from "@/components/Decor";

type Status = "idle" | "checking" | "error";

export default function LoginGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setAuthed(!!readAuth());
    setReady(true);
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedName) return;
    setStatus("checking");

    // Tiny artificial delay so it feels like a "verification"
    window.setTimeout(() => {
      if (trimmedCode === DEFAULT_GUEST_CODE) {
        writeAuth({ name: trimmedName, checkedInAt: Date.now() });
        setAuthed(true);
        setStatus("idle");
      } else {
        setStatus("error");
        setShake(true);
        window.setTimeout(() => setShake(false), 600);
      }
    }, 450);
  }

  // Prevent SSR/CSR mismatch flash: render nothing until we've checked storage.
  if (!ready) {
    return <div className="fixed inset-0 bg-navy-deep" aria-hidden />;
  }

  if (authed) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-navy">
      {/* Background — clouds / sky, same vibe as Hero */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-55"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=2000&q=85')",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy/40 to-navy" aria-hidden />
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(8,26,46,0.85)_100%)]" aria-hidden />

      {/* Airline header strip */}
      <div className="absolute top-0 inset-x-0 border-b border-cream/15 backdrop-blur-sm bg-navy-deep/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-3 flex items-center justify-between gap-2 font-mono uppercase tracking-[0.18em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-cream/70">
          <span className="flex items-center gap-2 shrink-0">
            <span className="text-gold">●</span> M &amp; J AIRLINES
          </span>
          <span className="hidden md:inline">FLIGHT MJ · 12.12.26 · MNL → ∞</span>
          <span className="shrink-0">CHECK-IN</span>
        </div>
      </div>

      <div className="relative w-full max-w-md px-4 sm:px-6 py-20 sm:py-24">
        <div className="text-center mb-6">
          <p className="font-sans uppercase tracking-[0.5em] text-[10px] text-gold mb-2">
            Pre-flight check-in
          </p>
          <h1 className="font-script text-5xl sm:text-6xl text-cream leading-[0.9]">
            {wedding.brideFirst} <span className="text-gold">&amp;</span> {wedding.groomFirst}
          </h1>
          <p className="font-serif italic text-cream/70 text-sm sm:text-base mt-3">
            Please confirm your seat before boarding.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className={`bg-cream text-navy rounded-md overflow-hidden shadow-2xl shadow-navy-deep/60 transition-transform ${
            shake ? "animate-[shake_0.45s_cubic-bezier(.36,.07,.19,.97)_both]" : ""
          }`}
        >
          {/* Top stub */}
          <div className="bg-navy text-cream px-5 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Monogram className="w-9 h-9 text-gold shrink-0" />
              <div className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] min-w-0">
                <div className="text-gold truncate">M&amp;J Airlines</div>
                <div className="text-cream/70 truncate">Boarding Pass</div>
              </div>
            </div>
            <div className="font-mono text-[9px] sm:text-[10px] tracking-widest text-cream/70 text-right shrink-0">
              <div>FLT MJ1212</div>
              <div>12.12.26</div>
            </div>
          </div>

          {/* Route */}
          <div className="bg-sand/50 px-5 py-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="min-w-0">
              <div className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-navy/55">From</div>
              <div className="font-serif text-xl sm:text-2xl">MNL</div>
            </div>
            <div className="text-gold shrink-0">
              <FlightArc className="w-16 sm:w-24 h-8" />
            </div>
            <div className="text-right min-w-0">
              <div className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-navy/55">To</div>
              <div className="font-serif text-xl sm:text-2xl">∞</div>
            </div>
          </div>

          <div className="perforation text-gold/60" />

          <div className="p-5 sm:p-6 space-y-4">
            <label className="block">
              <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">
                Passenger name
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="As printed on your invitation"
                className="mt-1 w-full bg-sand/40 border border-navy/30 rounded px-3 py-2 font-serif focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
              />
            </label>

            <label className="block">
              <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">
                Confirmation code
              </span>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                required
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="From your invitation card"
                className={`mt-1 w-full bg-sand/40 border rounded px-3 py-2 font-mono tracking-[0.3em] uppercase focus:outline-none focus:ring-1 ${
                  status === "error"
                    ? "border-rouge focus:border-rouge focus:ring-rouge/30"
                    : "border-navy/30 focus:border-gold focus:ring-gold/40"
                }`}
              />
              {status === "error" ? (
                <span className="mt-1 block font-sans text-[11px] text-rouge">
                  That code isn&apos;t on our flight manifest. Check your invitation and try again.
                </span>
              ) : (
                <span className="mt-1 block font-sans text-[11px] text-navy/50">
                  Tip: look for the code beneath the barcode on your invite.
                </span>
              )}
            </label>

            <button
              type="submit"
              disabled={status === "checking"}
              className="w-full font-sans uppercase tracking-[0.3em] text-[11px] px-6 py-4 bg-navy text-cream hover:bg-gold hover:text-navy transition-colors disabled:opacity-60 shadow-lg shadow-navy-deep/30 inline-flex items-center justify-center gap-2"
            >
              <PaperPlane className="w-4 h-4" />
              {status === "checking" ? "Verifying…" : "Check in ✈"}
            </button>
          </div>

          <div className="bg-navy text-cream px-5 py-3 flex items-center justify-between gap-3">
            <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-cream/60 truncate">
              GATE · SAN AGUSTIN · MNL
            </div>
            <Barcode className="w-24 h-7 text-cream shrink-0" />
          </div>
        </form>

        <p className="mt-6 text-center font-serif italic text-cream/55 text-xs sm:text-sm">
          Lost your code? Reach out to {wedding.brideFirst} or {wedding.groomFirst} and we&apos;ll
          re-issue your boarding pass.
        </p>
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
