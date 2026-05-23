import { PaperPlane } from "@/components/Decor";

export default function Quote() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=2000&q=85')",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy/60 to-navy-deep/85" aria-hidden />

      <div className="relative z-10 max-w-4xl text-center px-6 py-24">
        <PaperPlane className="w-12 h-12 text-gold mx-auto mb-8 -rotate-12" />
        <blockquote className="font-serif italic text-cream text-3xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
          We travel not to escape life, <br className="hidden md:block" />
          but for life not to escape us.
        </blockquote>
        <div className="mt-10 flex items-center justify-center gap-4 text-gold">
          <span className="h-px w-12 bg-gold/70" />
          <span className="font-sans uppercase tracking-[0.5em] text-[11px]">
            Anonymous · for two travelers in love
          </span>
          <span className="h-px w-12 bg-gold/70" />
        </div>
      </div>
    </section>
  );
}
