import { wedding } from "@/lib/config";
import {
  MJLogo,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/Decor";

export default function Footer() {
  return (
    <footer className="relative bg-navy/85 text-cream py-10 sm:py-12 border-t border-cream/10">
      {/* Closing beat — one big line before the small print. */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-12 sm:pt-10 sm:pb-16 mb-10 border-b border-cream/10 text-center">
        <p className="section-eyebrow !text-silver">Final call</p>
        <p className="section-heading !text-cream text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
          See you at the gate
        </p>
        <p className="font-sans uppercase tracking-[0.4em] text-[10px] text-cream/60 mt-6">
          {wedding.shortDate} · {wedding.destinationVenue}
        </p>
      </div>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Left — brand */}
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <MJLogo className="w-14 h-8 text-cream" />
          <div className="font-sans uppercase tracking-[0.3em] text-[9px] text-cream/70 leading-tight border-l border-cream/30 pl-3">
            Flight to
            <br />
            Forever
          </div>
        </div>

        {/* Center — hashtag + socials */}
        <div className="flex flex-col items-center gap-4">
          <div className="font-script text-2xl text-silver">{wedding.hashtag}</div>
          <ul className="flex items-center gap-5 text-cream/85">
            <li>
              <a
                href={wedding.social.facebook}
                aria-label="Facebook"
                className="block p-2.5 hover:text-silver transition-colors"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href={`https://instagram.com/${wedding.social.instagram.replace(/^@/, "")}`}
                aria-label="Instagram"
                className="block p-2.5 hover:text-silver transition-colors"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href={wedding.social.tiktok}
                aria-label="TikTok"
                className="block p-2.5 hover:text-silver transition-colors"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href={wedding.social.youtube}
                aria-label="YouTube"
                className="block p-2.5 hover:text-silver transition-colors"
              >
                <YouTubeIcon className="w-5 h-5" />
              </a>
            </li>
          </ul>
        </div>

        {/* Right — copyright + contact */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="text-center md:text-right font-sans text-[11px] text-cream/60">
            <a
              href={`mailto:${wedding.contact.email}`}
              className="block py-3 font-sans uppercase tracking-[0.3em] text-[10px] text-cream/70 hover:text-silver transition-colors"
            >
              Need Help? Contact Us
            </a>
            © {new Date().getFullYear()} {wedding.groomFirst} &amp; {wedding.brideFirst}.
            <br />
            All rights reserved.
          </div>
        </div>
      </div>

      {/* Flight strip — the small print, airline style. */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-10 pt-5 border-t border-cream/10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono uppercase tracking-[0.25em] text-[9px] text-cream/60">
        <span>{wedding.brand}</span>
        <span className="text-silver/60">✈</span>
        <span>FLT {wedding.flightNumber}</span>
        <span className="text-silver/60">✈</span>
        <span>{wedding.route.from} → {wedding.route.to}</span>
        <span className="text-silver/60">✈</span>
        <span>{wedding.shortDateCompact} · {wedding.boardingTime}</span>
        <span className="text-silver/60">✈</span>
        <span>Gate {wedding.gate} · Seat {wedding.seat}</span>
      </div>
    </footer>
  );
}
