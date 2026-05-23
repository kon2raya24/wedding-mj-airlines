"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/config";
import { GuestAuth, clearAuth, readAuth, writeAuth } from "@/lib/auth";
import { findGuest } from "@/lib/guests";
import {
  PaperPlane,
  HourglassIcon,
  CalendarIcon,
  UsersIcon,
} from "@/components/Decor";

type Status = "idle" | "checking" | "error";

export default function PassengerCheckIn() {
  const [auth, setAuth] = useState<GuestAuth | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    setAuth(readAuth());
    const sync = () => setAuth(readAuth());
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!firstName.trim() || !code.trim()) return;
    setStatus("checking");
    window.setTimeout(() => {
      const guest = findGuest(firstName, lastName, code);
      if (guest) {
        writeAuth(guest);
        setAuth({ ...guest, checkedInAt: Date.now() });
        setStatus("idle");
      } else {
        setStatus("error");
      }
    }, 400);
  }

  function signOut() {
    clearAuth();
    setAuth(null);
    setFirstName("");
    setLastName("");
    setCode("");
    // Reload so the LoginGate re-engages.
    window.location.reload();
  }

  return (
    <section
      id="checkin"
      className="bg-navy-deep text-cream rounded-md p-6 sm:p-8 lg:p-10 shadow-2xl shadow-navy-deep/40 border border-cream/10 relative overflow-hidden h-full flex flex-col"
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-cream/5 blur-2xl" aria-hidden />

      {auth ? (
        <InvitationSummary auth={auth} onSignOut={signOut} />
      ) : (
        <form onSubmit={onSubmit} className="space-y-4 flex-1 flex flex-col">
          <div className="flex items-start gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-cream/10 grid place-items-center shrink-0">
              <HourglassIcon className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-cream leading-tight">
                Passenger Check-in
              </h2>
              <p className="font-sans text-sm text-cream/70 mt-1">
                Please locate your reservation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-cream/65">
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
                className="mt-1.5 w-full bg-cream/5 border border-cream/20 rounded px-3 py-2.5 font-serif text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
              />
            </label>
            <label className="block">
              <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-cream/65">
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
                className="mt-1.5 w-full bg-cream/5 border border-cream/20 rounded px-3 py-2.5 font-serif text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
              />
            </label>
          </div>

          <label className="block">
            <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-cream/65">
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
              className={`mt-1.5 w-full bg-cream/5 border rounded px-3 py-2.5 font-mono uppercase tracking-[0.25em] text-cream placeholder:text-cream/30 placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-1 ${
                status === "error"
                  ? "border-rouge focus:border-rouge focus:ring-rouge/40"
                  : "border-cream/20 focus:border-gold focus:ring-gold/40"
              }`}
            />
          </label>

          <button
            type="submit"
            disabled={status === "checking"}
            className="w-full inline-flex items-center justify-center gap-3 font-sans uppercase tracking-[0.3em] text-[11px] px-6 py-4 bg-cream/10 hover:bg-gold hover:text-navy-deep text-cream rounded-sm transition-colors disabled:opacity-60 border border-cream/15"
          >
            <PaperPlane className="w-4 h-4" />
            {status === "checking" ? "Finding…" : "Find reservation"}
          </button>

          {status === "error" && (
            <p className="font-sans text-[12px] text-rouge">
              We couldn&apos;t find that reservation. Double-check your invitation card.
            </p>
          )}

          <div className="mt-auto pt-4 flex items-center gap-2 text-cream/55 font-sans text-[11px]">
            <CalendarIcon className="w-3.5 h-3.5 text-gold" />
            Check-in will close on {wedding.rsvpCloseDate}
          </div>
        </form>
      )}
    </section>
  );
}

function InvitationSummary({
  auth,
  onSignOut,
}: {
  auth: GuestAuth;
  onSignOut: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gold/15 grid place-items-center shrink-0">
          <PaperPlane className="w-5 h-5 text-gold" />
        </div>
        <div>
          <p className="font-sans uppercase tracking-[0.3em] text-[10px] text-gold mb-1">
            Reservation confirmed
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-cream leading-tight">
            Welcome aboard, {auth.firstName}!
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-cream/5 border border-cream/10 rounded-md p-4">
          <div className="font-sans uppercase tracking-[0.3em] text-[10px] text-cream/55">
            Passenger
          </div>
          <div className="font-serif text-lg sm:text-xl text-cream mt-1">
            {auth.firstName} {auth.lastName}
          </div>
          <div className="font-mono text-[10px] tracking-widest text-cream/50 mt-1">
            {auth.code}
          </div>
        </div>
        <div className="bg-cream/5 border border-cream/10 rounded-md p-4">
          <div className="font-sans uppercase tracking-[0.3em] text-[10px] text-cream/55 flex items-center gap-2">
            <UsersIcon className="w-3.5 h-3.5 text-gold" />
            Seats reserved
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-cream mt-1 leading-none">
            {auth.seatsReserved}
          </div>
          <div className="font-sans text-[11px] text-cream/55 mt-1">
            {auth.seatsReserved === 1
              ? "Just you — solo flight."
              : `You + ${auth.seatsReserved - 1} ${auth.seatsReserved - 1 === 1 ? "companion" : "companions"}.`}
          </div>
        </div>
      </div>

      <p className="font-serif italic text-cream/75 text-sm sm:text-base leading-relaxed mb-6">
        Your invitation has been issued. Please confirm whether you can join us by{" "}
        <span className="text-gold not-italic font-sans uppercase tracking-widest text-xs">
          {wedding.rsvpCloseDate}
        </span>
        .
      </p>

      <div className="mt-auto flex flex-col sm:flex-row gap-3">
        <a
          href="#rsvp"
          className="flex-1 inline-flex items-center justify-center gap-2 font-sans uppercase tracking-[0.3em] text-[11px] px-6 py-4 bg-gold text-navy-deep hover:bg-cream rounded-sm transition-colors"
        >
          <PaperPlane className="w-4 h-4" />
          Confirm RSVP
        </a>
        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center justify-center gap-2 font-sans uppercase tracking-[0.3em] text-[11px] px-5 py-4 border border-cream/20 text-cream/70 hover:text-cream hover:border-cream/50 rounded-sm transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
