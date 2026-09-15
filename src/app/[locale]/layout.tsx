import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Barlow_Condensed, IBM_Plex_Sans } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { routing, type AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { organizationJsonLd } from "@/lib/seo/json-ld";
import "../globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const page = buildPageMetadata({
    locale: locale as AppLocale,
    path: "",
    title: t("title"),
    description: t("description"),
  });

  return {
    ...page,
    title: {
      default: t("title"),
      template: `%s · ${"PJ Cranes"}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: "Nav" });

  return (
    <html
      lang={locale}
      className={`${barlowCondensed.variable} ${ibmPlexSans.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-sans antialiased">
        <NextIntlClientProvider>
          <NuqsAdapter>
            <a
              href="#main-content"
              className="bg-primary text-primary-foreground focus-ring sr-only fixed top-3 left-3 z-[100] rounded-[var(--radius)] px-4 py-3 text-sm font-medium focus:not-sr-only"
            >
              {tNav("skipToContent")}
            </a>
            <JsonLd data={organizationJsonLd()} />
            <SiteHeader />
            <div id="main-content" tabIndex={-1} className="flex min-h-0 flex-1 flex-col outline-none">
              {children}
            </div>
            <SiteFooter />
          </NuqsAdapter>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
