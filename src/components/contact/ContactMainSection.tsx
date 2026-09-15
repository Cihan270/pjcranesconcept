import { getTranslations } from "next-intl/server";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/shared/Reveal";
import type { ContactSubjectKey } from "@/lib/validators/contact";

type ContactMainSectionProps = {
  defaultSubjectKey?: ContactSubjectKey | null;
  craneReference?: string;
  craneSlug?: string;
};

export async function ContactMainSection({
  defaultSubjectKey = null,
  craneReference = "",
  craneSlug = "",
}: ContactMainSectionProps) {
  const t = await getTranslations("Contact.main");

  return (
    <section
      className="border-b border-line bg-background"
      aria-labelledby="contact-main-title"
      id="contact-form-section"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-12 md:px-8 md:py-14 lg:px-12">
        <Reveal className="max-w-2xl space-y-3">
          <p className="font-heading text-[0.6875rem] font-semibold tracking-[0.18em] text-steel uppercase sm:text-xs">
            {t("eyebrow")}
          </p>
          <h2
            id="contact-main-title"
            className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t("body")}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:gap-14 xl:gap-16">
          <Reveal>
            <ContactDetails />
          </Reveal>

          <Reveal delay={0.05} className="min-w-0">
            <div
              id="contact-form"
              className="scroll-mt-28 border border-line bg-surface p-5 md:p-6 lg:p-7"
            >
              <ContactForm
                defaultSubjectKey={defaultSubjectKey}
                defaultCraneReference={craneReference}
                defaultCraneSlug={craneSlug}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
