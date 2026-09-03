"use client";

import { useEffect, useRef } from "react";

// Wraps a card so it tilts toward the pointer like a ticket held in hand.
// Pointer-only, reduced-motion aware, and driven outside React state so it
// never re-renders its children.
export default function TiltCard({
  children,
  className = "",
  max = 6,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;
    let hovering = false;

    const tick = () => {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      el.style.transform = `perspective(1200px) rotateX(${current.x.toFixed(2)}deg) rotateY(${current.y.toFixed(2)}deg)`;
      const settled = Math.abs(current.x - target.x) < 0.01 && Math.abs(current.y - target.y) < 0.01;
      if (!settled || hovering) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      target.x = -py * max * 2;
      target.y = px * max * 2;
      hovering = true;
      start();
    };
    const onLeave = () => {
      hovering = false;
      target.x = 0;
      target.y = 0;
      start();
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [max]);

  return (
    <div ref={ref} className={`will-change-transform [transform-style:preserve-3d] ${className}`}>
      {children}
    </div>
  );
}
