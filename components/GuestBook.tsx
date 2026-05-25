"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/config";
import { FloralDivider, PaperPlane } from "@/components/Decor";

type Entry = {
  name: string;
  message: string;
  from?: string;
  submittedAt?: string;
};

const tilts = ["sm:-rotate-2", "sm:rotate-1", "sm:-rotate-1", "sm:rotate-2"];

export default function GuestBook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/guestbook", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { entries: [] }))
      .then((data) => {
        if (cancelled) return;
        setEntries(Array.isArray(data.entries) ? data.entries : []);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
          from: from.trim(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Server responded ${res.status}`);
      }
      const body = (await res.json()) as { entry: Entry };
      setEntries((prev) => [body.entry, ...prev]);
      setName("");
      setMessage("");
      setFrom("");
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
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
        className="max-w-xl mx-auto bg-cream border border-navy/20 rounded-sm p-5 sm:p-6 md:p-8 mb-12 sm:mb-14 relative grain"
      >
        <div className="absolute top-3 right-3 font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] text-navy/40">
          POSTCARD · BLANK
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-6 sm:mt-0">
          <label className="block">
            <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">From</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={80}
              className="mt-1 w-full bg-sand/40 border border-navy/30 rounded px-3 py-2 font-serif focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
            />
          </label>
          <label className="block">
            <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/60">City</span>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              maxLength={60}
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
            maxLength={600}
            rows={3}
            className="mt-1 w-full bg-sand/40 border border-navy/30 rounded px-3 py-2 font-serif focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 resize-none"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center gap-2 font-sans uppercase tracking-[0.3em] text-[10px] px-6 py-3 bg-navy text-cream hover:bg-gold hover:text-navy transition-colors disabled:opacity-60"
          >
            <PaperPlane className="w-4 h-4" />
            {status === "submitting" ? "Sending…" : "Send postcard"}
          </button>
          {status === "error" && (
            <p className="text-sm text-rouge font-serif">{error}</p>
          )}
        </div>
      </form>

      {loaded && entries.length === 0 ? (
        <p className="text-center font-serif italic text-navy/55">
          Be the first to leave us a postcard.
        </p>
      ) : (
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((e, i) => (
            <article
              key={`${e.submittedAt ?? "x"}-${i}`}
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
                {wedding.flightNumber}
              </div>
              <p className="font-serif italic text-base text-navy/90 mb-3 mt-2">&ldquo;{e.message}&rdquo;</p>
              <p className="font-script text-2xl text-gold">— {e.name}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
