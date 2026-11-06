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
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  /** Vertical centre of the card photos (4:3), so the arrows sit on the images. */
  const [arrowTop, setArrowTop] = useState<number | null>(null);

  const syncState = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setProgress(Math.min(1, Math.max(0, emblaApi.scrollProgress())));
    const firstSlide = emblaApi.slideNodes()[0];
    if (firstSlide) {
      // lg+: arrows sit in the side gutters, centred on the whole card.
      // Smaller screens: centred on the 4:3 photo, on top of the cards.
      const inGutter = window.matchMedia("(min-width: 1024px)").matches;
      setArrowTop(
        inGutter
          ? firstSlide.offsetHeight / 2
          : (firstSlide.offsetWidth * 3) / 4 / 2,
      );
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", syncState);
    emblaApi.on("reInit", syncState);
    emblaApi.on("scroll", syncState);
    emblaApi.on("settle", syncState);
    emblaApi.on("resize", syncState);

    const frame = requestAnimationFrame(() => {
      syncState();
    });

    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("select", syncState);
      emblaApi.off("reInit", syncState);
      emblaApi.off("scroll", syncState);
      emblaApi.off("settle", syncState);
      emblaApi.off("resize", syncState);
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

  // Round side arrows, vertically centred on the photos. On md+ they straddle
  // the carousel edge; on small screens they sit just inside the cards.
  const arrowClass = cn(
    "focus-ring absolute z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full md:size-12 lg:size-10",
    "bg-charcoal text-surface shadow-[0_14px_32px_-14px_rgba(20,20,22,0.75)] ring-1 ring-white/10",
    "transition-[opacity,scale,background-color,color] duration-200 ease-out",
    "hover:bg-brand hover:text-charcoal active:scale-95",
    "disabled:cursor-default disabled:opacity-35 disabled:hover:bg-charcoal disabled:hover:text-surface disabled:active:scale-100",
  );
  const arrowStyle = { top: arrowTop ?? "40%" };

  const navArrows =
    slides.length > 1 ? (
      <>
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canPrev}
          aria-label={previousLabel}
          className={cn(arrowClass, "left-2 md:left-0 md:-translate-x-1/2 lg:-left-6")}
          style={arrowStyle}
        >
          <ArrowLeft className="size-5" strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canNext}
          aria-label={nextLabel}
          className={cn(arrowClass, "right-2 md:right-0 md:translate-x-1/2 lg:-right-6")}
          style={arrowStyle}
        >
          <ArrowRight className="size-5" strokeWidth={2} aria-hidden />
        </button>
      </>
    ) : null;

  return (
    <div className="space-y-5 md:space-y-6">
      <div className="space-y-3">
        <SectionHeader
          className="md:items-start [&_h2]:text-[1.85rem] sm:[&_h2]:text-3xl md:[&_h2]:text-[2.15rem] [&_p.max-w-xl]:text-[0.95rem]"
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={
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
          }
        />
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
        {/* Below lg the track bleeds into the right padding; on lg+ it stops at
            the content edge so both arrows get a matching gutter. */}
        <div className="-mr-4 md:-mr-8 lg:mr-0">
          <div ref={emblaRef} className="overflow-hidden">
            <ul className="flex touch-pan-y gap-3 pr-4 md:gap-4 md:pr-8 lg:pr-0">
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

        {navArrows}

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
