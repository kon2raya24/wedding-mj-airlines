import Link from "next/link";
import { wedding } from "@/lib/config";
import { PaperPlane, Barcode } from "@/components/Decor";

// "Flight not found": a wrong link lands at the gate desk, not on a blank page.
export default function NotFound() {
  return (
    <main className="grain relative min-h-[100svh] bg-navy-deep text-cream flex items-center justify-center px-4 py-16 overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,rgba(131,152,183,0.3),transparent_70%)]" />

      <div className="relative w-full max-w-lg">
        <p className="text-center font-mono uppercase tracking-[0.35em] text-[10px] text-cream/60 mb-6">
          {wedding.brand} · Gate desk
        </p>

        <div className="bg-cream text-navy rounded-2xl overflow-hidden shadow-[0_50px_100px_-30px_rgba(0,0,0,0.6)] ring-1 ring-cream/20">
          <div className="bg-navy-deep text-cream px-6 py-4 flex items-center justify-between font-mono uppercase tracking-[0.25em] text-[10px]">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rouge" />
              Flight not found
            </span>
            <span className="text-cream/60">Error 404</span>
          </div>

          <div className="px-6 sm:px-8 py-10 text-center">
            <PaperPlane className="w-10 h-10 text-sky mx-auto mb-5 rotate-45" />
            <h1 className="font-script text-6xl sm:text-7xl leading-none">Wrong gate</h1>
            <p className="mt-5 font-serif italic text-lg text-navy/75 max-w-sm mx-auto">
              This page isn&apos;t on the departure board. Let&apos;s get you back to flight{" "}
              {wedding.flightNumber}.
            </p>
            <Link
              href="/"
              className="btn-motion mt-8 inline-flex items-center justify-center gap-2 font-sans uppercase tracking-[0.3em] text-[11px] px-7 py-4 bg-navy-deep text-cream rounded-full hover:bg-silver hover:text-navy shadow-lg shadow-navy-deep/30"
            >
              <PaperPlane className="w-4 h-4" />
              Return to gate
            </Link>
          </div>

          <div className="perforation text-silver/60 mx-6" />
          <div className="bg-navy-deep text-cream px-6 py-3 flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/60">
              {wedding.groomFirst} &amp; {wedding.brideFirst} · {wedding.shortDateCompact}
            </span>
            <Barcode className="w-24 h-7 text-cream shrink-0" />
          </div>
        </div>
      </div>
    </main>
  );
}
