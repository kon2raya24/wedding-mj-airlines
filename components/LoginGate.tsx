"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/config";
import { readAuth, writeAuth } from "@/lib/auth";
import { findGuest } from "@/lib/guests";
import { FlightArc, Barcode, PaperPlane } from "@/components/Decor";

type Status = "idle" | "checking" | "error";

export default function LoginGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setAuthed(!!readAuth());
    setReady(true);
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!firstName.trim() || !code.trim()) return;
    setStatus("checking");

    window.setTimeout(() => {
      const guest = findGuest(firstName, lastName, code);
      if (guest) {
        writeAuth(guest);
        setAuthed(true);
        setStatus("idle");
      } else {
        setStatus("error");
        setShake(true);
        window.setTimeout(() => setShake(false), 600);
      }
    }, 450);
  }

  if (!ready) {
    return <div className="fixed inset-0 bg-navy-deep" aria-hidden />;
  }

  if (authed) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-navy">
      <div
        className="fixed inset-0 bg-cover bg-center opacity-45"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=2400&q=85')",
        }}
        aria-hidden
      />
      <div className="fixed inset-0 bg-gradient-to-b from-navy-deep/70 via-navy-deep/50 to-navy-deep" aria-hidden />

      {/* Top strip */}
      <div className="fixed top-0 inset-x-0 z-10 border-b border-cream/15 backdrop-blur-sm bg-navy-deep/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-3 flex items-center justify-between gap-2 font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-cream/70">
          <span className="flex items-center gap-2 shrink-0">
            <span className="text-gold">●</span> MJ Airways
          </span>
          <span className="hidden md:inline">Flight {wedding.flightNumber} · {wedding.shortDateCompact}</span>
          <span className="shrink-0">Check-in</span>
        </div>
      </div>

      <div className="relative w-full max-w-md mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-12">
        <div className="text-center mb-6">
          <p className="font-sans uppercase tracking-[0.5em] text-[10px] text-gold mb-2">
            Pre-flight check-in
          </p>
          <h1 className="font-script text-5xl sm:text-6xl text-cream leading-[0.9]">
            {wedding.brideFirst} <span className="text-gold">&amp;</span> {wedding.groomFirst}
          </h1>
          <p className="font-serif italic text-cream/70 text-sm sm:text-base mt-3">
            Please locate your reservation to view your invitation.
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
              <PaperPlane className="w-5 h-5 text-gold shrink-0" />
              <div className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] min-w-0">
                <div className="text-gold truncate">MJ Airways</div>
                <div className="text-cream/70 truncate">Flight to Forever</div>
              </div>
            </div>
            <div className="font-sans text-[9px] sm:text-[10px] tracking-widest text-cream/70 text-right shrink-0">
              <div>FLT {wedding.flightNumber}</div>
              <div>{wedding.shortDateCompact}</div>
            </div>
          </div>

          {/* Route */}
          <div className="bg-sand/50 px-5 py-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="min-w-0">
              <div className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-navy/55">From</div>
              <div className="font-serif text-xl sm:text-2xl">Here</div>
            </div>
            <div className="text-gold shrink-0">
              <FlightArc className="w-16 sm:w-24 h-8" />
            </div>
            <div className="text-right min-w-0">
              <div className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-navy/55">To</div>
              <div className="font-serif text-xl sm:text-2xl">Forever</div>
            </div>
          </div>

          <div className="perforation text-gold/60" />

          <div className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">
                  First name
                </span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  required
                  autoComplete="given-name"
                  placeholder="e.g. Marjorie"
                  className="mt-1 w-full bg-sand/40 border border-navy/30 rounded px-3 py-2 font-serif focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
                />
              </label>
              <label className="block">
                <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">
                  Last name
                </span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  autoComplete="family-name"
                  placeholder="e.g. Dela Cruz"
                  className="mt-1 w-full bg-sand/40 border border-navy/30 rounded px-3 py-2 font-serif focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
                />
              </label>
            </div>

            <label className="block">
              <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">
                Invitation code
              </span>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                required
                name="invitation-code"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                data-1p-ignore="true"
                data-lpignore="true"
                data-bwignore="true"
                data-form-type="other"
                placeholder="From your invitation card"
                maxLength={32}
                className={`mt-1 w-full bg-sand/40 border rounded px-3 py-2 font-mono tracking-[0.25em] uppercase focus:outline-none focus:ring-1 ${
                  status === "error"
                    ? "border-rouge focus:border-rouge focus:ring-rouge/30"
                    : "border-navy/30 focus:border-gold focus:ring-gold/40"
                }`}
              />
              {status === "error" ? (
                <span className="mt-1 block font-sans text-[11px] text-rouge">
                  We couldn&apos;t find that reservation. Check the name and code on your invitation.
                </span>
              ) : (
                <span className="mt-1 block font-sans text-[11px] text-navy/50">
                  Your unique code is printed on your invitation card.
                </span>
              )}
            </label>

            <button
              type="submit"
              disabled={status === "checking"}
              className="w-full font-sans uppercase tracking-[0.3em] text-[11px] px-6 py-4 bg-navy text-cream hover:bg-gold hover:text-navy transition-colors disabled:opacity-60 shadow-lg shadow-navy-deep/30 inline-flex items-center justify-center gap-2"
            >
              <PaperPlane className="w-4 h-4" />
              {status === "checking" ? "Verifying…" : "Find my reservation"}
            </button>
          </div>

          <div className="bg-navy text-cream px-5 py-3 flex items-center justify-between gap-3">
            <div className="font-sans text-[9px] sm:text-[10px] uppercase tracking-widest text-cream/60 truncate">
              Gate · {wedding.gate}
            </div>
            <Barcode className="w-24 h-7 text-cream shrink-0" />
          </div>
        </form>

        <p className="mt-6 text-center font-serif italic text-cream/55 text-xs sm:text-sm">
          Lost your code? Message {wedding.brideFirst} or {wedding.groomFirst} and we&apos;ll
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
