import { wedding } from "@/lib/config";
import { FloralDivider, PassportStamp } from "@/components/Decor";
import Reveal from "@/components/Reveal";

function NamePanel({
  label,
  names,
  delay,
}: {
  label: string;
  names: string[];
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="bg-cream border border-navy/15 rounded-sm p-6 shadow-sm">
      <h4 className="font-sans uppercase tracking-[0.3em] text-[10px] text-gold mb-4">
        {label}
      </h4>
      <ul className="space-y-1.5 font-serif text-navy text-base sm:text-lg">
        {names.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </Reveal>
  );
}

export default function WeddingParty() {
  const { parents, principalSponsors, secondarySponsors } = wedding.party;

  return (
    <section id="party" className="relative section">
      <div className="section-title">
        <p className="section-eyebrow">Cabin Crew</p>
        <h2 className="section-heading">The Crew</h2>
        <FloralDivider className="mt-6" />
        <p className="max-w-xl mx-auto font-serif italic text-navy/70 text-lg mt-6">
          Meet the wonderful humans helping us take flight on {wedding.shortDate}.
        </p>
      </div>

      {/* Captain & First Officer (Groom & Bride) */}
      <Reveal className="grid sm:grid-cols-2 gap-6 mb-14 max-w-4xl mx-auto">
        <div className="relative bg-navy-deep text-cream rounded-sm overflow-hidden shadow-2xl shadow-navy-deep/40 p-8 sm:p-10">
          <PassportStamp text="CAPTAIN" rotate={-8} className="absolute top-4 right-4 w-24 h-24 text-gold/70" />
          <div className="font-mono uppercase tracking-[0.3em] text-[10px] text-gold">Captain</div>
          <div className="font-script text-5xl text-cream leading-none mt-2">{wedding.groomFirst}</div>
          <div className="font-serif italic text-cream/80 text-sm mt-1">{wedding.groomLast}</div>
        </div>
        <div className="relative bg-navy-deep text-cream rounded-sm overflow-hidden shadow-2xl shadow-navy-deep/40 p-8 sm:p-10">
          <PassportStamp text="FIRST OFFICER" rotate={8} className="absolute top-4 right-4 w-24 h-24 text-gold/70" />
          <div className="font-mono uppercase tracking-[0.3em] text-[10px] text-gold">First Officer</div>
          <div className="font-script text-5xl text-cream leading-none mt-2">{wedding.brideFirst}</div>
          <div className="font-serif italic text-cream/80 text-sm mt-1">{wedding.brideLast}</div>
        </div>
      </Reveal>

      {/* Parents */}
      <div className="max-w-4xl mx-auto mb-14">
        <h3 className="text-center font-sans uppercase tracking-[0.5em] text-[11px] text-gold mb-8">
          With the blessing of our parents
        </h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <NamePanel label={parents.groom.label} names={parents.groom.names} delay={0} />
          <NamePanel label={parents.bride.label} names={parents.bride.names} delay={100} />
        </div>
      </div>

      {/* Principal sponsors */}
      <div className="max-w-4xl mx-auto mb-14">
        <h3 className="text-center font-sans uppercase tracking-[0.5em] text-[11px] text-gold mb-8">
          Principal Sponsors
        </h3>
        <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
          {principalSponsors.map((p, i) => (
            <Reveal
              as="li"
              key={`${p.name}-${i}`}
              delay={i * 60}
              className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-3 font-serif text-navy text-base sm:text-lg border-b border-dashed border-gold/40 pb-2"
            >
              <span>{p.name}</span>
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-navy/45">&amp;</span>
              <span className="text-right">{p.partner}</span>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Secondary sponsors */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-center font-sans uppercase tracking-[0.5em] text-[11px] text-gold mb-8">
          Secondary Sponsors
        </h3>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {secondarySponsors.map((s, i) => (
            <Reveal
              as="li"
              key={s.task}
              delay={i * 60}
              className="bg-cream border border-navy/15 rounded-sm p-5 shadow-sm"
            >
              <div className="font-sans uppercase tracking-[0.3em] text-[10px] text-gold mb-3">
                {s.task}
              </div>
              <ul className="space-y-1 font-serif text-navy text-base">
                {s.names.map((n, j) => (
                  <li key={`${n}-${j}`}>{n}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
