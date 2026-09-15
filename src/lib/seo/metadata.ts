import type { Metadata } from "next";
import { company } from "@/data/company";
import type { Crane } from "@/types/crane";
import type { AppLocale } from "@/i18n/routing";
import {
  absoluteUrl,
  getSiteUrl,
  languageAlternates,
  normalizePath,
} from "@/lib/seo/site";

export type PageMetaInput = {
  locale: AppLocale | string;
  /** Path without locale prefix, e.g. `/cranes` or `` for home. */
  path?: string;
  title: string;
  description: string;
  /** Absolute or site-relative image URL for OG/Twitter. */
  image?: string;
  /** When true, page should not be indexed (e.g. empty news stubs). */
  noIndex?: boolean;
};

function resolveOgImage(image?: string): string | undefined {
  if (!image) return undefined;
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  const base = getSiteUrl();
  return `${base}${image.startsWith("/") ? image : `/${image}`}`;
}

/**
 * Shared metadata builder: canonical + hreflang + Open Graph / Twitter.
 */
export function buildPageMetadata({
  locale,
  path = "",
  title,
  description,
  image,
  noIndex = false,
}: PageMetaInput): Metadata {
  const pathname = normalizePath(path);
  const canonical = absoluteUrl(locale, pathname);
  const ogImage = resolveOgImage(image);

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(pathname),
    },
    openGraph: {
      type: "website",
      locale: String(locale),
      url: canonical,
      siteName: company.brandName,
      title,
      description,
      ...(ogImage
        ? { images: [{ url: ogImage, alt: title }] }
        : undefined),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : undefined),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/** Crane detail metadata — uses real listing fields only (no fabricated price). */
export function buildCraneMetadata(
  locale: AppLocale | string,
  crane: Crane,
): Metadata {
  const title =
    crane.seo?.title ??
    `${crane.manufacturer} ${crane.model} (${crane.year}) · ${crane.reference}`;
  const description =
    crane.seo?.description ??
    crane.description ??
    `${crane.manufacturer} ${crane.model}, ${crane.year}. Ref. ${crane.reference}. ${company.brandName} inventory.`;
  const primary =
    crane.images.find((img) => img.primary) ?? crane.images[0];

  return buildPageMetadata({
    locale,
    path: `/cranes/${crane.slug}`,
    title,
    description,
    image: primary?.src,
  });
}
