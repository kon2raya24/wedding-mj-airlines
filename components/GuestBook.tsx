"use client";

import { useState } from "react";
import { FloralDivider, PaperPlane } from "@/components/Decor";

type Entry = { name: string; message: string; from?: string };

const seed: Entry[] = [
  { name: "Lola Pacing", message: "Maraming bless sa inyong dalawa. Safe travels, mga anak.", from: "Manila" },
  { name: "Tito Ben", message: "From the day you met to today — what a beautiful itinerary. Bon voyage!", from: "Cebu" },
  { name: "Sarah", message: "Best layover crew ever. Can't wait to dance the night away with you both!", from: "Singapore" },
];

const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export default function GuestBook() {
  const [entries, setEntries] = useState<Entry[]>(seed);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setEntries((prev) => [
      { name: name.trim(), message: message.trim(), from: from.trim() || undefined },
      ...prev,
    ]);
    setName("");
    setMessage("");
    setFrom("");
  }

  return (
    <section id="guestbook" className="section">
      <div className="section-title">
        <p className="section-eyebrow">Send us a postcard</p>
        <h2 className="section-heading">Wish us safe travels</h2>
        <FloralDivider className="mt-6" />
      </div>

      <form
        onSubmit={submit}
        className="max-w-xl mx-auto bg-cream border border-navy/20 rounded-sm p-6 md:p-8 mb-14 relative grain"
      >
        <div className="absolute top-3 right-3 font-mono uppercase tracking-[0.3em] text-[9px] text-navy/40">
          POSTCARD · BLANK
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <label className="block">
            <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">From</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full bg-sand/40 border border-navy/30 rounded px-3 py-2 font-serif focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
            />
          </label>
          <label className="block">
            <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">City</span>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Manila, Tokyo…"
              className="mt-1 w-full bg-sand/40 border border-navy/30 rounded px-3 py-2 font-serif focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
            />
          </label>
        </div>
        <label className="block mb-4">
          <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            className="mt-1 w-full bg-sand/40 border border-navy/30 rounded px-3 py-2 font-serif focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 resize-none"
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center gap-2 font-sans uppercase tracking-[0.3em] text-[10px] px-6 py-3 bg-navy text-cream hover:bg-gold hover:text-navy transition-colors"
        >
          <PaperPlane className="w-4 h-4" />
          Send postcard
        </button>
      </form>

      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map((e, i) => (
          <article
            key={i}
            className={`relative bg-cream border border-navy/15 p-5 pt-12 shadow-md ${tilts[i % tilts.length]} hover:rotate-0 transition-transform duration-300`}
          >
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between font-mono uppercase tracking-[0.3em] text-[9px] text-navy/60 border-b border-navy/20 pb-2">
              <span>POSTCARD</span>
              <span>{e.from || "—"}</span>
            </div>
            {/* Faux stamp */}
            <div
              className="absolute top-3 right-3 w-10 h-12 bg-rouge/85 border border-rouge text-cream font-mono text-[8px] flex items-center justify-center"
              aria-hidden
            >
              MJ-1212
            </div>
            <p className="font-serif italic text-base text-navy/90 mb-3 mt-2">"{e.message}"</p>
            <p className="font-script text-2xl text-gold">— {e.name}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
