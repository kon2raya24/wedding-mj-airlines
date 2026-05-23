import { wedding } from "@/lib/config";
import { FloralDivider, PaperPlane } from "@/components/Decor";
import Reveal from "@/components/Reveal";

export default function Registry() {
  return (
    <section id="registry" className="relative section overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=2000&q=80')",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-cream/88 -z-10" aria-hidden />

      <div className="section-title">
        <p className="section-eyebrow">Help us pack for the journey</p>
        <h2 className="section-heading">Honeymoon Fund</h2>
        <FloralDivider className="mt-6" />
        <p className="max-w-xl mx-auto font-serif italic text-navy/75 text-lg mt-6">
          Your presence is the greatest gift. But if you'd like to send us off in style,
          a contribution to our travels is most appreciated.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {wedding.registry.map((r, i) => (
          <Reveal
            key={r.title}
            delay={i * 120}
            className="relative bg-cream border-2 border-dashed border-navy/30 rounded-sm p-7 text-center hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-xl"
          >
            {/* Luggage-tag string */}
            <div aria-hidden className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-6 bg-navy rounded-full" />
            <div aria-hidden className="absolute -top-9 left-1/2 -translate-x-1/2 w-px h-6 bg-navy" />

            <PaperPlane className="w-7 h-7 text-gold mx-auto mb-4" />
            <div className="font-mono uppercase tracking-[0.4em] text-[10px] text-navy/50 mb-2">
              Tag · {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="font-script text-4xl text-navy mb-3">{r.title}</h3>
            <p className="font-serif font-medium text-navy mb-3 break-words">{r.handle}</p>
            <p className="font-serif text-sm text-navy/70 italic">{r.note}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
