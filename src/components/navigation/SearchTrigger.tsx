"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter } from "@/i18n/navigation";
import { company } from "@/data/company";
import { cn } from "cn";

type SearchTriggerProps = {
  className?: string;
  /** Controlled open state shared with mobile menu. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * Header search control — opens a crane-search overlay that routes into `/cranes`.
 */
export function SearchTrigger({
  className,
  open: openProp,
  onOpenChange,
}: SearchTriggerProps) {
  const t = useTranslations("Nav");
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [query, setQuery] = useState("");
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;
  const panelId = useId();
  const titleId = useId();
  const descId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  function setPanelOpen(next: boolean) {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
    if (!next) setQuery("");
  }

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) {
        const trigger = triggerRef.current;
        // Avoid focusing a `display: none` desktop trigger on small screens.
        if (trigger && trigger.getClientRects().length > 0) {
          trigger.focus();
        }
      }
      wasOpenRef.current = false;
      return;
    }

    wasOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 10);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setPanelOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
    // setPanelOpen is stable enough for Escape; open drives the effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional open-driven effect
  }, [open]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    const href = trimmed
      ? `/cranes?q=${encodeURIComponent(trimmed)}`
      : "/cranes";
    setPanelOpen(false);
    router.push(href);
  }

  function browseManufacturer(name: string) {
    setPanelOpen(false);
    router.push(`/cranes?manufacturer=${encodeURIComponent(name)}`);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-[var(--radius)] text-white/80 transition-colors duration-200 outline-none hover:bg-white/8 hover:text-white focus-visible:bg-white/8 focus-visible:text-white focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
          className,
        )}
        aria-label={t("search")}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setPanelOpen(true)}
      >
        <Search className="size-[1.05rem]" strokeWidth={1.75} aria-hidden />
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-[2px]"
              aria-label={t("close")}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setPanelOpen(false)}
            />

            <motion.div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              className="fixed inset-x-0 top-0 z-[60] mx-auto w-full max-w-xl px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:top-[min(18vh,7.5rem)] sm:px-6"
              initial={reduceMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="overflow-hidden rounded-[var(--radius)] border border-white/12 bg-charcoal shadow-[0_24px_64px_-20px_rgba(0,0,0,0.75)]">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
                  <div className="min-w-0 space-y-1">
                    <h2
                      id={titleId}
                      className="font-heading text-lg font-semibold tracking-tight text-white"
                    >
                      {t("searchTitle")}
                    </h2>
                    <p id={descId} className="text-sm text-white/60">
                      {t("searchDescription")}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--radius)] text-white/70 transition-colors hover:bg-white/8 hover:text-white focus-visible:bg-white/8 focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:outline-none"
                    aria-label={t("close")}
                    onClick={() => setPanelOpen(false)}
                  >
                    <X className="size-5" strokeWidth={1.75} aria-hidden />
                  </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4 px-5 py-5">
                  <label className="block space-y-2">
                    <span className="text-xs font-semibold tracking-[0.16em] text-white/55 uppercase">
                      {t("search")}
                    </span>
                    <div className="relative">
                      <Search
                        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/45"
                        aria-hidden
                      />
                      <input
                        ref={inputRef}
                        type="search"
                        name="q"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={t("searchPlaceholder")}
                        autoComplete="off"
                        enterKeyHint="search"
                        className="h-12 w-full rounded-[var(--radius)] border border-white/12 bg-white/[0.04] pr-4 pl-11 text-sm text-white outline-none transition-[border-color,background-color] placeholder:text-white/40 focus:border-brand/70 focus:bg-white/[0.06]"
                      />
                    </div>
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {company.manufacturers.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => browseManufacturer(name)}
                        className="inline-flex h-9 items-center rounded-[var(--radius)] border border-white/12 bg-transparent px-3 text-xs font-medium tracking-wide text-white/75 transition-colors hover:border-white/25 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:outline-none"
                      >
                        {name}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[var(--radius)] bg-brand px-4 text-sm font-semibold tracking-wide text-charcoal transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal focus-visible:outline-none"
                    >
                      {t("searchSubmit")}
                      <ArrowRight
                        className="size-3.5"
                        strokeWidth={2.25}
                        aria-hidden
                      />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-11 items-center justify-center rounded-[var(--radius)] border border-white/14 px-4 text-sm font-medium text-white/80 transition-colors hover:border-white/28 hover:bg-white/[0.05] hover:text-white focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:outline-none sm:min-w-[10.5rem]"
                      onClick={() => {
                        setPanelOpen(false);
                        router.push("/cranes");
                      }}
                    >
                      {t("searchBrowseAll")}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/** Opens the shared header search overlay from the mobile drawer. */
export function SearchMenuButton({
  className,
  onOpen,
}: {
  className?: string;
  onOpen: () => void;
}) {
  const t = useTranslations("Nav");

  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-11 w-full items-center gap-3 rounded-[var(--radius)] px-4 text-base font-semibold text-white/80 transition-colors outline-none hover:bg-white/[0.06] hover:text-white focus-visible:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
        className,
      )}
      onClick={onOpen}
      aria-haspopup="dialog"
    >
      <Search className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
      {t("search")}
    </button>
  );
}
