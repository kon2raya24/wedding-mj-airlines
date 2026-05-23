"use client";

import { useState } from "react";
import { FloralDivider, Barcode, FlightArc, PaperPlane } from "@/components/Decor";

type Status = "idle" | "submitting" | "success" | "error";

const CONFETTI_PIECES = Array.from({ length: 36 });

export default function RSVP() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section id="rsvp" className="relative section overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=2000&q=80')",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-navy/90 -z-10" aria-hidden />

      <div className="section-title">
        <p className="section-eyebrow !text-gold">Reserve your seat</p>
        <h2 className="section-heading !text-cream">Will you fly with us?</h2>
        <FloralDivider className="mt-6 !text-gold" />
        <p className="max-w-xl mx-auto font-serif italic text-cream/80 text-lg mt-6">
          Please confirm boarding by November 1, 2026. Limited cabin space.
        </p>
      </div>

      {status === "success" ? (
        <div className="max-w-xl mx-auto bg-cream text-navy rounded-sm overflow-hidden relative shadow-2xl shadow-navy-deep/60">
          <div className="bg-gold text-navy py-3 px-6 font-mono uppercase tracking-[0.3em] text-[10px] flex items-center justify-between">
            <span>★ CONFIRMED ★</span>
            <span>MJ1212</span>
          </div>
          <div className="p-10 text-center relative">
            <PaperPlane className="w-12 h-12 text-gold mx-auto mb-4" />
            <h3 className="font-script text-6xl text-navy mb-3">You're on board!</h3>
            <p className="font-serif text-lg text-navy/80 max-w-md mx-auto">
              Your seat has been reserved. We'll see you at the gate on December 12.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60 hover:text-gold"
            >
              Add another passenger
            </button>
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              {CONFETTI_PIECES.map((_, i) => (
                <span
                  key={i}
                  className="absolute top-0 w-2 h-3 animate-confetti"
                  style={{
                    left: `${(i * 2.8) % 100}%`,
                    backgroundColor: ["#c89b3c", "#0e2a47", "#a23a2a", "#7aa9c9"][i % 4],
                    animationDelay: `${(i % 12) * 0.12}s`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="bg-navy text-cream px-6 py-4 flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-widest text-cream/60">
              MNL · 12 DEC 2026 · 14:00
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
          <div className="bg-navy text-cream px-6 md:px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PaperPlane className="w-6 h-6 text-gold" />
              <div>
                <div className="font-mono uppercase tracking-[0.3em] text-[10px] text-gold">M&amp;J Airlines</div>
                <div className="font-serif text-lg">Boarding Pass · RSVP</div>
              </div>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-cream/70 text-right">
              <div>FLT MJ1212</div>
              <div>12.12.26</div>
            </div>
          </div>

          {/* Route strip */}
          <div className="bg-sand/50 px-6 md:px-8 py-5 flex items-center justify-between">
            <div>
              <div className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/55">From</div>
              <div className="font-serif text-2xl">MNL</div>
            </div>
            <div className="text-gold flex-1 mx-4"><FlightArc className="w-full h-10" /></div>
            <div className="text-right">
              <div className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/55">To</div>
              <div className="font-serif text-2xl">∞</div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-5">
            <label className="block">
              <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">Passenger name</span>
              <input
                type="text"
                name="name"
                required
                className="mt-1 w-full bg-sand/40 border border-navy/30 rounded px-3 py-2 font-serif focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
              />
            </label>

            <label className="block">
              <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">Email</span>
              <input
                type="email"
                name="email"
                required
                className="mt-1 w-full bg-sand/40 border border-navy/30 rounded px-3 py-2 font-serif focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
              />
            </label>

            <fieldset>
              <legend className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60 mb-2">
                Are you boarding?
              </legend>
              <div className="grid grid-cols-2 gap-3 font-serif">
                <label className="flex items-center gap-2 px-4 py-3 border border-navy/30 rounded cursor-pointer hover:bg-sand/40 has-[:checked]:border-gold has-[:checked]:bg-gold/15">
                  <input type="radio" name="attending" value="yes" required defaultChecked className="accent-gold" />
                  Yes, I'm flying
                </label>
                <label className="flex items-center gap-2 px-4 py-3 border border-navy/30 rounded cursor-pointer hover:bg-sand/40 has-[:checked]:border-gold has-[:checked]:bg-gold/15">
                  <input type="radio" name="attending" value="no" className="accent-gold" />
                  Sadly, no
                </label>
              </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">Seats</span>
                <input
                  type="number"
                  name="seats"
                  min={0}
                  max={6}
                  defaultValue={1}
                  className="mt-1 w-full bg-sand/40 border border-navy/30 rounded px-3 py-2 font-serif focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
                />
              </label>
              <label className="block">
                <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">Meal</span>
                <select
                  name="meal"
                  defaultValue="standard"
                  className="mt-1 w-full bg-sand/40 border border-navy/30 rounded px-3 py-2 font-serif focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
                >
                  <option value="standard">Standard</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="gluten-free">Gluten-free</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">
                Note for the captains (optional)
              </span>
              <textarea
                name="note"
                rows={3}
                className="mt-1 w-full bg-sand/40 border border-navy/30 rounded px-3 py-2 font-serif focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 resize-none"
              />
            </label>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full font-sans uppercase tracking-[0.3em] text-[11px] px-6 py-4 bg-navy text-cream hover:bg-gold hover:text-navy transition-colors disabled:opacity-60 shadow-lg shadow-navy-deep/30"
            >
              {status === "submitting" ? "Reserving seat…" : "Confirm boarding ✈"}
            </button>

            {status === "error" && (
              <p className="text-sm text-rouge font-serif">{error}</p>
            )}
          </div>

          {/* Bottom barcode strip */}
          <div className="bg-navy text-cream px-6 md:px-8 py-4 flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-widest text-cream/60">
              GATE · SAN AGUSTIN · MNL
            </div>
            <Barcode className="w-32 h-8 text-cream" />
          </div>
        </form>
      )}
    </section>
  );
}
