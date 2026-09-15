"use client";

import {
  Children,
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { cn } from "cn";

type FeaturedInventoryCarouselProps = {
  eyebrow: string;
  title: string;
  description: string;
  viewAllLabel: string;
  previousLabel: string;
  nextLabel: string;
  progressLabel: string;
  children: ReactNode;
};

export function FeaturedInventoryCarousel({
  eyebrow,
  title,
  description,
  viewAllLabel,
  previousLabel,
  nextLabel,
  progressLabel,
  children,
}: FeaturedInventoryCarouselProps) {
  const reduceMotion = useReducedMotion();
  const slides = Children.toArray(children);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    loop: false,
    skipSnaps: false,
    duration: reduceMotion ? 0 : 22,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(slides.length > 1);
  const [progress, setProgress] = useState(0);

  const syncState = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setProgress(Math.min(1, Math.max(0, emblaApi.scrollProgress())));
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", syncState);
    emblaApi.on("reInit", syncState);
    emblaApi.on("scroll", syncState);
    emblaApi.on("settle", syncState);

    const frame = requestAnimationFrame(() => {
      syncState();
    });

    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("select", syncState);
      emblaApi.off("reInit", syncState);
      emblaApi.off("scroll", syncState);
      emblaApi.off("settle", syncState);
    };
  }, [emblaApi, syncState]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!emblaApi) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      emblaApi.scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      emblaApi.scrollNext();
    } else if (event.key === "Home") {
      event.preventDefault();
      emblaApi.scrollTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      emblaApi.scrollTo(slides.length - 1);
    }
  };

  const navButtons = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canPrev}
        aria-label={previousLabel}
        className={cn(
          "focus-ring inline-flex size-9 items-center justify-center rounded-[var(--radius)] border border-line bg-surface text-foreground transition-colors",
          "hover:border-charcoal/25 hover:bg-secondary",
          "disabled:pointer-events-none disabled:opacity-35",
        )}
      >
        <ChevronLeft className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canNext}
        aria-label={nextLabel}
        className={cn(
          "focus-ring inline-flex size-9 items-center justify-center rounded-[var(--radius)] border border-line bg-surface text-foreground transition-colors",
          "hover:border-charcoal/25 hover:bg-secondary",
          "disabled:pointer-events-none disabled:opacity-35",
        )}
      >
        <ChevronRight className="size-4" aria-hidden />
      </button>
    </div>
  );

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="space-y-3">
        <SectionHeader
          className="md:items-start [&_h2]:text-[1.85rem] sm:[&_h2]:text-3xl md:[&_h2]:text-[2.15rem] [&_p.max-w-xl]:text-[0.95rem]"
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <Link
                href="/cranes"
                className="focus-ring group inline-flex min-h-10 items-center gap-2 rounded-[var(--radius)] text-sm font-medium text-foreground transition-colors hover:text-steel"
              >
                {viewAllLabel}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <div className="hidden sm:block">{navButtons}</div>
            </div>
          }
        />
        <div className="sm:hidden">{navButtons}</div>
      </div>

      <div
        className="relative outline-none"
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* Bleed slightly past the section’s right padding toward the viewport edge */}
        <div className="-mr-4 md:-mr-8 lg:-mr-12">
          <div ref={emblaRef} className="overflow-hidden">
            <ul className="flex touch-pan-y gap-3 pr-4 md:gap-4 md:pr-8 lg:pr-12">
              {slides.map((slide, index) => (
                <li
                  key={
                    (slide as { key?: string | null }).key ?? `slide-${index}`
                  }
                  className="min-w-0 shrink-0 grow-0 basis-[87%] sm:basis-[47%] lg:basis-[38%] xl:basis-[30.5%]"
                >
                  {slide}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 pr-0">
          <div
            className="h-0.5 w-full overflow-hidden bg-line"
            role="progressbar"
            aria-label={progressLabel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <div
              className={cn(
                "h-full origin-left bg-brand",
                !reduceMotion && "transition-[width] duration-200 ease-out",
              )}
              style={{ width: `${Math.max(progress * 100, slides.length <= 1 ? 100 : 8)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
