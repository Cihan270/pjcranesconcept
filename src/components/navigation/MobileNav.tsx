"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/navigation/LocaleSwitcher";
import { MainNav } from "@/components/navigation/MainNav";
import { SearchMenuButton } from "@/components/navigation/SearchTrigger";
import { cn } from "cn";

type MobileNavProps = {
  onOpenSearch?: () => void;
};

export function MobileNav({ onOpenSearch }: MobileNavProps) {
  const t = useTranslations("Nav");
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    }, 10);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
      triggerRef.current?.focus();
    };
  }, [open]);

  function openSearch() {
    setOpen(false);
    onOpenSearch?.();
  }

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-[var(--radius)] text-charcoal transition-colors duration-200 outline-none hover:bg-charcoal/[0.05] focus-visible:bg-charcoal/[0.05] focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        aria-label={open ? t("close") : t("menu")}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? (
          <X className="size-5" strokeWidth={1.75} aria-hidden />
        ) : (
          <Menu className="size-5" strokeWidth={1.75} aria-hidden />
        )}
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]"
              aria-label={t("close")}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="fixed inset-x-0 top-[var(--site-header-height,5.25rem)] z-50 flex max-h-[calc(100dvh-var(--site-header-height,5.25rem))] flex-col overflow-y-auto border-t border-white/10 bg-charcoal shadow-[0_24px_48px_-16px_rgba(0,0,0,0.7)] lg:hidden"
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 pb-8 pt-3 md:px-8">
                <p id={titleId} className="sr-only">
                  {t("mobileNav")}
                </p>

                <MainNav
                  variant="mobile"
                  onNavigate={() => setOpen(false)}
                  className="py-1"
                />

                <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
                  <SearchMenuButton onOpen={openSearch} />

                  <LocaleSwitcher className="min-h-11 px-1" />

                  <Link
                    href="/cranes"
                    className={cn(
                      "inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-brand px-4 text-sm font-semibold tracking-wide text-charcoal transition-colors hover:bg-accent",
                      "focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal focus-visible:outline-none",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {t("viewInventory")}
                    <ArrowRight
                      className="size-4"
                      strokeWidth={2.25}
                      aria-hidden
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
