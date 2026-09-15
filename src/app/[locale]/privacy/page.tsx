import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Prose } from "@/components/shared/Prose";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getPrivacyDocument } from "@/data/privacy";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    path: "/privacy",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Privacy");
  const tNav = await getTranslations("Nav");
  const tFooter = await getTranslations("Footer");
  const doc = getPrivacyDocument(locale);

  return (
    <PageShell>
      <Breadcrumbs
        className="mb-8"
        items={[
          { label: tNav("home"), href: "/" },
          { label: tFooter("privacy") },
        ]}
      />

      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("subtitle")}
        className="mb-6"
      />

      <p className="mb-2 text-sm text-steel">{doc.updatedLabel}</p>
      {/* Legal-review note: draft privacy copy — counsel review before launch. */}
      <p className="mb-10 max-w-3xl text-sm text-muted-foreground">
        {t("reviewNote")}
      </p>

      <Prose>
        {doc.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
        {doc.sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </section>
        ))}
      </Prose>
    </PageShell>
  );
}
