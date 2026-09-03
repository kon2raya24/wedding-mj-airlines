import { wedding } from "@/lib/config";
import { FloralDivider, PaperPlane } from "@/components/Decor";
import Reveal from "@/components/Reveal";

export default function Travel() {
  return (
    <section id="travel" className="section">
      <div className="section-title">
        <p className="section-eyebrow">Where to lay your head</p>
        <h2 className="section-heading">Accommodations</h2>
        <FloralDivider className="mt-6" />
      </div>

      <div
        className={`grid gap-6 mx-auto ${
          wedding.travel.length > 1 ? "md:grid-cols-3" : "max-w-md"
        }`}
      >
        {wedding.travel.map((h, i) => (
          <Reveal
            key={h.name}
            delay={i * 120}
            className="glass relative rounded-xl overflow-hidden hover:-translate-y-1 transition-[transform,box-shadow] duration-500 ease-out-expo shadow-sm hover:shadow-xl"
          >
            {/* Top luggage-tag strip */}
            <div className="bg-silver text-navy px-5 py-3 flex items-center justify-between font-mono uppercase tracking-[0.3em] text-[10px]">
              <span>{`HOTEL · ${String(i + 1).padStart(2, "0")}`}</span>
              <PaperPlane className="w-4 h-4" />
            </div>
            <div className="p-7">
              <h3 className="font-serif text-2xl text-cream mb-1 leading-tight">{h.name}</h3>
              <p className="font-sans uppercase tracking-[0.3em] text-[10px] text-cream/60 mb-4">
                {h.distance}
              </p>
              <p className="font-serif text-cream/80">{h.note}</p>
              {h.link && h.link !== "#" && (
                <a
                  href={h.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 font-sans uppercase tracking-[0.3em] text-[10px] text-silver hover:text-cream transition-colors"
                >
                  Reserve a room →
                </a>
              )}
            </div>
            <div className="px-7 pb-5">
              <div className="dotline text-cream/25" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
