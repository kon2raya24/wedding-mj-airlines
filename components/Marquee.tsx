import { wedding } from "@/lib/config";
import { PaperPlane } from "@/components/Decor";

export default function Marquee() {
  const phrase = ` Flight MJ1212 · ${wedding.brideFirst} & ${wedding.groomFirst} · Departing 12.12.26 · MNL → Forever · ${wedding.hashtag} · Now Boarding · `;
  return (
    <div className="bg-navy text-cream py-5 overflow-hidden border-y border-gold/30">
      <div className="flex animate-[scroll_42s_linear_infinite] gap-10 whitespace-nowrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="font-sans uppercase tracking-[0.25em] sm:tracking-[0.4em] text-xs sm:text-sm md:text-base shrink-0 flex items-center gap-6 sm:gap-8"
          >
            {phrase}
            <PaperPlane className="w-5 h-5 text-gold shrink-0" />
          </span>
        ))}
      </div>
      <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
