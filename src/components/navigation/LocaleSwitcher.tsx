"use client";

import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "cn";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

type LocaleSwitcherProps = {
  className?: string;
};

/**
 * Language selector driven by `routing.locales` — only real site languages.
 */
export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <label className={cn("relative inline-flex min-h-10 items-center", className)}>
      <span className="sr-only">{t("label")}</span>
      <select
        className="h-10 max-w-[9.5rem] cursor-pointer appearance-none truncate rounded-[var(--radius)] bg-transparent py-0 pr-8 pl-2.5 text-xs font-semibold tracking-wide text-white/80 outline-none transition-colors duration-200 hover:bg-white/[0.06] hover:text-white focus-visible:bg-white/[0.06] focus-visible:text-white focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
        value={locale}
        onChange={(event) => {
          const next = event.target.value as AppLocale;
          router.replace(pathname, { locale: next });
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
        className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-white/50"
        strokeWidth={1.75}
        aria-hidden
      />
    </label>
  );
}
