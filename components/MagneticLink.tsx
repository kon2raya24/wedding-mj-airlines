"use client";

import { useRef } from "react";

export default function MagneticLink({
  href,
  children,
  className = "",
  strength = 0.35,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  strength?: number;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const inner = useRef<HTMLSpanElement | null>(null);

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    if (inner.current) {
      inner.current.style.transform = `translate(${x * strength * 0.4}px, ${y * strength * 0.4}px)`;
    }
  }

  function reset() {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
    if (inner.current) inner.current.style.transform = "translate(0, 0)";
  }

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`inline-block transition-transform duration-200 ease-out will-change-transform ${className}`}
      {...rest}
    >
      <span ref={inner} className="inline-flex items-center gap-3 transition-transform duration-200 ease-out will-change-transform">
        {children}
      </span>
    </a>
  );
}
