"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

type CountUpProps = {
  value: number;
  locale: string;
  suffix?: string;
  className?: string;
};

/** Counts from 0 to `value` once the number scrolls into view. */
export function CountUp({ value, locale, suffix = "", className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduceMotion = useReducedMotion();
  const [animated, setAnimated] = useState(0);
  const display = reduceMotion ? value : animated;

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setAnimated(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  const format = (n: number) => new Intl.NumberFormat(locale).format(n);

  return (
    <span ref={ref} className={className}>
      {/* Final value for assistive tech and no-JS; animated value is visual only. */}
      <span className="sr-only">
        {format(value)}
        {suffix}
      </span>
      <span aria-hidden>
        {format(display)}
        {suffix}
      </span>
    </span>
  );
}
