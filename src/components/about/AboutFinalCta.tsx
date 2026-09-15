import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/shared/Reveal";

export async function AboutFinalCta() {
  const t = await getTranslations("About.finalCta");

  return (
    <section
      className="relative isolate overflow-hidden bg-charcoal text-surface"
      aria-labelledby="about-final-cta-title"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(250,191,3,0.1),transparent_45%),linear-gradient(135deg,#141416_0%,#1f1f22_55%,#141416_100%)]"
        aria-hidden
      />
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-12 md:flex-row md:items-end md:justify-between md:gap-10 md:px-8 md:py-14 lg:px-12 lg:py-16">
        <Reveal className="max-w-xl space-y-3">
          <h2
            id="about-final-cta-title"
            className="font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="text-base leading-relaxed text-surface/70">{t("body")}</p>
        </Reveal>

        <Reveal delay={0.06} className="flex flex-col gap-3 sm:items-start">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/cranes"
              className="focus-ring group inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
            >
              {t("ctaInventory")}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <Link
              href="/contact"
              className="focus-ring inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] border border-white/20 px-6 text-sm font-medium text-surface transition-colors hover:border-brand hover:text-brand"
            >
              {t("ctaContact")}
            </Link>
          </div>
          <Link
            href="/sell-your-crane"
            className="focus-ring text-sm text-surface/70 underline-offset-4 hover:text-brand hover:underline"
          >
            {t("ctaSell")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
