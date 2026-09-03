import { wedding } from "@/lib/config";

// Stop positions along the route, in SVG user units (viewBox 0 0 600 520).
const STOPS = [
  { x: 70, y: 430 },
  { x: 215, y: 315 },
  { x: 300, y: 120 },
  { x: 440, y: 235 },
  { x: 530, y: 410 },
];
const ROUTE =
  "M70 430 Q140 340 215 315 Q285 285 300 120 Q330 30 440 235 Q505 340 530 410";

// A pinned map of the couple's legs. The plane, the silver trail and the stop
// lights are all driven by the `--story` view timeline declared on the list
// of stories (see OurStory.tsx), so they advance as the guest reads.
export default function RouteMap() {
  const stops = wedding.story;
  return (
    <div className="relative aspect-[600/520] w-full max-w-xl mx-auto">
      <svg viewBox="0 0 600 520" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <radialGradient id="route-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b9bec6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#b9bec6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Faint chart grid */}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" x2="600" y1={i * 86.6} y2={i * 86.6} stroke="#f6efe0" strokeOpacity="0.07" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 85.7} x2={i * 85.7} y1="0" y2="520" stroke="#f6efe0" strokeOpacity="0.07" />
        ))}

        {/* Planned route (dashed) and the trail flown so far (silver) */}
        <path d={ROUTE} fill="none" stroke="#f6efe0" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="4 7" strokeLinecap="round" className="route-flow" />
        <path
          d={ROUTE}
          pathLength={1}
          fill="none"
          stroke="#b9bec6"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="route-trail"
        />

        {/* Stops */}
        {STOPS.map((p, i) => {
          // Stop 0 is where leg 1 departs; every later stop is where the
          // previous leg lands. The last stop is the "∞" landing place.
          const leg = stops[Math.max(0, Math.min(i - 1, stops.length - 1))];
          const parts = leg.code.split(" - ");
          const code =
            i === STOPS.length - 1 ? "∞" : i === 0 ? parts[0] : parts[1] ?? parts[0];
          const labelAbove = p.y > 260;
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="26" fill="url(#route-glow)" className="route-node" style={nodeRange(i)} />
              <circle cx={p.x} cy={p.y} r="6" fill="#1c2940" stroke="#f6efe0" strokeWidth="1.5" />
              <circle cx={p.x} cy={p.y} r="6" fill="#b9bec6" className="route-node" style={nodeRange(i)} />
              <text
                x={p.x}
                y={labelAbove ? p.y - 20 : p.y + 34}
                textAnchor="middle"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fontSize="15"
                fontWeight="700"
                letterSpacing="2"
                fill="#f6efe0"
              >
                {code}
              </text>
              <text
                x={p.x}
                y={labelAbove ? p.y - 38 : p.y + 52}
                textAnchor="middle"
                fontFamily="var(--font-sans), sans-serif"
                fontSize="9"
                letterSpacing="3"
                fill="#b9bec6"
              >
                {leg.year}
              </text>
            </g>
          );
        })}

        {/* The plane, riding the route via CSS motion path */}
        <g className="route-plane">
          <path
            d="M2 32 L62 4 L40 60 L30 38 L2 32 Z"
            fill="#f6efe0"
            transform="rotate(43) scale(0.5) translate(-32 -32)"
          />
        </g>
      </svg>

      <div className="absolute -bottom-2 left-0 right-0 flex items-center justify-between font-mono uppercase tracking-[0.3em] text-[9px] text-cream/60">
        <span>Flight log · {stops.length} legs</span>
        <span>{wedding.flightNumber}</span>
      </div>
    </div>
  );
}

// Each stop lights as the plane reaches it: 5 stops spread over the trip.
function nodeRange(i: number): React.CSSProperties {
  const start = Math.max(0, i * 22 - 4);
  return { animationRange: `cover ${start}% cover ${start + 8}%` } as React.CSSProperties;
}
