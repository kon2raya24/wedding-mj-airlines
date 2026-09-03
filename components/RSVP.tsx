"use client";

import { useEffect, useRef, useState } from "react";
import { wedding } from "@/lib/config";
import type { Companion, RsvpEntry } from "@/lib/rsvp-types";
import { useAuth } from "@/components/AuthProvider";
import { FloralDivider, Barcode, FlightArc, PaperPlane } from "@/components/Decor";

type Status = "idle" | "submitting" | "success" | "error";

const CONFETTI_PIECES = Array.from({ length: 36 });

export default function RSVP() {
  const { session: auth } = useAuth();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  // The guest's existing answer, if they have already responded.
  // undefined = still checking, null = none on file.
  const [existing, setExisting] = useState<RsvpEntry | null | undefined>(undefined);
  // Guards against a fast double-click firing two requests before the
  // disabled state has rendered.
  const inFlight = useRef(false);

  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");

  // The companions travelling on this invitation are already named on the
  // guest list; the representative only marks who is boarding. Everyone
  // defaults to boarding.
  useEffect(() => {
    const names = auth?.companions ?? [];
    setCompanions((prev) => {
      if (prev.length === names.length && prev.every((c, i) => c.name === names[i])) return prev;
      return names.map((name) => ({ name, attending: prev.find((c) => c.name === name)?.attending ?? true }));
    });
  }, [auth]);

  // Look up any RSVP already on file for this guest.
  useEffect(() => {
    if (!auth) {
      setExisting(null);
      return;
    }
    let cancelled = false;
    fetch("/api/rsvp")
      .then((r) => (r.ok ? r.json() : { rsvp: null }))
      .then((d) => {
        if (!cancelled) setExisting(d.rsvp ?? null);
      })
      .catch(() => {
        if (!cancelled) setExisting(null);
      });
    return () => {
      cancelled = true;
    };
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
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus("submitting");
    setError(null);

    // Identity and seat count come from the signed session server-side,
    // so they are deliberately not sent here.
    const payload = {
      attending,
      companions: attending === "yes" ? companions : [],
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
      const data = await res.json().catch(() => ({}));

      if (res.status === 409 && data.alreadySubmitted) {
        // Somebody got in first — another tab, or a stale form.
        setExisting(data.rsvp ?? null);
        setStatus("idle");
        return;
      }
      if (!res.ok) {
        throw new Error(data.error || `Server responded ${res.status}`);
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      inFlight.current = false;
    }
  }

  const cap = auth?.seatsReserved ?? 1;

  return (
    <section id="rsvp" className="relative overflow-hidden">
      <div
        className="parallax-bg absolute inset-0 bg-cover bg-center -z-10 will-change-transform"
        style={{ backgroundImage: "url('/images/venue-aerial.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-navy/85 -z-10" aria-hidden />

      <div className="section">
      <div className="section-title">
        <p className="section-eyebrow !text-silver">Reserve your seat</p>
        <h2 className="section-heading !text-cream">Will you fly with us?</h2>
        <FloralDivider className="mt-6 !text-silver" />
        <p className="max-w-xl mx-auto font-serif italic text-cream/80 text-lg mt-6">
          Please confirm boarding by {wedding.rsvpCloseDate}. Limited cabin space.
        </p>
      </div>

      {status === "success" ? (
        <div className="max-w-xl mx-auto bg-cream text-navy rounded-sm overflow-hidden relative shadow-2xl shadow-navy-deep/60">
          <div className="bg-silver text-navy py-3 px-6 font-mono uppercase tracking-[0.3em] text-[10px] flex items-center justify-between">
            <span>★ CONFIRMED ★</span>
            <span>{wedding.flightNumber}</span>
          </div>
          <div className="p-10 text-center relative">
            <PaperPlane className="w-12 h-12 text-sky mx-auto mb-4" />
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
                      backgroundColor: ["#b9bec6", "#1c2940", "#b3a89b", "#8398b7"][i % 4],
                      animationDelay: `${(i % 12) * 0.12}s`,
                    }}
                  />
                ))}
            </div>
          </div>
          <div className="bg-navy-deep text-cream px-6 py-4 flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-widest text-cream/90">
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
              <PaperPlane className="w-6 h-6 text-sky shrink-0" />
              <div className="min-w-0">
                <div className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-silver-pale truncate">{wedding.brand}</div>
                <div className="font-serif text-base sm:text-lg truncate">Boarding Pass · RSVP</div>
              </div>
            </div>
            <div className="font-sans text-[9px] sm:text-[10px] uppercase tracking-widest text-cream/90 text-right shrink-0">
              <div>FLT {wedding.flightNumber}</div>
              <div>{wedding.shortDateCompact}</div>
            </div>
          </div>

          {/* Route strip */}
          <div className="bg-sand/50 px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-navy/70">From</div>
              <div className="font-serif text-xl sm:text-2xl">{wedding.origin}</div>
            </div>
            <div className="text-sky flex-1 mx-2 sm:mx-4"><FlightArc className="w-full h-8 sm:h-10" /></div>
            <div className="text-right min-w-0">
              <div className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-navy/70">To</div>
              <div className="font-serif text-xl sm:text-2xl">{wedding.destination}</div>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-5">
            {existing ? (
              <div className="rounded-md border border-sky/40 bg-sky/10 p-5 sm:p-6 space-y-4">
                <div className="text-center">
                  <p className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy-deep">
                    Already confirmed
                  </p>
                  <h3 className="font-script text-4xl sm:text-5xl text-navy mt-2">
                    {existing.attending === "yes" ? "You're on board!" : "Safe travels"}
                  </h3>
                </div>

                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-serif text-navy text-sm sm:text-base">
                  <dt className="font-sans uppercase tracking-[0.2em] text-[10px] text-navy/70 pt-1">
                    Passenger
                  </dt>
                  <dd>
                    {existing.firstName} {existing.lastName}
                  </dd>

                  <dt className="font-sans uppercase tracking-[0.2em] text-[10px] text-navy/70 pt-1">
                    Boarding
                  </dt>
                  <dd>
                    {existing.attending === "yes"
                      ? `${existing.seatsAttending} of ${existing.seatsReserved} seat${
                          existing.seatsReserved === 1 ? "" : "s"
                        }`
                      : "Sadly, no"}
                  </dd>

                  {existing.companions.length > 0 && (
                    <>
                      <dt className="font-sans uppercase tracking-[0.2em] text-[10px] text-navy/70 pt-1">
                        With you
                      </dt>
                      <dd>
                        <ul className="space-y-0.5">
                          {existing.companions.map((c, i) => (
                            <li key={i}>
                              {c.name}
                              {!c.attending && (
                                <span className="font-sans text-[11px] text-navy/70"> — not boarding</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </>
                  )}

                  {existing.note && (
                    <>
                      <dt className="font-sans uppercase tracking-[0.2em] text-[10px] text-navy/70 pt-1">
                        Your note
                      </dt>
                      <dd className="italic">{existing.note}</dd>
                    </>
                  )}
                </dl>

                <p className="font-serif italic text-navy/70 text-sm text-center pt-1">
                  Need to change something? Message {wedding.groomFirst} or{" "}
                  {wedding.brideFirst} and we&apos;ll update it for you.
                </p>
              </div>
            ) : !auth ? (
              <div className="rounded-md border border-sky/40 bg-sky/10 p-5 text-center space-y-3">
                <p className="font-serif text-navy/90 text-base">
                  Please check in to confirm your RSVP.
                </p>
                <p className="font-sans text-[12px] text-navy/70">
                  Enter your invitation code to unlock your seat reservation.
                </p>
                <a
                  href="/login?next=%2F%23rsvp"
                  className="btn-motion inline-flex items-center justify-center gap-2 font-sans uppercase tracking-[0.3em] text-[10px] px-5 py-3 bg-navy-deep text-cream hover:bg-silver hover:text-navy rounded-sm"
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
                    <div className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/70">Passenger</div>
                    <div className="font-serif text-base sm:text-lg mt-1">
                      {auth.firstName} {auth.lastName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/70">Seats reserved</div>
                    <div className="font-serif text-xl sm:text-2xl mt-1">{auth.seatsReserved}</div>
                  </div>
                </div>

                <fieldset>
                  <legend className="font-sans uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[10px] text-navy/70 mb-2">
                    Are you boarding?
                  </legend>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 font-serif text-sm sm:text-base">
                    <label className="flex items-center gap-2 px-3 sm:px-4 py-3 border border-navy/30 rounded cursor-pointer hover:bg-sand/40 has-[:checked]:border-sky has-[:checked]:bg-sky/15">
                      <input
                        type="radio"
                        name="attending"
                        value="yes"
                        checked={attending === "yes"}
                        onChange={() => setAttending("yes")}
                        className="accent-sky"
                      />
                      Yes, we&apos;re flying
                    </label>
                    <label className="flex items-center gap-2 px-3 sm:px-4 py-3 border border-navy/30 rounded cursor-pointer hover:bg-sand/40 has-[:checked]:border-sky has-[:checked]:bg-sky/15">
                      <input
                        type="radio"
                        name="attending"
                        value="no"
                        checked={attending === "no"}
                        onChange={() => setAttending("no")}
                        className="accent-sky"
                      />
                      Sadly, no
                    </label>
                  </div>
                </fieldset>

                {attending === "yes" && companions.length > 0 && (
                  <fieldset>
                    <legend className="font-sans uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[10px] text-navy/70 mb-1">
                      Who is flying with you?
                    </legend>
                    <p className="font-sans text-[12px] text-navy/70 mb-3">
                      These seats are reserved on your invitation. Tap to mark anyone who can&apos;t make it.
                    </p>

                    <ul className="space-y-2">
                      {/* The guest themselves — always seat 1 */}
                      <li className="flex flex-col sm:flex-row sm:items-center gap-2 bg-sand/40 border border-navy/20 rounded px-3 py-2.5">
                        <span className="flex-1 font-serif text-base text-navy">
                          {auth.firstName} {auth.lastName}
                          <span className="ml-2 font-sans uppercase tracking-[0.2em] text-[9px] text-navy/70">
                            You
                          </span>
                        </span>
                        <span className="font-sans uppercase tracking-[0.2em] text-[10px] text-navy-deep shrink-0">
                          Boarding
                        </span>
                      </li>

                      {companions.map((c, i) => (
                        <li
                          key={c.name}
                          className={`flex items-center gap-3 border rounded px-3 py-2.5 transition-colors ${
                            c.attending ? "border-navy/20 bg-white" : "border-navy/15 bg-sand/30"
                          }`}
                        >
                          <span className={`flex-1 min-w-0 font-serif text-base truncate transition-colors ${c.attending ? "text-navy" : "text-navy/70 line-through decoration-navy/30"}`}>
                            {c.name}
                            <span className="ml-2 font-sans uppercase tracking-[0.2em] text-[9px] text-navy/70 no-underline">
                              Seat {i + 2}
                            </span>
                          </span>
                          <div className="flex shrink-0 rounded overflow-hidden border border-navy/25" role="group" aria-label={`${c.name} boarding`}>
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
                                className={`px-3 py-3.5 font-sans uppercase tracking-[0.2em] text-[10px] transition-colors ${
                                  c.attending === val
                                    ? val
                                      ? "bg-silver text-navy"
                                      : "bg-navy-deep text-cream"
                                    : "bg-sand/50 text-navy/70 hover:bg-sand"
                                }`}
                              >
                                {val ? "Boarding" : "Not"}
                              </button>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-3 font-sans text-[12px] text-navy/70">
                      <span className="font-serif text-lg text-navy tabular-nums">
                        {seatsAttending}
                      </span>{" "}
                      of {cap} reserved seat{cap === 1 ? "" : "s"} boarding.
                    </p>
                  </fieldset>
                )}

                <label className="block">
                  <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/70">
                    Email <span className="text-navy/70 normal-case tracking-normal">(optional — for confirmation)</span>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="field mt-1"
                  />
                </label>

                <label className="block">
                  <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/70">
                    Note for the captains <span className="text-navy/70 normal-case tracking-normal">(dietary, song requests, etc.)</span>
                  </span>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="field mt-1 resize-none"
                  />
                </label>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-motion btn-shine w-full font-sans uppercase tracking-[0.3em] text-[11px] px-6 py-4 bg-navy-deep text-cream hover:bg-silver hover:text-navy hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0 shadow-lg shadow-navy-deep/30"
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
            <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-cream/90 truncate">
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
