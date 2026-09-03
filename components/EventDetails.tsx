import { wedding } from "@/lib/config";
import { FloralDivider, PassportStamp, FlightArcSmall } from "@/components/Decor";
import Reveal from "@/components/Reveal";

type Event = typeof wedding.ceremony;

function EventCard({
  event,
  image,
  label,
  stamp,
  delay,
  variant,
}: {
  event: Event;
  image: string;
  label: string;
  stamp: string;
  delay: number;
  variant: "left" | "right";
}) {
  return (
    <Reveal delay={delay} variant={variant} className="relative">
      <div className="glass group relative rounded-xl overflow-hidden transition-shadow duration-500 hover:shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)]">
        {/* Top stamped strip */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-dashed border-cream/15 bg-white/5 font-mono uppercase tracking-[0.18em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-cream/70">
          <span className="truncate">{label}</span>
          <span className="shrink-0">{event.time}</span>
        </div>

        <div className="img-reveal relative h-48 sm:h-56 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[1200ms] ease-out-expo group-hover:scale-110"
            style={{ backgroundImage: `url('${image}')` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
          <PassportStamp text={stamp} rotate={-10} className="absolute top-3 right-3 sm:top-4 sm:right-4 w-20 h-20 sm:w-24 sm:h-24 text-rouge/80" />
        </div>

        <div className="p-5 sm:p-7">
          <h3 className="font-serif text-xl sm:text-2xl text-cream mb-4">{event.title}</h3>

          <dl className="space-y-3 font-serif text-cream/85 text-sm sm:text-base">
            <div className="grid grid-cols-[88px_1fr] sm:grid-cols-[110px_1fr] gap-2 items-baseline">
              <dt className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] text-cream/60">Terminal</dt>
              <dd className="break-words">{event.venue}</dd>
            </div>
            <div className="grid grid-cols-[88px_1fr] sm:grid-cols-[110px_1fr] gap-2 items-baseline">
              <dt className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] text-cream/60">Address</dt>
              <dd className="break-words">{event.address}</dd>
            </div>
            <div className="grid grid-cols-[88px_1fr] sm:grid-cols-[110px_1fr] gap-2 items-baseline">
              <dt className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] text-cream/60">Dress code</dt>
              <dd className="italic break-words">{event.dressCode}</dd>
            </div>
          </dl>

          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-motion mt-6 sm:mt-7 inline-flex items-center gap-2 font-sans uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[10px] px-4 sm:px-5 py-3 border border-cream/40 text-cream hover:bg-cream hover:text-navy hover:border-cream"
          >
            Get directions →
          </a>
        </div>
      </div>
    </Reveal>
  );
}

export default function EventDetails() {
  return (
    <section id="details" className="section">
      <div className="section-title">
        <p className="section-eyebrow">Two stops, one destination</p>
        <h2 className="section-heading">Where we land</h2>
        <FloralDivider className="mt-6" />
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-4 text-silver mb-8 sm:mb-10">
        <span className="font-mono uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-[11px] text-cream">{wedding.route.from}</span>
        <FlightArcSmall className="w-24 sm:w-32 h-6" />
        <span className="font-mono uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-[11px] text-cream">{wedding.route.to}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
        <EventCard
          event={wedding.ceremony}
          image={wedding.ceremony.image}
          label="Stop 1 · Ceremony"
          stamp="CEREMONY"
          delay={0}
          variant="left"
        />
        <EventCard
          event={wedding.reception}
          image={wedding.reception.image}
          label="Stop 2 · Reception"
          stamp="RECEPTION"
          delay={150}
          variant="right"
        />
      </div>
    </section>
  );
}
