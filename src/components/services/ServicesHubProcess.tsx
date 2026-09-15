import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/shared/Reveal";

const STEP_KEYS = [
  "brief",
  "match",
  "agree",
  "paperwork",
  "deliver",
] as const;

export async function ServicesHubProcess() {
  const t = await getTranslations("Services.hub.process");

  const steps = STEP_KEYS.map((key) => ({
    key,
    title: t(`steps.${key}.title`),
    body: t(`steps.${key}.body`),
  }));

  return (
    <section
      className="border-b border-line bg-surface"
      aria-labelledby="services-process-title"
    >
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-4 py-12 md:px-8 md:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-14 lg:px-12 lg:py-16">
        <Reveal className="max-w-xl space-y-3 lg:sticky lg:top-24">
          <p className="font-heading text-xs font-semibold tracking-[0.22em] text-brand uppercase">
            {t("eyebrow")}
          </p>
          <h2
            id="services-process-title"
            className="font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t("body")}
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <ol className="divide-y divide-line border-y border-line">
            {steps.map((step, index) => (
              <li
                key={step.key}
                className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 py-5"
              >
                <span
                  className="mt-0.5 flex size-7 items-center justify-center bg-brand font-heading text-xs font-semibold text-brand-foreground tabular-nums"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
