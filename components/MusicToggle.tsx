"use client";

import { useRef, useState } from "react";
import { wedding } from "@/lib/config";

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const src = wedding.music;

  async function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        // user gesture required or file missing — silently no-op
      }
    }
  }

  if (!src) return null;

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-ink/90 text-cream backdrop-blur shadow-lg flex items-center justify-center hover:bg-champagne transition-colors group"
      >
        <span className="font-script text-xl mr-px">♪</span>
        <span
          aria-hidden
          className={`absolute inset-0 rounded-full border border-champagne/50 ${
            playing ? "animate-ping" : ""
          }`}
        />
      </button>
    </>
  );
}
