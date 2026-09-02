"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/config";
import type { Companion } from "@/lib/rsvp-types";
import { useAuth } from "@/components/AuthProvider";
import { FloralDivider, Barcode, FlightArc, PaperPlane } from "@/components/Decor";

type Status = "idle" | "submitting" | "success" | "error";

const CONFETTI_PIECES = Array.from({ length: 36 });

export default function RSVP() {
  const { session: auth } = useAuth();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");

  // One companion row per reserved seat beyond the guest's own, created
  // once the session is known. Everyone defaults to boarding.
  useEffect(() => {
    const need = Math.max(0, (auth?.seatsReserved ?? 1) - 1);
    setCompanions((prev) => {
      if (prev.length === need) return prev;
      const next = prev.slice(0, need);
      while (next.length < need) next.push({ name: "", attending: true });
      return next;
    });
  }, [auth]);

  // Seats used = the guest (if boarding) plus each companion who is boarding.
  const seatsAttending =
    attending === "no"
      ? 0
      : 1 + companions.filter((c) => c.attending).length;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!auth) {
      setStatus("error");
      setError("You need to check in first. Please sign in above.");
      return;
    }
    setStatus("submitting");
    setError(null);

    // Identity and seat count come from the signed session server-side,
    // so they are deliberately not sent here.
    const payload = {
      attending,
      companions:
        attending === "yes"
          ? companions
              .map((c) => ({ name: c.name.trim(), attending: c.attending }))
              .filter((c) => c.name)
          : [],
      note: note.trim(),
      email: email.trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const cap = auth?.seatsReserved ?? 1;

  return (
    <section id="rsvp" className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=2000&q=80')",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-navy-deep/90 -z-10" aria-hidden />

      <div className="section">
      <div className="section-title">
        <p className="section-eyebrow !text-gold">Reserve your seat</p>
        <h2 className="section-heading !text-cream">Will you fly with us?</h2>
        <FloralDivider className="mt-6 !text-gold" />
        <p className="max-w-xl mx-auto font-serif italic text-cream/80 text-lg mt-6">
          Please confirm boarding by {wedding.rsvpCloseDate}. Limited cabin space.
        </p>
      </div>

      {status === "success" ? (
        <div className="max-w-xl mx-auto bg-cream text-navy rounded-sm overflow-hidden relative shadow-2xl shadow-navy-deep/60">
          <div className="bg-gold text-navy py-3 px-6 font-mono uppercase tracking-[0.3em] text-[10px] flex items-center justify-between">
            <span>★ CONFIRMED ★</span>
            <span>{wedding.flightNumber}</span>
          </div>
          <div className="p-10 text-center relative">
            <PaperPlane className="w-12 h-12 text-gold mx-auto mb-4" />
            <h3 className="font-script text-6xl text-navy mb-3">
              {attending === "yes" ? "You're on board!" : "Safe travels"}
            </h3>
            <p className="font-serif text-lg text-navy/80 max-w-md mx-auto">
              {attending === "yes"
                ? `Your seat${seatsAttending > 1 ? "s have" : " has"} been reserved. We'll see you at the gate on November 26.`
                : "We'll miss you on the day, but we're so grateful you took the time to let us know."}
            </p>
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              {attending === "yes" &&
                CONFETTI_PIECES.map((_, i) => (
                  <span
                    key={i}
                    className="absolute top-0 w-2 h-3 animate-confetti"
                    style={{
                      left: `${(i * 2.8) % 100}%`,
                      backgroundColor: ["#c89b3c", "#1c2940", "#a23a2a", "#8398b7"][i % 4],
                      animationDelay: `${(i % 12) * 0.12}s`,
                    }}
                  />
                ))}
            </div>
          </div>
          <div className="bg-navy-deep text-cream px-6 py-4 flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-widest text-cream/60">
              {wedding.gate} · {wedding.shortDateCompact} · {wedding.ceremonyTime}
            </div>
            <Barcode className="w-32 h-8 text-cream" />
          </div>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="max-w-2xl mx-auto bg-cream text-navy rounded-sm overflow-hidden shadow-2xl shadow-navy-deep/50"
        >
          {/* Pass header */}
          <div className="bg-navy-deep text-cream px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <PaperPlane className="w-6 h-6 text-gold shrink-0" />
              <div className="min-w-0">
                <div className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-gold truncate">{wedding.brand}</div>
                <div className="font-serif text-base sm:text-lg truncate">Boarding Pass · RSVP</div>
              </div>
            </div>
            <div className="font-sans text-[9px] sm:text-[10px] uppercase tracking-widest text-cream/70 text-right shrink-0">
              <div>FLT {wedding.flightNumber}</div>
              <div>{wedding.shortDateCompact}</div>
            </div>
          </div>

          {/* Route strip */}
          <div className="bg-sand/50 px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-navy/55">From</div>
              <div className="font-serif text-xl sm:text-2xl">{wedding.origin}</div>
            </div>
            <div className="text-gold flex-1 mx-2 sm:mx-4"><FlightArc className="w-full h-8 sm:h-10" /></div>
            <div className="text-right min-w-0">
              <div className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-navy/55">To</div>
              <div className="font-serif text-xl sm:text-2xl">{wedding.destination}</div>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-5">
            {!auth ? (
              <div className="rounded-md border border-gold/40 bg-gold/10 p-5 text-center space-y-3">
                <p className="font-serif text-navy/90 text-base">
                  Please check in to confirm your RSVP.
                </p>
                <p className="font-sans text-[12px] text-navy/65">
                  Enter your invitation code to unlock your seat reservation.
                </p>
                <a
                  href="/login?next=%2F%23rsvp"
                  className="inline-flex items-center justify-center gap-2 font-sans uppercase tracking-[0.3em] text-[10px] px-5 py-3 bg-navy-deep text-cream hover:bg-gold hover:text-navy transition-colors rounded-sm"
                >
                  <PaperPlane className="w-3.5 h-3.5" />
                  Begin check-in
                </a>
              </div>
            ) : (
              <>
                {/* Reservation summary */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-sand/40 border border-navy/15 rounded p-4">
                  <div>
                    <div className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">Passenger</div>
                    <div className="font-serif text-base sm:text-lg mt-1">
                      {auth.firstName} {auth.lastName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">Seats reserved</div>
                    <div className="font-serif text-xl sm:text-2xl mt-1">{auth.seatsReserved}</div>
                  </div>
                </div>

                <fieldset>
                  <legend className="font-sans uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[10px] text-navy/60 mb-2">
                    Are you boarding?
                  </legend>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 font-serif text-sm sm:text-base">
                    <label className="flex items-center gap-2 px-3 sm:px-4 py-3 border border-navy/30 rounded cursor-pointer hover:bg-sand/40 has-[:checked]:border-gold has-[:checked]:bg-gold/15">
                      <input
                        type="radio"
                        name="attending"
                        value="yes"
                        checked={attending === "yes"}
                        onChange={() => setAttending("yes")}
                        className="accent-gold"
                      />
                      Yes, we&apos;re flying
                    </label>
                    <label className="flex items-center gap-2 px-3 sm:px-4 py-3 border border-navy/30 rounded cursor-pointer hover:bg-sand/40 has-[:checked]:border-gold has-[:checked]:bg-gold/15">
                      <input
                        type="radio"
                        name="attending"
                        value="no"
                        checked={attending === "no"}
                        onChange={() => setAttending("no")}
                        className="accent-gold"
                      />
                      Sadly, no
                    </label>
                  </div>
                </fieldset>

                {attending === "yes" && cap > 1 && (
                  <fieldset>
                    <legend className="font-sans uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[10px] text-navy/60 mb-1">
                      Who is flying with you?
                    </legend>
                    <p className="font-sans text-[12px] text-navy/55 mb-3">
                      Name each companion and mark whether they&apos;re boarding.
                    </p>

                    <ul className="space-y-2">
                      {/* The guest themselves — always seat 1 */}
                      <li className="flex flex-col sm:flex-row sm:items-center gap-2 bg-sand/40 border border-navy/20 rounded px-3 py-2.5">
                        <span className="flex-1 font-serif text-base text-navy">
                          {auth.firstName} {auth.lastName}
                          <span className="ml-2 font-sans uppercase tracking-[0.2em] text-[9px] text-navy/45">
                            You
                          </span>
                        </span>
                        <span className="font-sans uppercase tracking-[0.2em] text-[10px] text-gold shrink-0">
                          Boarding
                        </span>
                      </li>

                      {companions.map((c, i) => (
                        <li
                          key={i}
                          className="flex flex-col sm:flex-row sm:items-center gap-2 border border-navy/20 rounded px-3 py-2.5"
                        >
                          <input
                            type="text"
                            value={c.name}
                            onChange={(e) => {
                              const v = e.target.value;
                              setCompanions((prev) =>
                                prev.map((p, idx) => (idx === i ? { ...p, name: v } : p)),
                              );
                            }}
                            placeholder={`Companion ${i + 1} — full name`}
                            aria-label={`Companion ${i + 1} name`}
                            className="flex-1 min-w-0 bg-white border border-navy/30 rounded px-3 py-2 font-serif text-base text-navy placeholder:text-navy/45 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
                          />
                          <div className="flex self-start shrink-0 rounded overflow-hidden border border-navy/25">
                            {([true, false] as const).map((val) => (
                              <button
                                key={String(val)}
                                type="button"
                                aria-pressed={c.attending === val}
                                onClick={() =>
                                  setCompanions((prev) =>
                                    prev.map((p, idx) =>
                                      idx === i ? { ...p, attending: val } : p,
                                    ),
                                  )
                                }
                                className={`px-3 py-2 font-sans uppercase tracking-[0.2em] text-[10px] transition-colors ${
                                  c.attending === val
                                    ? val
                                      ? "bg-gold text-navy"
                                      : "bg-navy-deep text-cream"
                                    : "bg-sand/50 text-navy/55 hover:bg-sand"
                                }`}
                              >
                                {val ? "Boarding" : "Not"}
                              </button>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-3 font-sans text-[12px] text-navy/60">
                      <span className="font-serif text-lg text-navy tabular-nums">
                        {seatsAttending}
                      </span>{" "}
                      of {cap} reserved seat{cap === 1 ? "" : "s"} boarding.
                    </p>
                  </fieldset>
                )}

                <label className="block">
                  <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">
                    Email <span className="text-navy/40 normal-case tracking-normal">(optional — for confirmation)</span>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="mt-1 w-full bg-sand/40 border border-navy/30 rounded px-3 py-2 font-serif focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
                  />
                </label>

                <label className="block">
                  <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">
                    Note for the captains <span className="text-navy/40 normal-case tracking-normal">(dietary, song requests, etc.)</span>
                  </span>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="mt-1 w-full bg-sand/40 border border-navy/30 rounded px-3 py-2 font-serif focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 resize-none"
                  />
                </label>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full font-sans uppercase tracking-[0.3em] text-[11px] px-6 py-4 bg-navy-deep text-cream hover:bg-gold hover:text-navy transition-colors disabled:opacity-60 shadow-lg shadow-navy-deep/30"
                >
                  {status === "submitting" ? "Reserving seat…" : "Confirm boarding ✈"}
                </button>

                {status === "error" && (
                  <p className="text-sm text-rouge font-serif">{error}</p>
                )}
              </>
            )}
          </div>

          {/* Bottom barcode strip */}
          <div className="bg-navy-deep text-cream px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between gap-3">
            <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-cream/60 truncate">
              Gate · {wedding.gate}
            </div>
            <Barcode className="w-24 sm:w-32 h-8 text-cream shrink-0" />
          </div>
        </form>
      )}
      </div>
    </section>
  );
}
