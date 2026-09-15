import { getTranslations } from "next-intl/server";
import { Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HeadquartersMap } from "@/components/contact/HeadquartersMap";
import { Reveal } from "@/components/shared/Reveal";
import {
  company,
  getHeadquartersMapUrl,
  getHeadquartersOsmEmbedUrl,
} from "@/data/company";
import { officeCount, offices, officesOverviewHref } from "@/data/offices";

export async function ContactHeadOffice() {
  const t = await getTranslations("Contact.headOffice");
  const tNetwork = await getTranslations("About.network.offices");
  const directionsUrl = getHeadquartersMapUrl();
  const embedUrl = getHeadquartersOsmEmbedUrl();

  const countries = offices
    .map((office) => {
      const city = tNetwork(`${office.id}.city`);
      const country = tNetwork(`${office.id}.country`);
      if (city) return `${city}, ${country}`;
      return country;
    })
    .filter(Boolean);

  return (
    <section
      className="border-b border-line bg-background"
      aria-labelledby="contact-hq-title"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-12 md:px-8 md:py-14 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-12 xl:gap-16">
          <Reveal className="space-y-6">
            <div className="space-y-3">
              <p className="font-heading text-[0.6875rem] font-semibold tracking-[0.18em] text-steel uppercase sm:text-xs">
                {t("eyebrow")}
              </p>
              <h2
                id="contact-hq-title"
                className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
              >
                {t("title")}
              </h2>
            </div>

            <address className="space-y-1 text-base leading-relaxed text-foreground not-italic">
              <p className="font-medium">{company.legalName}</p>
              <p>{company.address.street}</p>
              <p>
                {company.address.postalCode} {company.address.city}
              </p>
              <p>{company.address.country}</p>
            </address>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent"
              >
                {t("directions")}
              </a>
              <a
                href={`tel:${company.phone.tel}`}
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius)] border border-line bg-surface px-5 text-sm font-medium transition-colors hover:border-charcoal"
              >
                <Phone className="size-4 text-brand" aria-hidden />
                {t("callOffice")}
              </a>
              <Link
                href={officesOverviewHref}
                className="focus-ring inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-line bg-surface px-5 text-sm font-medium transition-colors hover:border-charcoal"
              >
                {t("viewOffices")}
              </Link>
            </div>

            <div className="border-t border-line pt-6">
              <h3 className="font-heading text-xl font-semibold tracking-tight">
                {t("internationalTitle")}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                {t("internationalBody", { count: officeCount })}
              </p>
              <p className="mt-3 text-sm text-steel">{countries.join(" · ")}</p>
              <Link
                href={officesOverviewHref}
                className="focus-ring mt-4 inline-flex text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-brand hover:underline"
              >
                {t("internationalCta")}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <HeadquartersMap
              embedUrl={embedUrl}
              title={t("mapTitle")}
              loadLabel={t("mapLoad")}
              markerLabel={t("mapMarker")}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
