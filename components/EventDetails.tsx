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
}: {
  event: Event;
  image: string;
  label: string;
  stamp: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="relative">
      <div className="relative bg-cream rounded-sm shadow-xl shadow-navy/10 border border-navy/10 overflow-hidden">
        {/* Top stamped strip */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-dashed border-navy/20 bg-sand/40 font-mono uppercase tracking-[0.3em] text-[10px] text-navy/70">
          <span>{label}</span>
          <span>{event.time}</span>
        </div>

        <div className="relative h-56 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url('${image}')` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream/40 via-transparent to-transparent" />
          <PassportStamp text={stamp} rotate={-10} className="absolute top-4 right-4 w-24 h-24 text-rouge/80" />
        </div>

        <div className="p-7">
          <h3 className="font-serif text-2xl text-navy mb-4">{event.title}</h3>

          <dl className="space-y-3 font-serif text-navy/85">
            <div className="grid grid-cols-[110px_1fr] gap-2 items-baseline">
              <dt className="font-sans uppercase tracking-[0.25em] text-[10px] text-navy/55">Terminal</dt>
              <dd>{event.venue}</dd>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-2 items-baseline">
              <dt className="font-sans uppercase tracking-[0.25em] text-[10px] text-navy/55">Address</dt>
              <dd>{event.address}</dd>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-2 items-baseline">
              <dt className="font-sans uppercase tracking-[0.25em] text-[10px] text-navy/55">Dress code</dt>
              <dd className="italic">{event.dressCode}</dd>
            </div>
          </dl>

          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 font-sans uppercase tracking-[0.3em] text-[10px] px-5 py-3 border border-navy text-navy hover:bg-navy hover:text-cream transition-colors"
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

      <div className="flex items-center justify-center gap-4 text-gold mb-10">
        <span className="font-mono uppercase tracking-[0.4em] text-[11px] text-navy">MNL</span>
        <FlightArcSmall className="w-32 h-6" />
        <span className="font-mono uppercase tracking-[0.4em] text-[11px] text-navy">MNL</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-10">
        <EventCard
          event={wedding.ceremony}
          image="https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80"
          label="Stop 1 · Ceremony"
          stamp="CEREMONY"
          delay={0}
        />
        <EventCard
          event={wedding.reception}
          image="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&q=80"
          label="Stop 2 · Reception"
          stamp="RECEPTION"
          delay={150}
        />
      </div>
    </section>
  );
}
