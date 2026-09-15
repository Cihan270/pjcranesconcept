"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "cn";

type HeadquartersMapProps = {
  embedUrl: string;
  title: string;
  loadLabel: string;
  markerLabel: string;
  className?: string;
};

/**
 * Lazy-loads an OpenStreetMap embed below the fold.
 * Address and route links remain available outside this component.
 */
export function HeadquartersMap({
  embedUrl,
  title,
  loadLabel,
  markerLabel,
  className,
}: HeadquartersMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden border border-line bg-[#e8e8e4]",
        className,
      )}
    >
      {!shouldLoad ? (
        <button
          type="button"
          onClick={() => setShouldLoad(true)}
          className="focus-ring absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm font-medium text-foreground transition-colors hover:bg-[#ebebe7]"
        >
          <MapPin className="size-6 text-brand" aria-hidden />
          {loadLabel}
        </button>
      ) : (
        <>
          {!loaded ? (
            <div
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden
            >
              <MapPin className="size-6 text-brand" />
            </div>
          ) : null}
          <iframe
            title={title}
            src={embedUrl}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setLoaded(true)}
          />
          <div className="pointer-events-none absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-charcoal px-2.5 py-1.5 text-surface shadow-sm">
            <span className="size-2 shrink-0 rounded-full bg-brand" aria-hidden />
            <span className="font-heading text-[0.65rem] font-semibold tracking-[0.14em] uppercase">
              {markerLabel}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
