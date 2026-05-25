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
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-dashed border-navy/20 bg-sand/40 font-mono uppercase tracking-[0.18em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] text-navy/70">
          <span className="truncate">{label}</span>
          <span className="shrink-0">{event.time}</span>
        </div>

        <div className="relative h-48 sm:h-56 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url('${image}')` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream/40 via-transparent to-transparent" />
          <PassportStamp text={stamp} rotate={-10} className="absolute top-3 right-3 sm:top-4 sm:right-4 w-20 h-20 sm:w-24 sm:h-24 text-rouge/80" />
        </div>

        <div className="p-5 sm:p-7">
          <h3 className="font-serif text-xl sm:text-2xl text-navy mb-4">{event.title}</h3>

          <dl className="space-y-3 font-serif text-navy/85 text-sm sm:text-base">
            <div className="grid grid-cols-[88px_1fr] sm:grid-cols-[110px_1fr] gap-2 items-baseline">
              <dt className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] text-navy/55">Terminal</dt>
              <dd className="break-words">{event.venue}</dd>
            </div>
            <div className="grid grid-cols-[88px_1fr] sm:grid-cols-[110px_1fr] gap-2 items-baseline">
              <dt className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] text-navy/55">Address</dt>
              <dd className="break-words">{event.address}</dd>
            </div>
            <div className="grid grid-cols-[88px_1fr] sm:grid-cols-[110px_1fr] gap-2 items-baseline">
              <dt className="font-sans uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] text-navy/55">Dress code</dt>
              <dd className="italic break-words">{event.dressCode}</dd>
            </div>
          </dl>

          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 sm:mt-7 inline-flex items-center gap-2 font-sans uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[10px] px-4 sm:px-5 py-3 border border-navy text-navy hover:bg-navy-deep hover:text-cream transition-colors"
          >
            Get directions →
          </a>

          <div className="mt-5 sm:mt-6 aspect-[16/9] rounded overflow-hidden border border-navy/15 bg-sand/30">
            <iframe
              title={`${event.title} map`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(event.address)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
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

      <div className="flex items-center justify-center gap-3 sm:gap-4 text-gold mb-8 sm:mb-10">
        <span className="font-mono uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-[11px] text-navy">MNL</span>
        <FlightArcSmall className="w-24 sm:w-32 h-6" />
        <span className="font-mono uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-[11px] text-navy">ALF</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
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
