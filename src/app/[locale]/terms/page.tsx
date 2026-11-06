import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Prose } from "@/components/shared/Prose";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getTermsDocument } from "@/data/terms";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Terms" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    path: "/terms",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Terms");
  const tNav = await getTranslations("Nav");
  const tFooter = await getTranslations("Footer");
  const doc = getTermsDocument(locale);

  return (
    <PageShell>
      <Breadcrumbs
        className="mb-8"
        items={[
          { label: tNav("home"), href: "/" },
          { label: tFooter("terms") },
        ]}
      />

      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("subtitle")}
        className="mb-6"
      />

      <p className="mb-2 text-sm text-steel">{doc.versionLabel}</p>
      {/* Legal-review note: terms adapted from verified May 2025 EN/NL — counsel review before launch. */}
      <p className="mb-2 max-w-3xl text-sm text-muted-foreground">
        {t("dutchPrevails")}
      </p>
      <p className="mb-10 max-w-3xl text-sm text-muted-foreground">
        {t("reviewNote")}
      </p>

      <Prose>
        {doc.articles.map((article) => (
          <section key={article.number} id={`article-${article.number}`}>
            <h2>
              {t("articleLabel", { number: article.number })} – {article.title}
            </h2>
            <ol className="list-decimal space-y-3 pl-5">
              {article.paragraphs.map((paragraph, index) => (
                <li key={`${article.number}-${index}`} className="whitespace-pre-line">
                  {paragraph}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </Prose>
    </PageShell>
  );
}
