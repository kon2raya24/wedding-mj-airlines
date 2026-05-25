"use client";

import { useTransition } from "react";
import { wedding } from "@/lib/config";
import { useAuth } from "@/components/AuthProvider";
import { PaperPlane, UsersIcon } from "@/components/Decor";

export default function PassengerCheckIn() {
  const { session } = useAuth();
  const [pending, startTransition] = useTransition();

  function signOut() {
    startTransition(async () => {
      await fetch("/api/logout", { method: "POST" });
      window.location.href = "/login";
    });
  }

  if (!session) {
    // Middleware normally redirects unauthed visitors to /login, but if a
    // cookie expires mid-session we still want a clear way back instead of
    // a blank column.
    return (
      <section
        id="checkin"
        className="bg-navy-deep text-cream rounded-md p-6 sm:p-8 lg:p-10 shadow-2xl shadow-navy-deep/40 border border-cream/10 relative overflow-hidden h-full flex flex-col items-center justify-center text-center gap-5"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-cream/5 blur-2xl" aria-hidden />
        <div className="relative w-14 h-14 rounded-full bg-gold/15 grid place-items-center">
          <PaperPlane className="w-6 h-6 text-gold" />
        </div>
        <div className="relative">
          <p className="font-sans uppercase tracking-[0.3em] text-[10px] text-gold mb-2">
            Check in to continue
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-cream leading-tight">
            Welcome aboard
          </h2>
          <p className="font-serif italic text-cream/70 text-sm mt-3 max-w-sm mx-auto">
            Enter the name and code on your invitation to unlock your boarding pass and RSVP.
          </p>
        </div>
        <a
          href="/login?next=%2F%23checkin"
          className="relative inline-flex items-center justify-center gap-2 font-sans uppercase tracking-[0.3em] text-[11px] px-6 py-3.5 bg-gold text-navy-deep hover:bg-cream rounded-sm transition-colors"
        >
          <PaperPlane className="w-4 h-4" />
          Begin check-in
        </a>
      </section>
    );
  }

  return (
    <section
      id="checkin"
      className="bg-navy-deep text-cream rounded-md p-6 sm:p-8 lg:p-10 shadow-2xl shadow-navy-deep/40 border border-cream/10 relative overflow-hidden h-full flex flex-col"
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-cream/5 blur-2xl" aria-hidden />

      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gold/15 grid place-items-center shrink-0">
          <PaperPlane className="w-5 h-5 text-gold" />
        </div>
        <div>
          <p className="font-sans uppercase tracking-[0.3em] text-[10px] text-gold mb-1">
            Reservation confirmed
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-cream leading-tight">
            Welcome aboard, {session.firstName}!
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-cream/5 border border-cream/10 rounded-md p-4">
          <div className="font-sans uppercase tracking-[0.3em] text-[10px] text-cream/55">
            Passenger
          </div>
          <div className="font-serif text-lg sm:text-xl text-cream mt-1">
            {session.firstName} {session.lastName}
          </div>
          <div className="font-mono text-[10px] tracking-widest text-cream/50 mt-1">
            {session.code}
          </div>
        </div>
        <div className="bg-cream/5 border border-cream/10 rounded-md p-4">
          <div className="font-sans uppercase tracking-[0.3em] text-[10px] text-cream/55 flex items-center gap-2">
            <UsersIcon className="w-3.5 h-3.5 text-gold" />
            Seats reserved
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-cream mt-1 leading-none">
            {session.seatsReserved}
          </div>
          <div className="font-sans text-[11px] text-cream/55 mt-1">
            {session.seatsReserved === 1
              ? "Just you — solo flight."
              : `You + ${session.seatsReserved - 1} ${session.seatsReserved - 1 === 1 ? "companion" : "companions"}.`}
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
          onClick={signOut}
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 font-sans uppercase tracking-[0.3em] text-[11px] px-5 py-4 border border-cream/20 text-cream/70 hover:text-cream hover:border-cream/50 rounded-sm transition-colors disabled:opacity-50"
        >
          {pending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </section>
  );
}
