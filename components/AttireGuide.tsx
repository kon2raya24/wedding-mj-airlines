import Image from "next/image";
import { wedding } from "@/lib/config";
import { FloralDivider } from "@/components/Decor";
import Reveal from "@/components/Reveal";

function Swatches({ colors }: { colors: string[] }) {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden>
      {colors.map((c) => (
        <span key={c} className="h-5 w-5 rounded-full ring-1 ring-cream/30 shadow-sm" style={{ backgroundColor: c }} />
      ))}
    </div>
  );
}

function GroupHeading({ title, cabin }: { title: string; cabin: string }) {
  return (
    <div className="text-center">
      <p className="font-mono uppercase tracking-[0.3em] text-[9px] text-cream/60">Cabin · {cabin}</p>
      <h3 className="mt-2 font-serif font-semibold uppercase tracking-[0.18em] text-xl sm:text-2xl text-cream">{title}</h3>
    </div>
  );
}

function DressCodeLines({ ladies, gentlemen }: { ladies: string; gentlemen: string }) {
  return (
    <dl className="mt-4 space-y-1 text-center font-serif text-cream/85 text-base sm:text-lg">
      <div>
        <dt className="inline font-semibold text-cream">Ladies: </dt>
        <dd className="inline">{ladies}</dd>
      </div>
      <div>
        <dt className="inline font-semibold text-cream">Gentlemen: </dt>
        <dd className="inline">{gentlemen}</dd>
      </div>
    </dl>
  );
}

// The illustrated line-up for a group. It steps up into place as it scrolls
// in (.lineup-figure) and stands on a soft pool of light so the figures read
// as standing on the floor rather than floating on the navy.
function Lineup({ src, alt, className = "", index = 0, fit = "width" }: { src: string; alt: string; className?: string; index?: number; fit?: "width" | "height" }) {
  // fit="height": portrait groups scale to the box height so a tall couple
  // never spills into the block below; fit="width": wide rows fill the box.
  const img = fit === "height" ? "h-full w-auto max-w-full" : "h-auto w-full";
  return (
    <div className={`lineup-figure relative mx-auto flex justify-center ${className}`} style={{ "--k": index } as React.CSSProperties}>
      <div
        aria-hidden
        className="absolute inset-x-[8%] bottom-0 h-10 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(185,190,198,0.28),transparent_70%)] blur-md"
      />
      <Image src={src} alt={alt} width={1200} height={1000} sizes="(min-width: 1024px) 560px, (min-width: 640px) 80vw, 92vw" className={`relative object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.45)] ${img}`} />
    </div>
  );
}

export default function AttireGuide() {
  const { groups, guests } = wedding.attire;
  return (
    <section id="attire" className="section">
      <div className="section-title">
        <p className="section-eyebrow">What to wear on board · Cabin classes</p>
        <h2 className="section-heading">Wedding Attire Guide</h2>
        <FloralDivider className="mt-6" />
        <p className="max-w-xl mx-auto font-serif italic text-cream/70 text-lg mt-6">{wedding.attire.palette}</p>
      </div>

      {/* Sponsors and entourage side by side */}
      <div className="grid md:grid-cols-2 gap-14 md:gap-10 lg:gap-16 items-start">
        {groups.map((g, i) => (
          <Reveal key={g.name} delay={i * 120} className="flex flex-col items-center">
            <GroupHeading title={g.name} cabin={g.cabin} />
            <DressCodeLines ladies={g.ladies} gentlemen={g.gentlemen} />
            <div className="mt-5">
              <Swatches colors={g.swatches} />
            </div>
            <Lineup src={g.image} alt={`${g.name} attire: ${g.ladies}; ${g.gentlemen}`} className="mt-8 h-[300px] sm:h-[380px] md:h-[440px] w-full" index={i} fit="height" />
          </Reveal>
        ))}
      </div>

      {/* Guests */}
      <Reveal className="mt-20 flex flex-col items-center">
        <GroupHeading title="Guests" cabin={guests.cabin} />
        <p className="mt-5 max-w-2xl text-center font-serif text-cream/85 text-lg sm:text-xl leading-relaxed">
          {guests.note}
        </p>
        <div className="mt-6">
          <Swatches colors={wedding.motif.map((m) => m.hex)} />
        </div>
        <Lineup src={guests.image} alt="Guest attire in dusty blue, navy, silver and warm gray" className="mt-8 w-full max-w-4xl" index={2} />
      </Reveal>
    </section>
  );
}
