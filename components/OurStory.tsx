import { wedding } from "@/lib/config";
import { FloralDivider, FlightArcSmall, GlobeArc } from "@/components/Decor";
import Reveal from "@/components/Reveal";

export default function OurStory() {
  return (
    <section id="story" className="relative section overflow-hidden">
      <GlobeArc className="absolute -top-20 -right-20 w-[420px] h-[420px] text-navy/8" />
      <GlobeArc className="absolute -bottom-32 -left-20 w-[360px] h-[360px] text-gold/10" />

      <div className="relative section-title">
        <p className="section-eyebrow">Flight Log</p>
        <h2 className="section-heading">Our Itinerary</h2>
        <FloralDivider className="mt-6" />
        <p className="max-w-xl mx-auto font-serif italic text-navy/70 text-lg mt-6">
          Every great love is really a great trip. Here is ours, stop by stop.
        </p>
      </div>

      <ol className="relative mx-auto max-w-4xl">
        {wedding.story.map((s, i) => (
          <Reveal as="li" key={i} delay={i * 130} className="relative">
            <div className={`grid md:grid-cols-[190px_1fr] gap-4 md:gap-10 items-start py-8 sm:py-10 ${i !== wedding.story.length - 1 ? "border-b border-dashed border-gold/40" : ""}`}>
              {/* Left: airport code + year */}
              <div className="md:text-right">
                <div
                  className={`font-mono font-bold text-navy leading-none whitespace-nowrap ${
                    s.code.length <= 2
                      ? "text-4xl sm:text-5xl md:text-6xl"
                      : "text-2xl sm:text-3xl"
                  }`}
                >
                  {s.code}
                </div>
                <div className="font-sans uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px] text-gold mt-2">
                  {s.year}
                </div>
                <div className="font-serif italic text-sm text-navy/60 mt-1">{s.city}</div>
              </div>

              {/* Right: card */}
              <div className="relative">
                <FlightArcSmall className="absolute -top-3 -left-2 w-16 h-6 text-gold/70 hidden md:block" />
                <h3 className="font-script text-3xl sm:text-4xl md:text-5xl text-navy mb-3">{s.title}</h3>
                <p className="font-serif text-base sm:text-lg md:text-xl text-navy/80 leading-relaxed max-w-2xl">
                  <span className="float-left font-script text-5xl sm:text-6xl text-gold mr-2 sm:mr-3 leading-[0.7] mt-2">
                    {s.body.charAt(0)}
                  </span>
                  {s.body.slice(1)}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
