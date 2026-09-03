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
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(() => setSent(false), 3200);
    return () => clearTimeout(t);
  }, [sent]);

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
      setSent(true);
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
        className="max-w-xl mx-auto bg-cream border border-navy/20 rounded-sm p-5 sm:p-6 md:p-8 mb-12 sm:mb-14 relative grain overflow-hidden"
      >
        <div className="airmail-edge absolute inset-x-0 top-0" aria-hidden />
        <div className="absolute top-5 left-5 sm:left-6 md:left-8 font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] text-navy/70">
          Par avion · Air mail
        </div>
        <div className="absolute top-5 right-5 sm:right-6 md:right-8 font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] text-navy/70">
          POSTCARD · BLANK
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-6">
          <label className="block">
            <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/70">From</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={80}
              className="field mt-1"
            />
          </label>
          <label className="block">
            <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/70">City</span>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              maxLength={60}
              placeholder="Manila, Tokyo…"
              className="field mt-1"
            />
          </label>
        </div>
        <label className="block mb-4">
          <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/70">Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            maxLength={600}
            rows={3}
            className="field mt-1 resize-none"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-motion inline-flex items-center gap-2 font-sans uppercase tracking-[0.3em] text-[10px] px-6 py-3 bg-navy-deep text-cream hover:bg-silver hover:text-navy hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <PaperPlane className="w-4 h-4" />
            {status === "submitting" ? "Sending…" : "Send postcard"}
          </button>
          {status === "error" && (
            <p className="text-sm text-rouge font-serif">{error}</p>
          )}
        </div>
      </form>

      {!loaded ? (
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="Loading postcards">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`bg-cream border border-navy/15 p-5 pt-12 shadow-md ${tilts[i % tilts.length]}`}>
              <div className="skeleton h-3 w-24 rounded-sm mb-5" />
              <div className="skeleton h-3 w-full rounded-sm mb-2" />
              <div className="skeleton h-3 w-5/6 rounded-sm mb-5" />
              <div className="skeleton h-5 w-28 rounded-sm" />
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <p className="text-center font-serif italic text-cream/60">
          Be the first to leave us a postcard.
        </p>
      ) : (
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((e, i) => (
            <article
              key={`${e.submittedAt ?? "x"}-${i}`}
              className={`relative bg-cream border border-navy/15 p-5 pt-14 shadow-md overflow-hidden ${tilts[i % tilts.length]} hover:rotate-0 hover:-translate-y-1 hover:shadow-xl transition-[transform,box-shadow] duration-500 ease-out-expo ${
                sent && i === 0 ? "animate-zoom-in" : ""
              }`}
            >
              <div className="airmail-edge absolute inset-x-0 top-0" aria-hidden />
              <div className="absolute top-4 left-3 right-3 flex items-center justify-between gap-3 pr-12 font-mono uppercase tracking-[0.3em] text-[9px] text-navy/70 border-b border-navy/20 pb-2">
                <span>POSTCARD</span>
                <span className="truncate">{e.from || "—"}</span>
              </div>
              {/* Faux stamp */}
              <div
                className="absolute top-4 right-3 w-10 h-12 bg-rouge/85 border border-rouge text-cream font-mono text-[8px] flex items-center justify-center"
                aria-hidden
              >
                {wedding.flightNumber}
              </div>
              <p className="font-serif italic text-base text-navy/90 mb-3 mt-2">&ldquo;{e.message}&rdquo;</p>
              <p className="font-script text-2xl text-navy-deep">— {e.name}</p>
            </article>
          ))}
        </div>
      )}

      {sent && (
        <div
          role="status"
          className="animate-toast fixed bottom-24 left-1/2 z-40 flex items-center gap-3 rounded-full bg-navy-deep text-cream pl-4 pr-5 py-3 shadow-2xl shadow-navy/40 border border-cream/10"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-sky/20">
            <PaperPlane className="w-3.5 h-3.5 text-sky" />
          </span>
          <span className="font-sans uppercase tracking-[0.25em] text-[10px]">Postcard sent</span>
        </div>
      )}
    </section>
  );
}
