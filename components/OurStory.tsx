import { wedding } from "@/lib/config";
import { FloralDivider, GlobeArc } from "@/components/Decor";
import Reveal from "@/components/Reveal";
import RouteMap from "@/components/RouteMap";

export default function OurStory() {
  return (
    <section id="story" className="relative section overflow-clip [timeline-scope:--story]">
      <GlobeArc className="absolute -top-20 -right-20 w-[420px] h-[420px] text-cream/10" />
      <GlobeArc className="absolute -bottom-32 -left-20 w-[360px] h-[360px] text-silver/10" />

      <div className="relative section-title">
        <p className="section-eyebrow">Flight Log</p>
        <h2 className="section-heading">Our Itinerary</h2>
        <FloralDivider className="mt-6" />
        <p className="max-w-xl mx-auto font-serif italic text-cream/70 text-lg mt-6">
          Every great love is really a great trip. Here is ours, stop by stop.
        </p>
      </div>

      <div className="relative grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-20 items-start">
        {/* Pinned route map — the plane advances as the legs scroll by. */}
        <div className="lg:sticky lg:top-28">
          <RouteMap />
        </div>

        {/* The legs. This list is the scroll timeline the map listens to. */}
        <ol className="[view-timeline-name:--story] divide-y divide-dashed divide-silver/40">
          {wedding.story.map((s, i) => (
            <Reveal as="li" key={i} delay={i * 130} className="story-focus py-10 first:pt-0 lg:py-14 lg:first:pt-2">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-mono font-bold text-cream text-2xl sm:text-3xl leading-none whitespace-nowrap">
                  {s.code}
                </span>
                <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-silver">
                  <span className="font-mono text-cream/60 mr-2">Leg {String(i + 1).padStart(2, "0")}</span>
                  {s.year}
                </span>
                <span className="sm:ml-auto font-serif italic text-sm text-cream/60">{s.city}</span>
              </div>

              <h3 className="font-script text-4xl sm:text-5xl md:text-6xl text-cream mt-5 mb-4 leading-[1.05]">{s.title}</h3>
              <p className="font-serif text-lg sm:text-xl md:text-2xl text-cream/80 leading-relaxed max-w-2xl">
                <span className="float-left font-script text-6xl sm:text-7xl text-silver mr-3 leading-[0.7] mt-2">
                  {s.body.charAt(0)}
                </span>
                {s.body.slice(1)}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
