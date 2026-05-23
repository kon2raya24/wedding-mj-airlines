"use client";

const DIGITS = "0123456789".split("");

export default function Odometer({
  value,
  pad = 2,
  className = "",
}: {
  value: number;
  pad?: number;
  className?: string;
}) {
  const str = String(Math.max(0, Math.floor(value))).padStart(pad, "0");
  return (
    <span className={`inline-flex ${className}`} aria-label={String(value)}>
      {str.split("").map((digit, i) => (
        <DigitWheel key={i} digit={Number(digit)} />
      ))}
    </span>
  );
}

function DigitWheel({ digit }: { digit: number }) {
  // Each wheel is a fixed-height window with all 10 digits stacked.
  // Translate to bring the target digit into view.
  return (
    <span
      aria-hidden
      className="relative inline-block overflow-hidden align-baseline h-[1em] leading-none"
      style={{ width: "0.62em" }}
    >
      <span
        className="block transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
        style={{ transform: `translateY(-${digit}em)` }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="block h-[1em] leading-none text-center">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}
