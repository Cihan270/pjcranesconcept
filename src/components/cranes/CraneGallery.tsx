"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { CraneImage } from "@/types/crane";
import { cn } from "cn";

type CraneGalleryProps = {
  images: CraneImage[];
  title: string;
  className?: string;
};

export function CraneGallery({
  images,
  title,
  className,
}: CraneGalleryProps) {
  const t = useTranslations("CraneDetail.gallery");
  const reduceMotion = useReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1 });
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const slides = images.map((image) => ({
    src: image.src,
    alt: image.alt || title,
  }));

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "aspect-[4/3] bg-[linear-gradient(135deg,#2a2a2e,#1b1b1d)]",
          className,
        )}
        aria-label={t("empty")}
      />
    );
  }

  return (
    <motion.div
      className={cn("space-y-3", className)}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="relative overflow-hidden bg-secondary">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {images.map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                type="button"
                className="focus-ring relative aspect-[4/3] min-w-0 shrink-0 grow-0 basis-full"
                onClick={() => {
                  setSelected(index);
                  setLightboxOpen(true);
                }}
                aria-label={t("open", {
                  index: index + 1,
                  total: images.length,
                })}
              >
                <Image
                  src={image.src}
                  alt={image.alt || title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {images.length > 1 ? (
          <div className="print:hidden">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              className="focus-ring absolute top-1/2 left-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-[var(--radius)] bg-charcoal/80 text-surface transition-colors hover:bg-charcoal"
              aria-label={t("previous")}
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              className="focus-ring absolute top-1/2 right-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-[var(--radius)] bg-charcoal/80 text-surface transition-colors hover:bg-charcoal"
              aria-label={t("next")}
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
            <p className="absolute right-3 bottom-3 bg-charcoal/85 px-2 py-1 font-heading text-xs tracking-wide text-brand tabular-nums uppercase">
              {selected + 1} / {images.length}
            </p>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 print:hidden">
          {images.map((image, index) => (
            <button
              key={`thumb-${image.src}-${index}`}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={t("thumb", { index: index + 1 })}
              aria-current={selected === index}
              className={cn(
                "focus-ring relative aspect-[4/3] min-h-11 w-20 shrink-0 snap-start overflow-hidden border transition-colors",
                selected === index
                  ? "border-brand"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={selected}
        slides={slides}
        controller={{ closeOnBackdropClick: true }}
      />
    </motion.div>
  );
}
