import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Link } from "@/i18n/navigation";
import {
  company,
  getConfiguredSocialLinks,
  getHeadquartersMapUrl,
} from "@/data/company";
import {
  getHeadquartersOffice,
  getOfficeMapUrl,
  officesOverviewHref,
} from "@/data/offices";
import { cn } from "cn";

const linkClass =
  "focus-ring rounded-[var(--radius)] text-surface/80 transition-colors hover:text-brand";

const mutedLinkClass =
  "focus-ring rounded-[var(--radius)] text-surface/60 transition-colors hover:text-brand";

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-heading text-xs font-semibold tracking-[0.18em] text-brand uppercase">
      {children}
    </h2>
  );
}

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const year = new Date().getFullYear();
  const headquarters = getHeadquartersOffice();
  const mapUrl =
    getOfficeMapUrl(headquarters) ?? getHeadquartersMapUrl();
  const socialLinks = getConfiguredSocialLinks();
  const showWhatsApp = Boolean(company.whatsapp);

  const companyLinks = [
    { href: "/about", label: tNav("about") },
    { href: "/news", label: t("news") },
    { href: "/faq", label: t("faq") },
    { href: "/contact", label: tNav("contact") },
    { href: officesOverviewHref, label: t("offices") },
  ] as const;

  const serviceLinks = [
    { href: "/cranes", label: tNav("cranes") },
    { href: "/find-a-crane", label: tNav("find") },
    { href: "/sell-your-crane", label: tNav("sell") },
    { href: "/services/transport-shipping", label: t("transport") },
    {
      href: "/services/documentation-export",
      label: t("documentation"),
    },
  ] as const;

  return (
    <footer className="mt-auto border-t border-white/10 bg-charcoal text-surface">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 md:px-8 lg:grid-cols-4 lg:gap-x-10 lg:px-12 lg:py-12">
        {/* 1. Company */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <BrandLogo
            header
            className="h-8 w-[10rem] md:h-9 md:w-[11rem]"
          />
          <p className="max-w-sm text-sm leading-relaxed text-surface/75">
            {t("tagline")}
          </p>
          {socialLinks.length > 0 ? (
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {socialLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* 2. Company links */}
        <div className="space-y-3">
          <FooterHeading>{t("company")}</FooterHeading>
          <ul className="space-y-2 text-sm">
            {companyLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Services */}
        <div className="space-y-3">
          <FooterHeading>{t("services")}</FooterHeading>
          <ul className="space-y-2 text-sm">
            {serviceLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Contact */}
        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
          <FooterHeading>{t("contact")}</FooterHeading>
          <address className="space-y-3 text-sm not-italic">
            <div className="space-y-1">
              <p className="text-xs font-medium tracking-wide text-surface/55 uppercase">
                {t("headOffice")}
              </p>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(linkClass, "block leading-relaxed")}
              >
                <span className="block">{headquarters.street}</span>
                <span className="block">
                  {headquarters.postalCode} {headquarters.city}
                </span>
                <span className="block">{headquarters.country}</span>
              </a>
            </div>

            <div className="space-y-2">
              <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="min-w-[4.5rem] text-xs text-surface/55">
                  {t("phoneGeneral")}
                </span>
                <a href={`tel:${company.phone.tel}`} className={linkClass}>
                  {company.phone.display}
                </a>
              </p>
              <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="min-w-[4.5rem] text-xs text-surface/55">
                  {t("phoneSales")}
                </span>
                <a href={`tel:${company.mobile.tel}`} className={linkClass}>
                  {company.mobile.display}
                </a>
              </p>
              <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="min-w-[4.5rem] text-xs text-surface/55">
                  {t("emailLabel")}
                </span>
                <a href={`mailto:${company.email}`} className={linkClass}>
                  {company.email}
                </a>
              </p>
              {showWhatsApp && company.whatsapp ? (
                <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="min-w-[4.5rem] text-xs text-surface/55">
                    {t("whatsapp")}
                  </span>
                  <a
                    href={`https://wa.me/${company.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {t("whatsapp")}
                  </a>
                </p>
              ) : null}
            </div>

            <p>
              <Link href={officesOverviewHref} className={linkClass}>
                {t("viewAllOffices")}
              </Link>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-4 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-12">
          <div className="space-y-1">
            <p className="text-xs text-surface/60">
              © {year} {company.legalName}. {t("rights")}
            </p>
            <p className="text-[0.6875rem] leading-relaxed text-surface/45">
              {t("kvk")}: {company.kvk}
              <span className="mx-2 text-surface/25" aria-hidden>
                ·
              </span>
              {t("vat")}: {company.vat}
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <li>
              <Link href="/privacy" className={mutedLinkClass}>
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link href="/terms" className={mutedLinkClass}>
                {t("terms")}
              </Link>
            </li>
            <li>
              <Link href="/privacy#cookies" className={mutedLinkClass}>
                {t("cookies")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
