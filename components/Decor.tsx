type SvgProps = React.SVGProps<SVGSVGElement> & { className?: string };

export function PaperPlane({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <path
        d="M2 32 L62 4 L40 60 L30 38 L2 32 Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M30 38 L62 4"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
      <path
        d="M30 38 L36 50"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
    </svg>
  );
}

export function PaperPlaneOutline({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <path
        d="M2 32 L62 4 L40 60 L30 38 L2 32 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
      />
      <path d="M30 38 L62 4" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function Monogram({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 140 140" fill="none" aria-hidden className={className}>
      <circle cx="70" cy="70" r="65" stroke="currentColor" strokeWidth="1" />
      <circle cx="70" cy="70" r="58" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" />
      {/* compass ticks */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 24;
        const r1 = 60, r2 = i % 6 === 0 ? 50 : 55;
        const x1 = 70 + Math.cos(a) * r1;
        const y1 = 70 + Math.sin(a) * r1;
        const x2 = 70 + Math.cos(a) * r2;
        const y2 = 70 + Math.sin(a) * r2;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.6" />;
      })}
      <text x="70" y="40" textAnchor="middle" fontSize="8" fontFamily="var(--font-sans), sans-serif" fill="currentColor" letterSpacing="2">N</text>
      <text x="100" y="74" textAnchor="middle" fontSize="8" fontFamily="var(--font-sans), sans-serif" fill="currentColor" letterSpacing="2">E</text>
      <text x="70" y="108" textAnchor="middle" fontSize="8" fontFamily="var(--font-sans), sans-serif" fill="currentColor" letterSpacing="2">S</text>
      <text x="40" y="74" textAnchor="middle" fontSize="8" fontFamily="var(--font-sans), sans-serif" fill="currentColor" letterSpacing="2">W</text>
      <text x="70" y="83" textAnchor="middle" fontSize="34" fontFamily="var(--font-script), cursive" fill="currentColor">
        M &amp; J
      </text>
    </svg>
  );
}

export function FlightArc({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 600 120" fill="none" className={className} aria-hidden preserveAspectRatio="none">
      <path
        d="M20 90 Q 300 -30 580 90"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="20" cy="90" r="5" fill="currentColor" />
      <circle cx="580" cy="90" r="5" fill="currentColor" />
      <g transform="translate(295, 18) rotate(20)">
        <path d="M0 8 L24 0 L18 22 L12 14 L0 8 Z" fill="currentColor" />
      </g>
    </svg>
  );
}

export function FlightArcSmall({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 200 40" fill="none" className={className} aria-hidden>
      <path
        d="M10 32 Q 100 -16 190 32"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="3 5"
        fill="none"
      />
      <circle cx="10" cy="32" r="3" fill="currentColor" />
      <circle cx="190" cy="32" r="3" fill="currentColor" />
    </svg>
  );
}

export function PassportStamp({
  text = "BOARDING",
  className = "",
  rotate = -8,
}: {
  text?: string;
  className?: string;
  rotate?: number;
}) {
  const r = 60;
  const pathId = `stamp-${text.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg viewBox="0 0 160 160" className={className} style={{ transform: `rotate(${rotate}deg)` }} aria-hidden>
      <defs>
        <path id={pathId} d={`M 80 80 m -${r} 0 a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 -${r * 2} 0`} />
      </defs>
      <circle cx="80" cy="80" r="68" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle cx="80" cy="80" r="56" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" fill="none" />
      <text fontFamily="var(--font-sans), sans-serif" fontSize="14" fill="currentColor" letterSpacing="6" fontWeight="700">
        <textPath href={`#${pathId}`} startOffset="0%">
          {`${text} · ${text} · ${text} · `}
        </textPath>
      </text>
      <text
        x="80"
        y="78"
        textAnchor="middle"
        fontFamily="var(--font-serif), serif"
        fontSize="22"
        fontStyle="italic"
        fill="currentColor"
        letterSpacing="2"
      >
        APPROVED
      </text>
      <text
        x="80"
        y="98"
        textAnchor="middle"
        fontFamily="var(--font-sans), sans-serif"
        fontSize="10"
        fill="currentColor"
        letterSpacing="3"
      >
        12 DEC 2026
      </text>
    </svg>
  );
}

export function Barcode({ className = "" }: SvgProps) {
  const bars = "1212121121121211221121121221121121211212".split("");
  return (
    <svg viewBox="0 0 200 60" className={className} aria-hidden>
      {bars.map((w, i) => (
        <rect
          key={i}
          x={i * 4.6}
          y="4"
          width={Number(w)}
          height="52"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export function GlobeArc({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" aria-hidden>
      <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <ellipse cx="200" cy="200" rx="180" ry="60" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <ellipse cx="200" cy="200" rx="180" ry="120" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <ellipse cx="200" cy="200" rx="60" ry="180" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <ellipse cx="200" cy="200" rx="120" ry="180" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <path
        d="M40 240 Q 200 80 360 240"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeDasharray="5 6"
        fill="none"
      />
      <circle cx="40" cy="240" r="6" fill="currentColor" />
      <circle cx="360" cy="240" r="6" fill="currentColor" />
      <g transform="translate(190, 100) rotate(20)">
        <path d="M0 10 L30 0 L24 28 L16 18 L0 10 Z" fill="currentColor" />
      </g>
    </svg>
  );
}

// Legacy ornaments kept (still used in some sections)
export function Sprig({ className = "", flip = false }: SvgProps & { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 60"
      fill="none"
      aria-hidden
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M5 30 L195 30" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" strokeLinecap="round" />
      <circle cx="5" cy="30" r="3" fill="currentColor" />
      <circle cx="195" cy="30" r="3" fill="currentColor" />
    </svg>
  );
}

export function FloralDivider({ className = "" }: SvgProps) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold ${className}`}>
      <Sprig className="w-32 md:w-48 h-auto" />
      <PaperPlane className="w-5 h-5" />
      <Sprig className="w-32 md:w-48 h-auto" flip />
    </div>
  );
}

export function Bloom({ className = "" }: SvgProps) {
  return <GlobeArc className={className} />;
}

export function ArchTop({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className={className} aria-hidden>
      <path
        d="M0,120 L0,80 C 240,0 480,0 720,40 C 960,80 1200,80 1440,40 L1440,120 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ArchBottom({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className={className} aria-hidden>
      <path
        d="M0,0 L0,40 C 240,120 480,120 720,80 C 960,40 1200,40 1440,80 L1440,0 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CornerSprig({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      <path d="M0 0 L120 0 L120 24" stroke="currentColor" strokeWidth="1.2" />
      <path d="M0 0 L0 24" stroke="currentColor" strokeWidth="1.2" />
      <text x="12" y="60" fontFamily="var(--font-sans), sans-serif" fontSize="10" letterSpacing="2" fill="currentColor">M&amp;J</text>
    </svg>
  );
}
