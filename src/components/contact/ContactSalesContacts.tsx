import { getTranslations } from "next-intl/server";
import { Mail, Phone } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { company } from "@/data/company";

export async function ContactSalesContacts() {
  const t = await getTranslations("Contact.salesContacts");

  return (
    <section
      className="border-b border-line bg-background"
      aria-labelledby="contact-sales-title"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-12 md:px-8 md:py-14 lg:px-12">
        <Reveal className="max-w-2xl space-y-3">
          <p className="font-heading text-[0.6875rem] font-semibold tracking-[0.18em] text-steel uppercase sm:text-xs">
            {t("eyebrow")}
          </p>
          <h2
            id="contact-sales-title"
            className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t("body")}
          </p>
        </Reveal>

        <ul className="mt-8 divide-y divide-line border-y border-line">
          {company.contacts.map((contact) => (
            <li
              key={contact.name}
              className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
            >
              <div className="min-w-0">
                <p className="font-heading text-xl font-semibold tracking-tight">
                  {contact.name}
                </p>
                <p className="mt-0.5 text-sm text-steel">{contact.role}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`tel:${company.mobile.tel}`}
                  className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-[var(--radius)] border border-line bg-surface px-3.5 text-sm font-medium transition-colors hover:border-charcoal hover:text-charcoal"
                >
                  <Phone className="size-3.5 text-brand" aria-hidden />
                  {t("call")}
                </a>
                <a
                  href={`mailto:${company.email}`}
                  className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-[var(--radius)] border border-line bg-surface px-3.5 text-sm font-medium transition-colors hover:border-charcoal hover:text-charcoal"
                >
                  <Mail className="size-3.5 text-brand" aria-hidden />
                  {t("email")}
                </a>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm text-muted-foreground">{t("sharedNote")}</p>
      </div>
    </section>
  );
}
