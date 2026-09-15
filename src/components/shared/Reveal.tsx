"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "cn";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Use entrance animation instead of scroll reveal (hero). */
  mode?: "view" | "enter";
};

export function Reveal({
  children,
  className,
  delay = 0,
  mode = "view",
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const transition = { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const };
  const hidden = { opacity: 0, y: 22 };
  const shown = { opacity: 1, y: 0 };

  if (mode === "enter") {
    return (
      <motion.div
        className={cn(className)}
        initial={hidden}
        animate={shown}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(className)}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
