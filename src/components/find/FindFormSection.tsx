import { getTranslations } from "next-intl/server";
import {
  FindCraneForm,
  type FindSimilarCrane,
} from "@/components/forms/FindCraneForm";
import { FindProcess } from "@/components/find/FindProcess";
import { Reveal } from "@/components/shared/Reveal";
import { company } from "@/data/company";

type FindFormSectionProps = {
  similarTo?: FindSimilarCrane | null;
};

export async function FindFormSection({ similarTo = null }: FindFormSectionProps) {
  const t = await getTranslations("Find.formSection");

  return (
    <section
      id="find-form"
      className="scroll-mt-24 border-b border-line bg-background"
      aria-labelledby="find-form-title"
    >
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-4 py-12 md:px-8 md:py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-14 lg:px-12 lg:py-16">
        <Reveal className="order-2 lg:order-1">
          <FindProcess />
        </Reveal>

        <Reveal delay={0.06} className="order-1 lg:order-2">
          <div className="border border-line bg-surface p-5 md:p-7 lg:sticky lg:top-24">
            <div className="mb-6 space-y-2 border-b border-line pb-6">
              <h2
                id="find-form-title"
                className="font-heading text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl"
              >
                {t("title")}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {t.rich("body", {
                  phone: (chunks) => (
                    <a
                      href={`tel:${company.phone.tel}`}
                      className="font-medium text-brand transition-colors hover:text-accent"
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </p>
            </div>
            <FindCraneForm similarTo={similarTo} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
