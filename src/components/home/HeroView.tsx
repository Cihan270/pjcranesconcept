"use client";

import Image from "next/image";
import { ArrowRight, Award, Building2, Scale } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import type { CraneImage } from "@/types/crane";

type TrustItem = {
  value: string;
  label: string;
};

type HeroViewProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaInventory: string;
  ctaSell: string;
  findLink: string;
  trust: [TrustItem, TrustItem, TrustItem];
  image?: CraneImage | null;
};

const ease = [0.16, 1, 0.3, 1] as const;

const trustIcons = [Scale, Building2, Award] as const;

export function HeroView({
  eyebrow,
  title,
  subtitle,
  ctaInventory,
  ctaSell,
  findLink,
  trust,
  image,
}: HeroViewProps) {
  const reduceMotion = useReducedMotion();

  const reveal = (delay: number) =>
    reduceMotion
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease },
        };

  return (
    <>
      <div className="absolute inset-0">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            preload
            quality={90}
            sizes="100vw"
            className="object-cover object-[76%_50%] md:object-[88%_50%] lg:object-[100%_50%]"
          />
        ) : (
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(250,191,3,0.18),transparent_42%),linear-gradient(150deg,#141416_0%,#252528_52%,#141416_100%)]"
            aria-hidden
          />
        )}
      </div>

      {/* Left-weighted readability; keep crane visible on the right */}
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,20,22,0.9)_0%,rgba(20,20,22,0.78)_24%,rgba(20,20,22,0.48)_46%,rgba(20,20,22,0.18)_66%,rgba(20,20,22,0.05)_82%,transparent_100%)] max-md:bg-[linear-gradient(105deg,rgba(20,20,22,0.92)_0%,rgba(20,20,22,0.82)_38%,rgba(20,20,22,0.42)_62%,rgba(20,20,22,0.12)_78%,transparent_100%)]"
        aria-hidden
      />
      {/* Top for header + slight bottom anchor */}
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,20,22,0.55)_0%,rgba(20,20,22,0.18)_12%,transparent_28%,transparent_78%,rgba(20,20,22,0.4)_100%)]"
        aria-hidden
      />

      <div className="relative mx-auto flex h-full w-full max-w-[1440px] flex-col justify-center px-4 py-14 md:px-8 md:py-16 lg:px-12 lg:py-20">
        <div className="max-w-[34rem]">
          <motion.p
            {...reveal(0.06)}
            className="flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.18em] text-brand uppercase sm:text-xs"
          >
            <span
              className="hidden h-px w-8 shrink-0 bg-brand sm:block"
              aria-hidden
            />
            {eyebrow}
          </motion.p>

          <motion.h1
            {...reveal(0.14)}
            className="mt-3 max-w-[20ch] font-heading text-[clamp(1.75rem,4.1vw,3.15rem)] leading-[1.06] font-semibold tracking-[-0.025em] whitespace-pre-line text-surface md:mt-3.5 md:max-w-none"
          >
            {title}
          </motion.h1>

          <motion.p
            {...reveal(0.22)}
            className="mt-3 max-w-[32rem] text-[0.875rem] leading-relaxed text-surface/80 sm:text-[0.9375rem] md:mt-3.5"
          >
            {subtitle}
          </motion.p>

          <motion.div
            {...reveal(0.32)}
            className="mt-5 flex w-full flex-col gap-2.5 sm:mt-6 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
          >
            <Link
              href="/cranes"
              className="focus-ring group inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-[var(--radius)] bg-primary px-5 text-sm font-semibold tracking-wide text-primary-foreground transition-[background-color,transform,box-shadow] duration-300 hover:bg-accent hover:shadow-[0_8px_28px_-12px_rgba(250,191,3,0.55)] active:translate-y-px sm:h-12 sm:w-auto sm:px-6"
            >
              {ctaInventory}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <Link
              href="/sell-your-crane"
              className="focus-ring inline-flex h-11 w-full items-center justify-center rounded-[var(--radius)] border border-surface/40 bg-charcoal/45 px-5 text-sm font-medium tracking-wide text-surface transition-colors duration-300 hover:border-surface/80 hover:bg-surface/12 sm:h-12 sm:w-auto sm:px-6"
            >
              {ctaSell}
            </Link>
          </motion.div>

          <motion.div {...reveal(0.4)} className="mt-4">
            <Link
              href="/find-a-crane"
              className="focus-ring group inline-flex max-w-full items-center gap-1.5 text-sm text-surface/75 underline-offset-4 transition-colors hover:text-brand hover:underline"
            >
              <span>{findLink}</span>
              <ArrowRight
                className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </motion.div>

          <motion.ul
            {...reveal(0.48)}
            className="mt-7 grid gap-3 border-t border-surface/25 pt-5 sm:mt-8 sm:grid-cols-3 sm:gap-0 sm:pt-5 lg:w-max lg:grid-cols-[repeat(3,auto)] lg:[&_p]:whitespace-nowrap"
          >
            {trust.map((item, index) => {
              const Icon = trustIcons[index];
              return (
                <li
                  key={item.value}
                  className="flex items-start gap-2.5 sm:min-w-0 sm:px-4 sm:first:pl-0 sm:last:pr-0 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-surface/25"
                >
                  <Icon
                    className="mt-0.5 size-4 shrink-0 text-brand"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-[0.8125rem] font-semibold tracking-tight text-surface sm:text-sm">
                      {item.value}
                    </p>
                    <p className="mt-0.5 text-[0.6875rem] leading-snug text-surface/70 sm:text-xs">
                      {item.label}
                    </p>
                  </div>
                </li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </>
  );
}
