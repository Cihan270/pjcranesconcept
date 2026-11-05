import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/shared/Reveal";

const STEP_KEYS = ["request", "assessment", "agreement", "transport"] as const;

export async function ProcessSection() {
  const t = await getTranslations("Home.process");

  const steps = STEP_KEYS.map((key) => ({
    key,
    title: t(`steps.${key}.title`),
    body: t(`steps.${key}.body`),
  }));

  return (
    <section
      className="bg-charcoal text-surface"
      aria-labelledby="process-title"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-14 md:px-8 md:py-16 lg:px-12">
        <Reveal>
          <div className="max-w-xl space-y-3">
            <p className="font-heading text-xs font-semibold tracking-[0.22em] text-brand uppercase">
              {t("eyebrow")}
            </p>
            <h2
              id="process-title"
              className="font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl md:text-[2.65rem]"
            >
              {t("title")}
            </h2>
            <p className="text-base leading-relaxed text-surface/70">
              {t("body")}
            </p>
          </div>
        </Reveal>

        {/* Mobile: vertical timeline */}
        <Reveal delay={0.06} className="mt-10 md:hidden">
          <ol className="space-y-0">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              return (
                <li
                  key={step.key}
                  className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4"
                >
                  <div className="flex flex-col items-center" aria-hidden>
                    <span className="font-heading text-sm font-semibold tabular-nums text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {!isLast ? (
                      <span className="mt-2 w-px flex-1 min-h-[2.5rem] bg-surface/15" />
                    ) : null}
                  </div>
                  <div className={isLast ? "pb-0 pt-0.5" : "pb-8 pt-0.5"}>
                    <h3 className="font-heading text-lg font-semibold tracking-tight text-surface">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-surface/65">
                      {step.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>

        {/* Desktop: horizontal process */}
        <Reveal delay={0.06} className="mt-12 hidden md:block">
          <ol className="grid grid-cols-4 gap-x-8 lg:gap-x-10">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              return (
                <li key={step.key} className="relative min-w-0">
                  <div className="relative flex items-center">
                    <span
                      className="relative z-10 bg-charcoal pr-3 font-heading text-sm font-semibold tabular-nums text-brand"
                      aria-hidden
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {!isLast ? (
                      <span
                        className="absolute top-1/2 left-8 -right-8 h-px -translate-y-1/2 bg-surface/15 lg:-right-10"
                        aria-hidden
                      />
                    ) : null}
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight text-surface lg:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-surface/65">
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 md:mt-12">
          <Link
            href="/contact"
            className="focus-ring group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-surface/80 underline decoration-surface/30 underline-offset-[0.35em] transition-colors hover:text-surface hover:decoration-brand"
          >
            {t("cta")}
            <ArrowRight
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
