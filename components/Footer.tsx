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
    <footer className="relative bg-navy-deep text-cream py-10 sm:py-12 border-t border-cream/10">
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
          <div className="font-script text-2xl text-gold">{wedding.hashtag}</div>
          <ul className="flex items-center gap-5 text-cream/85">
            <li>
              <a
                href={wedding.social.facebook}
                aria-label="Facebook"
                className="hover:text-gold transition-colors"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href={`https://instagram.com/${wedding.social.instagram.replace(/^@/, "")}`}
                aria-label="Instagram"
                className="hover:text-gold transition-colors"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href={wedding.social.tiktok}
                aria-label="TikTok"
                className="hover:text-gold transition-colors"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href={wedding.social.youtube}
                aria-label="YouTube"
                className="hover:text-gold transition-colors"
              >
                <YouTubeIcon className="w-5 h-5" />
              </a>
            </li>
          </ul>
        </div>

        {/* Right — copyright + contact */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="text-center md:text-right font-sans text-[11px] text-cream/55">
            <a
              href={`mailto:${wedding.contact.email}`}
              className="block font-sans uppercase tracking-[0.3em] text-[10px] text-cream/70 hover:text-gold transition-colors mb-1"
            >
              Need Help? Contact Us
            </a>
            © {new Date().getFullYear()} {wedding.brideFirst} &amp; {wedding.groomFirst}.
            <br />
            All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
