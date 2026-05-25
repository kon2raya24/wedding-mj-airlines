import { wedding } from "@/lib/config";
import { FloralDivider, PassportStamp } from "@/components/Decor";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

const portraits = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
];

function CrewCard({
  name,
  role,
  rank,
  image,
}: {
  name: string;
  role: string;
  rank: string;
  image: string;
}) {
  return (
    <TiltCard className="group bg-cream border border-navy/15 rounded-sm overflow-hidden shadow-sm hover:shadow-2xl" max={8}>
      <div className="relative aspect-[4/5] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale-[40%] group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-110"
          style={{ backgroundImage: `url('${image}')` }}
          aria-hidden
        />
        <span className="absolute top-2 left-2 font-mono uppercase tracking-[0.3em] text-[9px] text-cream bg-navy/80 px-2 py-1">
          {rank}
        </span>
      </div>
      <div className="p-4 text-center">
        <div className="font-serif text-lg text-navy leading-tight">{name}</div>
        <div className="font-sans uppercase tracking-[0.3em] text-[10px] text-gold mt-1">
          {role}
        </div>
      </div>
    </TiltCard>
  );
}

export default function WeddingParty() {
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

      {/* Captain & First Officer (Bride & Groom) */}
      <Reveal className="grid md:grid-cols-2 gap-6 mb-14 max-w-4xl mx-auto">
        <div className="relative bg-navy text-cream rounded-sm overflow-hidden shadow-2xl shadow-navy-deep/40">
          <div className="aspect-[5/4] relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1525772764200-be829a350797?w=900&q=85')" }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
            <PassportStamp text="CAPTAIN" rotate={-8} className="absolute top-4 right-4 w-24 h-24 text-gold" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="font-mono uppercase tracking-[0.3em] text-[10px] text-gold">Captain</div>
              <div className="font-script text-5xl text-cream leading-none mt-1">{wedding.brideFirst}</div>
              <div className="font-serif italic text-cream/80 text-sm mt-1">{wedding.brideLast}</div>
            </div>
          </div>
        </div>
        <div className="relative bg-navy text-cream rounded-sm overflow-hidden shadow-2xl shadow-navy-deep/40">
          <div className="aspect-[5/4] relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85')" }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
            <PassportStamp text="FIRST OFFICER" rotate={8} className="absolute top-4 right-4 w-24 h-24 text-gold" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="font-mono uppercase tracking-[0.3em] text-[10px] text-gold">First Officer</div>
              <div className="font-script text-5xl text-cream leading-none mt-1">{wedding.groomFirst}</div>
              <div className="font-serif italic text-cream/80 text-sm mt-1">{wedding.groomLast}</div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Crew grid */}
      <div className="max-w-5xl mx-auto">
        <h3 className="text-center font-sans uppercase tracking-[0.5em] text-[11px] text-gold mb-8">
          The crew &amp; ground staff
        </h3>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[...wedding.party.bridesSide, ...wedding.party.groomsSide].map((m, i) => (
            <Reveal as="li" key={m.name} delay={i * 80}>
              <CrewCard
                name={m.name}
                role={m.role}
                rank={i < 4 ? "Cabin · A" : "Cabin · B"}
                image={portraits[i % portraits.length]}
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
