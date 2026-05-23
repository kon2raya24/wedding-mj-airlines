"use client";

import { useEffect, useState } from "react";

export default function AnimatedName({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const [start, setStart] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStart(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <span className={className} aria-label={text}>
      {[...text].map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block transition-all duration-700 ease-out"
          style={{
            transitionDelay: `${i * 80}ms`,
            transform: start ? "translateY(0)" : "translateY(0.6em)",
            opacity: start ? 1 : 0,
            filter: start ? "blur(0)" : "blur(6px)",
          }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
