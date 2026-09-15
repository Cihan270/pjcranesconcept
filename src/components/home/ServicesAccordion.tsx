"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "cn";
import { Link } from "@/i18n/navigation";

type AppHref = ComponentProps<typeof Link>["href"];

export type ServicesAccordionItem = {
  id: string;
  href: string;
  title: string;
  summary: string;
  cta: string;
  image: {
    src: string;
    alt: string;
    objectPosition?: string;
  };
};

type ServicesAccordionProps = {
  items: ServicesAccordionItem[];
  tablistLabel: string;
};

function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function ServicesAccordion({
  items,
  tablistLabel,
}: ServicesAccordionProps) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion();

  const contentTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.36, ease: [0.22, 1, 0.36, 1] as const };

  const imageTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const };

  const activate = useCallback((index: number) => {
    setActive(index);
  }, []);

  const onTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const last = items.length - 1;
      let next: number | null = null;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          next = index === last ? 0 : index + 1;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          next = index === 0 ? last : index - 1;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = last;
          break;
        default:
          return;
      }

      event.preventDefault();
      activate(next);
      tabRefs.current[next]?.focus();
    },
    [activate, items.length],
  );

  const activeItem = items[active] ?? items[0];

  return (
    <>
      {/* Mobile: vertical accordion */}
      <div className="md:hidden" role="list">
        {items.map((item, index) => {
          const isOpen = active === index;
          const panelId = `${baseId}-mobile-panel-${item.id}`;
          const buttonId = `${baseId}-mobile-btn-${item.id}`;
          const number = formatIndex(index);

          return (
            <div
              key={item.id}
              role="listitem"
              className="border-b border-surface/12 first:border-t"
            >
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => activate(index)}
                className={cn(
                  "focus-ring flex min-h-14 w-full items-center gap-4 rounded-[var(--radius)] py-4 text-left",
                  "transition-colors duration-300 motion-reduce:transition-none",
                )}
              >
                <span
                  className={cn(
                    "font-heading w-8 shrink-0 text-sm font-semibold tabular-nums tracking-wide",
                    isOpen ? "text-brand" : "text-surface/45",
                  )}
                >
                  {number}
                </span>
                <span
                  className={cn(
                    "font-heading min-w-0 flex-1 text-lg leading-snug font-semibold tracking-tight text-balance",
                    isOpen ? "text-surface" : "text-surface/85",
                  )}
                >
                  {item.title}
                </span>
                <Plus
                  className={cn(
                    "size-4 shrink-0 text-surface/40 transition-transform duration-300 motion-reduce:transition-none",
                    isOpen && "rotate-45 text-brand",
                  )}
                  aria-hidden
                />
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className={cn(!isOpen && "hidden")}
              >
                {isOpen ? (
                  <div className="space-y-4 pb-5">
                    <div className="relative aspect-[4/3] max-h-56 overflow-hidden bg-charcoal">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        style={
                          item.image.objectPosition
                            ? { objectPosition: item.image.objectPosition }
                            : undefined
                        }
                      />
                      <div
                        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,27,29,0.12)_0%,rgba(27,27,29,0.35)_100%)]"
                        aria-hidden
                      />
                      <span
                        className="absolute top-3 left-3 font-heading text-xs font-semibold tracking-[0.18em] text-brand tabular-nums"
                        aria-hidden
                      >
                        {number}
                      </span>
                    </div>

                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={item.id}
                        initial={
                          reduceMotion ? false : { opacity: 0, y: 8 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                          reduceMotion
                            ? undefined
                            : { opacity: 0, y: -4 }
                        }
                        transition={contentTransition}
                        className="space-y-3"
                      >
                        <p className="text-sm leading-relaxed text-surface/65">
                          {item.summary}
                        </p>
                        <Link
                          href={item.href as AppHref}
                          className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded-[var(--radius)] text-sm font-medium text-brand transition-colors hover:text-surface"
                        >
                          {item.cta}
                          <ArrowRight
                            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
                            aria-hidden
                          />
                        </Link>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: split layout */}
      <div className="hidden md:grid md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] md:items-start md:gap-10 lg:gap-14">
        <div
          role="tablist"
          aria-label={tablistLabel}
          aria-orientation="vertical"
          className="flex min-w-0 flex-col"
        >
          {items.map((item, index) => {
            const isActive = active === index;
            const tabId = `${baseId}-tab-${item.id}`;
            const panelId = `${baseId}-panel-${item.id}`;
            const number = formatIndex(index);

            return (
              <div
                key={item.id}
                className="relative border-b border-surface/12 first:border-t"
              >
                {isActive ? (
                  <span
                    className="absolute top-0 bottom-0 left-0 w-0.5 bg-brand"
                    aria-hidden
                  />
                ) : null}

                <button
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={tabId}
                  aria-selected={isActive}
                  aria-controls={panelId}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => activate(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={cn(
                    "group/tab flex w-full items-start gap-4 rounded-[var(--radius)] py-5 pl-4 text-left lg:py-6",
                    "transition-colors duration-300 motion-reduce:transition-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
                    !isActive && "hover:bg-surface/[0.03]",
                  )}
                >
                  <span
                    className={cn(
                      "font-heading mt-0.5 w-8 shrink-0 text-sm font-semibold tabular-nums tracking-wide transition-colors duration-300",
                      isActive
                        ? "text-brand"
                        : "text-surface/40 group-hover/tab:text-surface/55",
                    )}
                  >
                    {number}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "font-heading flex items-center justify-between gap-3 text-xl leading-snug font-semibold tracking-tight text-balance lg:text-[1.35rem]",
                        "transition-colors duration-300",
                        isActive
                          ? "text-surface"
                          : "text-surface/75 group-hover/tab:text-surface/90",
                      )}
                    >
                      {item.title}
                      <Plus
                        className={cn(
                          "size-4 shrink-0 transition-[transform,color,opacity] duration-300 motion-reduce:transition-none",
                          isActive
                            ? "rotate-45 text-brand opacity-100"
                            : "text-surface/35 opacity-70 group-hover/tab:opacity-100",
                        )}
                        aria-hidden
                      />
                    </span>
                  </span>
                </button>

                <div
                  role="tabpanel"
                  id={panelId}
                  aria-labelledby={tabId}
                  hidden={!isActive}
                  className={cn(!isActive && "hidden")}
                >
                  {isActive ? (
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={item.id}
                        initial={
                          reduceMotion ? false : { opacity: 0, y: 10 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                          reduceMotion
                            ? undefined
                            : { opacity: 0, y: -6 }
                        }
                        transition={contentTransition}
                        className="space-y-4 pb-6 pl-12 lg:pb-7"
                      >
                        <p className="max-w-md text-sm leading-relaxed text-surface/65 lg:text-[0.95rem]">
                          {item.summary}
                        </p>
                        <Link
                          href={item.href as AppHref}
                          className="focus-ring group/cta inline-flex min-h-11 items-center gap-2 rounded-[var(--radius)] text-sm font-medium text-brand transition-colors hover:text-surface"
                        >
                          {item.cta}
                          <ArrowRight
                            className="size-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 motion-reduce:transition-none"
                            aria-hidden
                          />
                        </Link>
                      </motion.div>
                    </AnimatePresence>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative min-w-0 md:sticky md:top-28">
          <div className="relative aspect-[4/3] overflow-hidden bg-charcoal/80 lg:aspect-[5/4]">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={activeItem.id}
                initial={
                  reduceMotion ? false : { opacity: 0, scale: 1.02 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, scale: 1 }
                }
                transition={imageTransition}
                className="absolute inset-0"
              >
                <Image
                  src={activeItem.image.src}
                  alt={activeItem.image.alt}
                  fill
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="object-cover"
                  style={
                    activeItem.image.objectPosition
                      ? {
                          objectPosition: activeItem.image.objectPosition,
                        }
                      : undefined
                  }
                  priority={active === 0}
                />
                <div
                  className="absolute inset-0 bg-[linear-gradient(145deg,rgba(27,27,29,0.18)_0%,rgba(27,27,29,0.08)_40%,rgba(27,27,29,0.42)_100%)]"
                  aria-hidden
                />
              </motion.div>
            </AnimatePresence>

            <span
              className="pointer-events-none absolute right-4 bottom-4 z-10 font-heading text-xs font-semibold tracking-[0.2em] text-surface/70 tabular-nums uppercase"
              aria-hidden
            >
              {formatIndex(active)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
