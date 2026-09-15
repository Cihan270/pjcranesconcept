import { getTranslations } from "next-intl/server";
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Smartphone,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { company, getHeadquartersMapUrl } from "@/data/company";
import { officesOverviewHref } from "@/data/offices";

export async function ContactDetails() {
  const t = await getTranslations("Contact.details");
  const tFooter = await getTranslations("Footer");
  const mapUrl = getHeadquartersMapUrl();

  const rows = [
    {
      id: "general",
      icon: Phone,
      label: t("general"),
      href: `tel:${company.phone.tel}`,
      value: company.phone.display,
      external: false,
    },
    {
      id: "sales",
      icon: Smartphone,
      label: t("sales"),
      href: `tel:${company.mobile.tel}`,
      value: company.mobile.display,
      external: false,
    },
    {
      id: "email",
      icon: Mail,
      label: t("email"),
      href: `mailto:${company.email}`,
      value: company.email,
      external: false,
    },
    ...(company.whatsapp
      ? [
          {
            id: "whatsapp",
            icon: MessageCircle,
            label: t("whatsapp"),
            href: `https://wa.me/${company.whatsapp}`,
            value: t("whatsappAction"),
            external: true,
          },
        ]
      : []),
  ] as const;

  return (
    <div className="space-y-0">
      {rows.map((row) => {
        const Icon = row.icon;
        return (
          <div
            key={row.id}
            className="flex items-start gap-3 border-b border-line py-4 first:pt-0"
          >
            <Icon
              className="mt-0.5 size-4 shrink-0 text-brand"
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-steel uppercase">
                {row.label}
              </p>
              <a
                href={row.href}
                className="focus-ring mt-1 inline-block rounded-[var(--radius)] text-sm font-medium tabular-nums text-foreground transition-colors hover:text-brand"
                {...(row.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {row.value}
              </a>
            </div>
          </div>
        );
      })}

      <div className="flex items-start gap-3 border-b border-line py-4">
        <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-steel uppercase">
            {t("headOffice")}
          </p>
          <address className="text-sm leading-relaxed text-foreground not-italic">
            {company.legalName}
            <br />
            {company.address.street}
            <br />
            {company.address.postalCode} {company.address.city}
            <br />
            {company.address.country}
          </address>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-brand hover:underline"
          >
            {t("directions")}
          </a>
        </div>
      </div>

      <div className="pt-4">
        <Link
          href={officesOverviewHref}
          className="focus-ring text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-brand hover:underline"
        >
          {tFooter("viewAllOffices")}
        </Link>
      </div>
    </div>
  );
}
