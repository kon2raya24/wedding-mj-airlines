import { wedding } from "@/lib/config";
import { FloralDivider, PassportStamp, PaperPlane } from "@/components/Decor";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

function Wings({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" fill="currentColor" className={className} aria-hidden>
      <path d="M60 22 L2 6 c18 4 30 12 40 18 Z" opacity="0.9" />
      <path d="M60 22 L118 6 c-18 4 -30 12 -40 18 Z" opacity="0.9" />
      <path d="M60 14 l6 8 -6 12 -6 -12 Z" />
      <path d="M2 6 c14 0 28 4 40 12" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M118 6 c-14 0 -28 4 -40 12" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  );
}

function Epaulette({ bars }: { bars: number }) {
  return (
    <div className="flex flex-col gap-1" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} className="block h-1 w-14 bg-silver rounded-sm shadow-[0_0_8px_rgba(185,190,198,0.45)]" />
      ))}
    </div>
  );
}

function PilotCard({
  role,
  first,
  last,
  bars,
  stamp,
  rotate,
  delay,
}: {
  role: string;
  first: string;
  last: string;
  bars: number;
  stamp: string;
  rotate: number;
  delay: number;
}) {
  return (
    <Reveal delay={delay} variant={rotate < 0 ? "left" : "right"}>
      <TiltCard className="h-full" max={5}>
        <div className="grain relative h-full min-h-[300px] bg-navy-deep text-cream rounded-2xl overflow-hidden shadow-[0_40px_80px_-30px_rgba(28,41,64,0.6)] ring-1 ring-cream/10 p-8 sm:p-10 flex flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(185,190,198,0.18),transparent_60%)]" aria-hidden />
          <PassportStamp text={stamp} rotate={rotate} className="absolute top-5 right-5 w-24 h-24 sm:w-28 sm:h-28 text-silver/70" />

          <div className="relative flex items-start justify-between gap-4">
            <Epaulette bars={bars} />
            <div className="font-mono uppercase tracking-[0.3em] text-[9px] text-cream/90 text-right">
              {wedding.brand}
              <br />
              Flight deck
            </div>
          </div>

          <div className="relative mt-10">
            <div className="font-mono uppercase tracking-[0.35em] text-[10px] text-silver-pale">{role}</div>
            <div className="font-script text-6xl sm:text-7xl leading-[0.9] mt-3">{first}</div>
            <div className="font-serif italic text-lg mt-2">{last}</div>
          </div>

          <div className="relative mt-auto pt-8 flex items-end justify-between gap-4">
            <Wings className="w-24 h-8 text-silver" />
            <div className="font-mono uppercase tracking-[0.25em] text-[9px] text-cream/90 text-right leading-relaxed">
              Licence · Forever
              <br />
              Base · {wedding.route.to}
            </div>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

function CrewBadge({ role, names, delay }: { role: string; names: string[]; delay: number }) {
  return (
    <Reveal delay={delay} className="relative pt-10">
      {/* Lanyard + clip */}
      <span aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-[3px] bg-gradient-to-b from-navy-deep to-navy-deep/70" />
      <span aria-hidden className="absolute top-8 left-1/2 -translate-x-1/2 h-3 w-8 rounded-sm bg-navy-deep ring-1 ring-cream/40" />
      <div className="relative bg-cream rounded-xl ring-1 ring-navy/15 shadow-[0_24px_50px_-28px_rgba(28,41,64,0.5)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-2.5 bg-navy-deep text-cream font-mono uppercase tracking-[0.3em] text-[9px]">
          <span>Cabin crew</span>
          <PaperPlane className="w-3.5 h-3.5 text-sky" />
        </div>
        <div className="px-6 py-6">
          <div className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy-deep">{role}</div>
          <ul className="mt-3 space-y-1.5">
            {names.map((n, i) => (
              <li key={n} className="flex items-baseline justify-between gap-4 font-serif text-navy text-xl">
                <span>{n}</span>
                <span className="font-mono text-[9px] tracking-[0.25em] text-navy/70">CREW {String(i + 1).padStart(2, "0")}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="perforation text-navy/20 mx-6" />
        <div className="px-6 py-3 font-mono uppercase tracking-[0.25em] text-[9px] text-navy/70 flex justify-between">
          <span>{wedding.flightNumber}</span>
          <span>{wedding.shortDateCompact}</span>
        </div>
      </div>
    </Reveal>
  );
}

function ParentsCard({ label, names, group, delay }: { label: string; names: string[]; group: number; delay: number }) {
  return (
    <Reveal delay={delay} className="glass relative rounded-xl p-6 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <h4 className="font-sans uppercase tracking-[0.3em] text-[10px] text-silver">{label}</h4>
        <span className="font-mono uppercase tracking-[0.25em] text-[9px] text-cream/60 border border-cream/20 rounded-full px-2.5 py-1">
          Priority boarding · Group {group}
        </span>
      </div>
      <ul className="mt-4 space-y-1.5 font-serif text-cream text-lg sm:text-xl">
        {names.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </Reveal>
  );
}

export default function WeddingParty() {
  const { officiant, parents, attendants, principalSponsors, secondarySponsors } = wedding.party;

  return (
    <section id="party" className="relative section">
      <div className="section-title">
        <p className="section-eyebrow">Cabin Crew</p>
        <h2 className="section-heading">The Crew</h2>
        <FloralDivider className="mt-6" />
        <p className="max-w-xl mx-auto font-serif italic text-cream/70 text-lg mt-6">
          Meet the wonderful humans helping us take flight on {wedding.shortDate}.
        </p>
      </div>

      {/* Flight deck */}
      <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto mb-20">
        <PilotCard role="Captain" first={wedding.groomFirst} last={wedding.groomLast} bars={4} stamp="CAPTAIN" rotate={-8} delay={0} />
        <PilotCard role="First Officer" first={wedding.brideFirst} last={wedding.brideLast} bars={3} stamp="FIRST OFFICER" rotate={8} delay={120} />
      </div>

      {/* Air traffic control */}
      <Reveal className="max-w-5xl mx-auto mb-20">
        <div className="glass relative overflow-hidden rounded-xl">
          <div className="airmail-edge absolute inset-x-0 top-0" aria-hidden />
          <div className="grid md:grid-cols-[auto_1fr_auto] items-center gap-6 px-6 sm:px-8 py-7">
            <div className="font-mono uppercase tracking-[0.3em] text-[10px] text-silver">
              Air traffic control
              <div className="text-cream/60 mt-1">Cleared for landing</div>
            </div>
            <p className="font-serif text-cream text-2xl sm:text-3xl">{officiant}</p>
            <div className="font-mono uppercase tracking-[0.25em] text-[9px] text-cream/60 md:text-right">
              Officiating minister
              <br />
              Tower · {wedding.gate}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Parents */}
      <div className="max-w-5xl mx-auto mb-20">
        <h3 className="text-center font-sans uppercase tracking-[0.5em] text-[11px] text-silver mb-8">
          With the blessing of our parents
        </h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <ParentsCard label={parents.groom.label} names={parents.groom.names} group={1} delay={0} />
          <ParentsCard label={parents.bride.label} names={parents.bride.names} group={1} delay={100} />
        </div>
      </div>

      {/* Best men & maids of honor */}
      <div className="max-w-5xl mx-auto mb-20">
        <h3 className="text-center font-sans uppercase tracking-[0.5em] text-[11px] text-silver mb-2">
          Standing beside us
        </h3>
        <p className="text-center font-mono uppercase tracking-[0.3em] text-[9px] text-cream/60 mb-8">
          Cabin crew · Doors to manual
        </p>
        <div className="grid sm:grid-cols-2 gap-8">
          {attendants.map((a, i) => (
            <CrewBadge key={a.role} role={a.role} names={a.names} delay={i * 100} />
          ))}
        </div>
      </div>

      {/* Principal sponsors — manifest */}
      <div className="max-w-5xl mx-auto mb-20">
        <h3 className="text-center font-sans uppercase tracking-[0.5em] text-[11px] text-silver mb-2">
          Principal Sponsors
        </h3>
        <p className="text-center font-mono uppercase tracking-[0.3em] text-[9px] text-cream/60 mb-8">
          Passenger manifest · First class
        </p>
        <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-3">
          {principalSponsors.map((p, i) => (
            <Reveal
              as="li"
              key={`${p.name}-${i}`}
              delay={i * 60}
              className="grid grid-cols-[auto_1fr_auto_1fr] items-baseline gap-3 font-serif text-cream text-lg sm:text-xl border-b border-dashed border-silver/30 pb-2"
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-cream/60 w-8">{String(i + 1).padStart(2, "0")}A</span>
              <span>{p.name}</span>
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-cream/60">&amp;</span>
              <span className="text-right">{p.partner}</span>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Secondary sponsors — crew tasks */}
      <div className="max-w-5xl mx-auto">
        <h3 className="text-center font-sans uppercase tracking-[0.5em] text-[11px] text-silver mb-8">
          Secondary Sponsors
        </h3>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {secondarySponsors.map((s, i) => (
            <Reveal
              as="li"
              key={s.task}
              delay={i * 60}
              className="glass rounded-xl p-6 hover:-translate-y-1 hover:bg-white/[0.07] transition-[transform,box-shadow] duration-500 ease-out-expo"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-sans uppercase tracking-[0.3em] text-[10px] text-silver">{s.task}</div>
                <div className="font-mono uppercase tracking-[0.25em] text-[9px] text-cream/60">
                  Crew · {String(i + 1).padStart(2, "0")}
                </div>
              </div>
              <ul className="space-y-1 font-serif text-cream text-lg">
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
