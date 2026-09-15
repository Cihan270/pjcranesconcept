import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/shared/Reveal";

const EXPERTISE_KEYS = [
  "market",
  "network",
  "communication",
  "handover",
] as const;

export async function AboutExpertise() {
  const t = await getTranslations("About.expertise");

  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-14 md:px-8 md:py-16 lg:px-12 lg:py-20">
        <Reveal className="mx-auto mb-10 max-w-2xl space-y-3 text-center md:mb-12">
          <p className="font-heading text-xs font-semibold tracking-[0.22em] text-steel uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="font-heading text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl">
            {t("title")}
          </h2>
        </Reveal>

        <ul className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {EXPERTISE_KEYS.map((key, index) => (
            <Reveal key={key} delay={index * 0.04}>
              <li
                className={`relative h-full border-line px-1 py-6 sm:px-5 sm:py-0 lg:px-6 ${
                  index > 0 ? "border-t sm:border-t-0" : ""
                } ${
                  index % 2 === 1 ? "sm:border-l" : ""
                } ${
                  index >= 2 ? "sm:border-t lg:border-t-0" : ""
                } ${
                  index > 0 ? "lg:border-l" : ""
                }`}
              >
                <p className="font-heading text-sm font-semibold tracking-[0.18em] text-brand tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight text-foreground">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`items.${key}.body`)}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
