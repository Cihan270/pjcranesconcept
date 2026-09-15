import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getNewsArticles } from "@/data/news";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "News" });
  const articles = getNewsArticles();
  return buildPageMetadata({
    locale: locale as AppLocale,
    path: "/news",
    title: t("meta.title"),
    description: t("meta.description"),
    noIndex: articles.length === 0,
  });
}

export default async function NewsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("News");
  const tNav = await getTranslations("Nav");
  const tFooter = await getTranslations("Footer");
  const articles = getNewsArticles();

  return (
    <PageShell>
      <Breadcrumbs
        className="mb-8"
        items={[
          { label: tNav("home"), href: "/" },
          { label: tFooter("news") },
        ]}
      />

      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("subtitle")}
        className="mb-10"
      />

      {articles.length === 0 ? (
        <EmptyState
          title={t("empty.title")}
          description={t("empty.description")}
          action={
            <div className="flex flex-wrap gap-3">
              <Link
                href="/cranes"
                className="inline-flex min-h-11 items-center rounded-[var(--radius)] bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t("empty.ctaInventory")}
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center rounded-[var(--radius)] border border-line bg-background px-4 text-sm font-medium transition-colors hover:bg-surface"
              >
                {t("empty.ctaContact")}
              </Link>
            </div>
          }
        />
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {articles.map((article) => (
            <li key={article.id}>
              <Link
                href={`/news/${article.slug}`}
                className="block space-y-2 py-6 transition-colors hover:bg-surface/60 md:py-8"
              >
                <p className="text-xs font-medium tracking-[0.18em] text-steel uppercase">
                  {t("published", { date: article.publishedAt })}
                </p>
                <h2 className="font-heading text-2xl font-semibold tracking-tight">
                  {article.title}
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  {article.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
