"use client";

import { useEffect, useRef, useState } from "react";
import { PlayIcon } from "@/components/Decor";

// "Watch the film": opens the full save-the-date video, with sound, in a
// cinema overlay. The trigger keeps the #prenup id so the nav link still lands.
export default function WatchFilm({
  src,
  poster,
  duration,
  title,
}: {
  src: string;
  poster: string;
  duration: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        id="prenup"
        onClick={() => setOpen(true)}
        className="btn-motion group inline-flex items-center gap-4 rounded-full border border-cream/40 pl-2 pr-6 py-2 text-cream hover:border-cream hover:bg-cream/10 scroll-mt-24"
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-cream text-navy-deep transition-transform duration-500 ease-out-expo group-hover:scale-110">
          <PlayIcon className="w-4 h-4 translate-x-px" />
        </span>
        <span className="text-left leading-tight">
          <span className="block font-sans uppercase tracking-[0.3em] text-[10px]">Watch the film</span>
          <span className="block font-mono text-[10px] tracking-[0.2em] text-cream/60 mt-0.5">
            Save the date · {duration}
          </span>
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] bg-navy-deep/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10 animate-fade-in-fast"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setOpen(false)}
        >
          <figure
            className="relative w-full max-w-6xl animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video w-full overflow-hidden rounded-md bg-black shadow-2xl ring-1 ring-cream/10">
              <video
                className="h-full w-full"
                src={src}
                poster={poster}
                controls
                autoPlay
                playsInline
                preload="metadata"
                aria-label={title}
              />
            </div>
            <figcaption className="mt-4 flex items-center justify-between font-mono uppercase tracking-[0.3em] text-[10px] text-cream/60">
              <span>{title}</span>
              <span>{duration}</span>
            </figcaption>
          </figure>
          <button
            ref={closeRef}
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full text-cream text-3xl font-sans leading-none grid place-items-center hover:bg-cream/10 hover:text-silver transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
