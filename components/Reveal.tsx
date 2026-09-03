"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article";
  // Where the element comes from: rises by default, or slides in from a
  // side, or settles from a slight zoom.
  variant?: "up" | "left" | "right" | "zoom";
};

const HIDDEN: Record<NonNullable<Props["variant"]>, string> = {
  up: "opacity-0 translate-y-8",
  left: "opacity-0 -translate-x-10",
  right: "opacity-0 translate-x-10",
  zoom: "opacity-0 scale-[0.94]",
};

export default function Reveal({ children, className = "", delay = 0, as = "div", variant = "up" }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = { transitionDelay: `${delay}ms` };
  // Lets descendants (e.g. passport stamps) key their own entrance off
  // this element's visibility with plain CSS.
  const data = { "data-reveal": "", "data-revealed": visible ? "" : undefined };
  const cls = `transition-[opacity,transform] duration-[900ms] ease-out-expo will-change-transform motion-reduce:transition-none ${
    visible
      ? "opacity-100 translate-x-0 translate-y-0 scale-100"
      : `${HIDDEN[variant]} motion-reduce:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:scale-100`
  } ${className}`;

  if (as === "li") {
    return (
      <li ref={ref as React.RefObject<HTMLLIElement>} style={style} className={cls} {...data}>
        {children}
      </li>
    );
  }
  if (as === "section") {
    return (
      <section ref={ref as React.RefObject<HTMLElement>} style={style} className={cls} {...data}>
        {children}
      </section>
    );
  }
  if (as === "article") {
    return (
      <article ref={ref as React.RefObject<HTMLElement>} style={style} className={cls} {...data}>
        {children}
      </article>
    );
  }
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} style={style} className={cls} {...data}>
      {children}
    </div>
  );
}
