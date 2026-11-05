"use client";

import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "cn";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

type LocaleSwitcherProps = {
  className?: string;
  /** `light` for the white header bar; `dark` (default) for the dark mobile drawer. */
  tone?: "light" | "dark";
};

/**
 * Language selector driven by `routing.locales` — only real site languages.
 */
export function LocaleSwitcher({ className, tone = "dark" }: LocaleSwitcherProps) {
  const light = tone === "light";
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <label className={cn("relative inline-flex min-h-10 items-center", className)}>
      <span className="sr-only">{t("label")}</span>
      <select
        className={cn(
          "h-10 max-w-[9.5rem] cursor-pointer appearance-none truncate rounded-[var(--radius)] bg-transparent py-0 pr-8 pl-2.5 text-xs font-semibold tracking-wide outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2",
          light
            ? "text-steel hover:bg-charcoal/[0.05] hover:text-charcoal focus-visible:bg-charcoal/[0.05] focus-visible:text-charcoal focus-visible:ring-offset-white"
            : "text-white/80 hover:bg-white/[0.06] hover:text-white focus-visible:bg-white/[0.06] focus-visible:text-white focus-visible:ring-offset-charcoal",
        )}
        value={locale}
        onChange={(event) => {
          const next = event.target.value as AppLocale;
          // Keep filters / prefills (e.g. ?manufacturer=…, ?subject=…) and the anchor.
          // Read at click time so the switcher needs no Suspense boundary.
          const { search, hash } = window.location;
          router.replace(`${pathname}${search}${hash}`, { locale: next });
        }}
        aria-label={t("label")}
      >
        {routing.locales.map((code) => (
          <option key={code} value={code} className="bg-charcoal text-white">
            {t(code)}
          </option>
        ))}
      </select>
      <ChevronDown
        className={cn(
          "pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2",
          light ? "text-steel/70" : "text-white/50",
        )}
        strokeWidth={1.75}
        aria-hidden
      />
    </label>
  );
}
