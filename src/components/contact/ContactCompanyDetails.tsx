import { getTranslations } from "next-intl/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/shared/Reveal";
import { company } from "@/data/company";

export async function ContactCompanyDetails() {
  const t = await getTranslations("Contact.company");
  const tFooter = await getTranslations("Footer");

  return (
    <section
      className="border-b border-line bg-background"
      aria-labelledby="contact-company-title"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 md:py-12 lg:px-12">
        <Reveal>
          <h2
            id="contact-company-title"
            className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {t("title")}
          </h2>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-[0.65rem] font-semibold tracking-[0.14em] text-steel uppercase">
                {t("legalName")}
              </dt>
              <dd className="mt-1 text-sm text-foreground">{company.legalName}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] font-semibold tracking-[0.14em] text-steel uppercase">
                {t("address")}
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {company.address.street}, {company.address.postalCode}{" "}
                {company.address.city}, {company.address.country}
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] font-semibold tracking-[0.14em] text-steel uppercase">
                {tFooter("kvk")}
              </dt>
              <dd className="mt-1 text-sm tabular-nums text-foreground">
                {company.kvk}
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] font-semibold tracking-[0.14em] text-steel uppercase">
                {tFooter("vat")}
              </dt>
              <dd className="mt-1 text-sm tabular-nums text-foreground">
                {company.vat}
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] font-semibold tracking-[0.14em] text-steel uppercase">
                {tFooter("emailLabel")}
              </dt>
              <dd className="mt-1 text-sm">
                <a
                  href={`mailto:${company.email}`}
                  className="focus-ring rounded-[var(--radius)] font-medium transition-colors hover:text-brand"
                >
                  {company.email}
                </a>
              </dd>
            </div>
          </dl>

          <Accordion className="mt-6 border-t border-line">
            <AccordionItem value="invoicing" className="border-b-0">
              <AccordionTrigger className="min-h-11 rounded-none px-0 py-4 text-left font-heading text-base font-semibold tracking-tight hover:no-underline">
                {t("invoiceTitle")}
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-4 text-sm leading-relaxed text-muted-foreground">
                <p>{t("invoiceBody")}</p>
                <p className="mt-3">
                  <a
                    href={`mailto:${company.email}`}
                    className="focus-ring font-medium text-foreground underline-offset-4 transition-colors hover:text-brand hover:underline"
                  >
                    {company.email}
                  </a>
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
