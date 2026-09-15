import { company } from "@/data/company";
import { routing, type AppLocale } from "@/i18n/routing";

/**
 * Public site origin. Prefer NEXT_PUBLIC_SITE_URL in deploy; fall back to verified domain.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return company.siteUrl;
}

/** Absolute URL for a locale + path (path may be "" or start with `/`). */
export function absoluteUrl(locale: AppLocale | string, path = ""): string {
  const normalized = normalizePath(path);
  const base = getSiteUrl();
  return `${base}/${locale}${normalized}`;
}

export function normalizePath(path: string): string {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

/** hreflang map for a path, including `x-default` → default locale. */
export function languageAlternates(
  path = "",
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(locale, path);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);
  return languages;
}
