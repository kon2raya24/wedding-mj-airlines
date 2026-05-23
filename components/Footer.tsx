import { wedding } from "@/lib/config";
import { Monogram, FloralDivider, PaperPlane, Barcode } from "@/components/Decor";

export default function Footer() {
  return (
    <footer className="relative bg-navy-deep text-cream py-20 px-6 text-center overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] [background:radial-gradient(circle_at_2px_2px,rgba(246,239,224,1)_1px,transparent_0)] [background-size:26px_26px]" aria-hidden />

      <Monogram className="w-20 h-20 mx-auto text-gold mb-6" />

      <p className="font-script text-6xl md:text-7xl mb-3">
        {wedding.brideFirst} &amp; {wedding.groomFirst}
      </p>
      <p className="font-mono uppercase tracking-[0.4em] text-[11px] text-cream/60 mb-1 flex items-center justify-center gap-3">
        <PaperPlane className="w-4 h-4 text-gold" />
        FLIGHT MJ1212 · 12.12.26 · MNL → ∞
      </p>

      <FloralDivider className="!text-gold/70 mt-8 mb-8" />

      <div className="font-serif italic text-cream/70 mb-3">
        Tag your inflight memories
      </div>
      <div className="font-script text-4xl text-gold mb-10">
        {wedding.hashtag}
      </div>

      <div className="flex justify-center gap-8 font-sans uppercase tracking-[0.4em] text-[10px] text-cream/70 mb-10">
        <a
          href={`https://instagram.com/${wedding.social.instagram.replace(/^@/, "")}`}
          className="hover:text-gold transition-colors"
        >
          Instagram
        </a>
        <span className="text-gold/40">·</span>
        <a href={wedding.social.spotifyPlaylist} className="hover:text-gold transition-colors">
          Cabin playlist
        </a>
      </div>

      <Barcode className="w-48 h-10 text-cream mx-auto opacity-80" />
      <p className="font-mono text-[9px] tracking-widest text-cream/40 mt-2">
        MARJORIE-AND-JOSEPH-12122026-MNL
      </p>

      <p className="font-serif italic text-cream/40 text-sm mt-12">
        Cleared for take-off · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
