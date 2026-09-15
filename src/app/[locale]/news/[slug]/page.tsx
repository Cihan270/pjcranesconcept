import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Prose } from "@/components/shared/Prose";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  getNewsArticleBySlug,
  getNewsArticles,
} from "@/data/news";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";

type PageParams = Promise<{ locale: string; slug: string }>;

export async function generateStaticParams() {
  return getNewsArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "News" });
  const article = getNewsArticleBySlug(slug);

  if (!article) {
    return buildPageMetadata({
      locale: locale as AppLocale,
      path: `/news/${slug}`,
      title: t("notFound.title"),
      description: t("notFound.description"),
      noIndex: true,
    });
  }

  return buildPageMetadata({
    locale: locale as AppLocale,
    path: `/news/${article.slug}`,
    title: article.title,
    description: article.excerpt,
    image: article.coverImage,
  });
}

export default async function NewsArticlePage({
  params,
}: {
  params: PageParams;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("News");
  const tNav = await getTranslations("Nav");
  const tFooter = await getTranslations("Footer");
  const article = getNewsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <PageShell>
      <Breadcrumbs
        className="mb-8"
        items={[
          { label: tNav("home"), href: "/" },
          { label: tFooter("news"), href: "/news" },
          { label: article.title },
        ]}
      />

      <SectionHeader
        eyebrow={t("published", { date: article.publishedAt })}
        title={article.title}
        description={article.excerpt}
        className="mb-10"
      />

      <Prose>
        {article.body.split("\n").map((paragraph) =>
          paragraph.trim() ? <p key={paragraph.slice(0, 48)}>{paragraph}</p> : null,
        )}
      </Prose>

      <p className="mt-12">
        <Link
          href="/news"
          className="inline-flex min-h-11 items-center text-sm font-medium underline-offset-4 hover:underline"
        >
          {t("notFound.back")}
        </Link>
      </p>
    </PageShell>
  );
}
