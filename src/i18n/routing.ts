import { defineRouting } from "next-intl/routing";

export const locales = ["nl", "en", "de", "es", "fr"] as const;

export type AppLocale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "nl",
  localePrefix: "always",
});
