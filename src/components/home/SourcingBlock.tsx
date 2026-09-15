import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { QuickFindForm } from "@/components/forms/QuickFindForm";
import { Reveal } from "@/components/shared/Reveal";

export async function SourcingBlock() {
  const t = await getTranslations("Home.sourcing");

  return (
    <section className="bg-background" aria-labelledby="sourcing-title">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-14 md:px-8 md:py-16 lg:px-12 lg:py-20">
        <Reveal>
          <div className="relative overflow-hidden bg-charcoal text-surface">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_30%,rgba(250,191,3,0.14),transparent_45%)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-brand"
              aria-hidden
            />
            <div className="relative grid gap-10 p-6 md:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16 lg:p-14">
              <div className="max-w-xl space-y-4">
                <p className="font-heading text-xs font-semibold tracking-[0.22em] text-brand uppercase">
                  {t("eyebrow")}
                </p>
                <h2
                  id="sourcing-title"
                  className="font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl"
                >
                  {t("title")}
                </h2>
                <p className="text-base leading-relaxed text-surface/70">
                  {t("body")}
                </p>
                <Link
                  href="/find-a-crane"
                  className="focus-ring group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand underline-offset-4 hover:underline"
                >
                  {t("detailedLink")}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </div>

              <QuickFindForm />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
