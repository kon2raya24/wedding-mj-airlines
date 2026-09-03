"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Muted, looping background film over an always-present still. The still is
// the first paint (priority image); the film fades in over it once it has a
// frame, and never starts for reduced-motion users.
//
// `src` is the full-quality film (the original 1080p master). `lightSrc` is
// a smaller loop used on narrow screens and data-saver connections, where
// the extra megabytes would only slow the page down.
export default function HeroVideo({
  src,
  lightSrc,
  poster,
}: {
  src: string;
  lightSrc?: string;
  poster: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const narrow = window.matchMedia("(max-width: 1023px)").matches;
    setChosen(lightSrc && (narrow || saveData) ? lightSrc : src);
  }, [src, lightSrc]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !chosen) return;
    // Some browsers ignore the autoplay attribute after hydration.
    v.play().catch(() => {
      /* autoplay blocked — the poster stays, which is fine */
    });
  }, [chosen]);

  return (
    <>
      <Image
        src={poster}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
    {chosen && (
    <video
      ref={ref}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-out ${
        ready ? "opacity-100" : "opacity-0"
      }`}
      src={chosen}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      onPlaying={() => setReady(true)}
      onLoadedData={() => setReady(true)}
    />
    )}
    </>
  );
}
