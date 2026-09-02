import { wedding } from "@/lib/config";
import { PaperPlane } from "@/components/Decor";

export default function Quote() {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center md:bg-fixed scale-105"
        style={{
          backgroundImage: `url('${wedding.quote.image}')`,
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy-deep/60 to-navy-deep/85" aria-hidden />

      <div className="relative z-10 max-w-4xl text-center px-4 sm:px-6 py-16 sm:py-24">
        <PaperPlane className="w-10 h-10 sm:w-12 sm:h-12 text-gold mx-auto mb-6 sm:mb-8 -rotate-12" />
        <blockquote className="font-serif italic text-cream text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
          {wedding.quote.text}
        </blockquote>
        <div className="mt-8 sm:mt-10 flex items-center justify-center gap-3 sm:gap-4 text-gold">
          <span className="h-px w-8 sm:w-12 bg-gold/70" />
          <span className="font-sans uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[10px] sm:text-[11px] text-center">
            {wedding.quote.author}
          </span>
          <span className="h-px w-8 sm:w-12 bg-gold/70" />
        </div>
      </div>
    </section>
  );
}
