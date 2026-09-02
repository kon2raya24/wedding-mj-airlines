import Image from "next/image";
import { wedding } from "@/lib/config";
import { FloralDivider } from "@/components/Decor";
import Reveal from "@/components/Reveal";

export default function AttireGuide() {
  return (
    <section id="attire" className="section">
      <div className="section-title">
        <p className="section-eyebrow">What to wear on board</p>
        <h2 className="section-heading">Wedding Attire Guide</h2>
        <FloralDivider className="mt-6" />
        <p className="max-w-xl mx-auto font-serif italic text-navy/75 text-lg mt-6">
          {wedding.attire.palette}
        </p>
      </div>

      <Reveal className="max-w-4xl mx-auto">
        <Image
          src={wedding.attire.image}
          alt="Illustration of the wedding party in dusty blue, navy and gray attire"
          width={1600}
          height={560}
          sizes="(max-width: 896px) 100vw, 896px"
          className="w-full h-auto rounded-sm border border-navy/15 shadow-sm bg-cream"
        />
      </Reveal>

      <div className="max-w-4xl mx-auto mt-10 grid sm:grid-cols-3 gap-5">
        {wedding.attire.roles.map((r, i) => (
          <Reveal
            key={r.role}
            delay={i * 100}
            className="bg-cream border border-navy/15 rounded-sm p-6 text-center shadow-sm"
          >
            <span
              aria-hidden
              className="block w-12 h-12 mx-auto rounded-full ring-1 ring-navy/20 shadow-sm"
              style={{ backgroundColor: r.hex }}
            />
            <h3 className="font-sans uppercase tracking-[0.3em] text-[10px] text-gold mt-5">
              {r.role}
            </h3>
            <p className="font-serif text-navy text-lg mt-2">{r.guidance}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
