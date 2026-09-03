import { wedding } from "@/lib/config";

type SvgProps = React.SVGProps<SVGSVGElement> & { className?: string };

export function PaperPlane({ className = "", style }: SvgProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} style={style} aria-hidden>
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
        J &amp; M
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
      {/* Static plane for reduced-motion; otherwise one glides the route. */}
      <g className="hidden motion-reduce:block" transform="translate(295, 18) rotate(20)">
        <path d="M0 8 L24 0 L18 22 L12 14 L0 8 Z" fill="currentColor" />
      </g>
      <g className="motion-reduce:hidden">
        <path
          d="M2 32 L62 4 L40 60 L30 38 L2 32 Z"
          fill="currentColor"
          transform="rotate(43) scale(0.42) translate(-32 -32)"
        >
          <animateMotion
            dur="9s"
            repeatCount="indefinite"
            rotate="auto"
            path="M20 90 Q 300 -30 580 90"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.45 0 0.55 1"
          />
        </path>
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
      <g className="motion-reduce:hidden">
        <path
          d="M2 32 L62 4 L40 60 L30 38 L2 32 Z"
          fill="currentColor"
          transform="rotate(43) scale(0.2) translate(-32 -32)"
        >
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            rotate="auto"
            path="M10 32 Q 100 -16 190 32"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.45 0 0.55 1"
          />
        </path>
      </g>
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
    <span className={`block ${className}`} style={{ transform: `rotate(${rotate}deg)` }} aria-hidden>
    <svg viewBox="0 0 160 160" className="stamp-in w-full h-full">
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
        {wedding.shortDateCompact.replace(",", "")}
      </text>
    </svg>
    </span>
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
    <div className={`flex items-center justify-center gap-3 text-silver ${className}`}>
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

// --- New UI icons -------------------------------------------------

export function MJLogo({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 120 60" className={className} fill="none" aria-hidden>
      <text
        x="2"
        y="44"
        fontFamily="var(--font-serif), serif"
        fontSize="42"
        fontWeight="500"
        letterSpacing="2"
        fill="currentColor"
      >
        J
      </text>
      <text
        x="52"
        y="44"
        fontFamily="var(--font-serif), serif"
        fontSize="42"
        fontWeight="300"
        fill="currentColor"
        opacity="0.5"
      >
        |
      </text>
      <text
        x="68"
        y="44"
        fontFamily="var(--font-serif), serif"
        fontSize="42"
        fontWeight="500"
        letterSpacing="2"
        fill="currentColor"
      >
        M
      </text>
      <g transform="translate(98, 14) rotate(-8)">
        <path d="M0 6 L18 0 L13 18 L9 11 L0 6 Z" fill="currentColor" opacity="0.85" />
      </g>
    </svg>
  );
}

export function CalendarIcon({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M8 3v4M16 3v4" />
    </svg>
  );
}

export function PinIcon({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z" />
      <circle cx="12" cy="9" r="2.6" />
    </svg>
  );
}

export function ClockIcon({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function GiftIcon({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="9" width="18" height="11" rx="1.5" />
      <path d="M3 13h18" />
      <path d="M12 9v11" />
      <path d="M12 9c-2 0-4-1.2-4-3a2 2 0 0 1 4 0 2 2 0 0 1 4 0c0 1.8-2 3-4 3Z" />
    </svg>
  );
}

export function CameraIcon({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 8h3l2-2h6l2 2h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.6" />
    </svg>
  );
}

export function UsersIcon({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="9" r="3.2" />
      <circle cx="17" cy="10" r="2.4" />
      <path d="M3 19c0-2.8 2.7-5 6-5s6 2.2 6 5" />
      <path d="M15 19c0-2 1.6-3.6 4-3.8" />
    </svg>
  );
}

export function ItineraryIcon({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 20 L11 9 L17 16 L21 4" />
      <circle cx="11" cy="9" r="1.6" fill="currentColor" />
      <circle cx="17" cy="16" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function HourglassIcon({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 3h12" />
      <path d="M6 21h12" />
      <path d="M7 3c0 5 5 6 5 9s-5 4-5 9" />
      <path d="M17 3c0 5-5 6-5 9s5 4 5 9" />
    </svg>
  );
}

export function PlayIcon({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

export function VideoIcon({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="6" width="14" height="12" rx="2" />
      <path d="M17 10l4-2v8l-4-2z" />
    </svg>
  );
}

export function FacebookIcon({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.93.26-1.56 1.6-1.56h1.7V4.27c-.3-.04-1.3-.13-2.46-.13-2.43 0-4.1 1.48-4.1 4.2v2.46H7.6V14h2.65v8h3.25Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" />
    </svg>
  );
}

export function TikTokIcon({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M16.6 3h-2.8v12.4a2.4 2.4 0 1 1-2.4-2.4v-2.8a5.2 5.2 0 1 0 5.2 5.2V8.7a6.4 6.4 0 0 0 4 1.4V7.3a3.7 3.7 0 0 1-2.8-1.2A3.7 3.7 0 0 1 16.6 3Z" />
    </svg>
  );
}

export function YouTubeIcon({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M22.5 7.2c-.25-1.4-1.3-2.46-2.7-2.7C17.6 4 12 4 12 4s-5.6 0-7.8.5C2.8 4.74 1.75 5.8 1.5 7.2 1 9.4 1 12 1 12s0 2.6.5 4.8c.25 1.4 1.3 2.46 2.7 2.7 2.2.5 7.8.5 7.8.5s5.6 0 7.8-.5c1.4-.24 2.45-1.3 2.7-2.7.5-2.2.5-4.8.5-4.8s0-2.6-.5-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

// Simple stylized QR-like pattern. Not a real QR code — purely decorative.
export function FakeQR({ className = "" }: SvgProps) {
  // deterministic pseudo-random pattern
  const cells: { x: number; y: number }[] = [];
  for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 21; x++) {
      const v = ((x * 31 + y * 17 + x * y) % 7) === 0 || ((x + y * 3) % 11) === 1;
      if (v) cells.push({ x, y });
    }
  }
  return (
    <svg viewBox="0 0 21 21" className={className} aria-hidden shapeRendering="crispEdges">
      <rect width="21" height="21" fill="white" />
      {/* corner finder squares */}
      {[
        { x: 0, y: 0 },
        { x: 14, y: 0 },
        { x: 0, y: 14 },
      ].map((p, i) => (
        <g key={i}>
          <rect x={p.x} y={p.y} width="7" height="7" fill="currentColor" />
          <rect x={p.x + 1} y={p.y + 1} width="5" height="5" fill="white" />
          <rect x={p.x + 2} y={p.y + 2} width="3" height="3" fill="currentColor" />
        </g>
      ))}
      {cells.map((c, i) => {
        const inCorner =
          (c.x < 8 && c.y < 8) ||
          (c.x > 12 && c.y < 8) ||
          (c.x < 8 && c.y > 12);
        if (inCorner) return null;
        return <rect key={i} x={c.x} y={c.y} width="1" height="1" fill="currentColor" />;
      })}
    </svg>
  );
}

// Hand-drawn underline that writes itself on (see .scribble-path in
// globals.css). Stretches to the width of whatever it sits under.
export function Scribble({ className = "" }: SvgProps) {
  return (
    <svg viewBox="0 0 320 24" fill="none" aria-hidden className={className} preserveAspectRatio="none">
      <path
        className="scribble-path"
        d="M4 14 C 60 4, 120 22, 180 10 S 280 8, 316 14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={1}
      />
      <path
        className="scribble-path scribble-path-2"
        d="M40 20 C 110 14, 200 24, 300 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        pathLength={1}
      />
    </svg>
  );
}
