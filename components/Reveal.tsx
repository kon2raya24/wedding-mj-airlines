"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article";
};

export default function Reveal({ children, className = "", delay = 0, as = "div" }: Props) {
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
  const cls = `transition-all duration-700 ease-out will-change-transform ${
    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  } ${className}`;

  if (as === "li") {
    return (
      <li ref={ref as React.RefObject<HTMLLIElement>} style={style} className={cls}>
        {children}
      </li>
    );
  }
  if (as === "section") {
    return (
      <section ref={ref as React.RefObject<HTMLElement>} style={style} className={cls}>
        {children}
      </section>
    );
  }
  if (as === "article") {
    return (
      <article ref={ref as React.RefObject<HTMLElement>} style={style} className={cls}>
        {children}
      </article>
    );
  }
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} style={style} className={cls}>
      {children}
    </div>
  );
}
