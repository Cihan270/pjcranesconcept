import { getTranslations } from "next-intl/server";
import { company } from "@/data/company";

type DatasheetPrintHeaderProps = {
  craneReference: string;
  /** Absolute URL of the listing, printed so a paper copy leads back online. */
  url: string;
};

/** Letterhead that only appears when the crane page is printed / saved as PDF. */
export async function DatasheetPrintHeader({
  craneReference,
  url,
}: DatasheetPrintHeaderProps) {
  const t = await getTranslations("CraneDetail.datasheet");

  return (
    <div className="mb-6 hidden items-end justify-between gap-6 border-b-2 border-charcoal pb-4 print:flex">
      <div className="space-y-2">
        {/* eslint-disable-next-line @next/next/no-img-element -- plain img prints reliably */}
        <img src="/brand/logo.svg" alt={company.brandName} className="h-10 w-auto" />
        <p className="font-heading text-xs font-semibold tracking-[0.2em] uppercase">
          {t("title")} · {craneReference}
        </p>
      </div>
      <div className="text-right text-xs leading-relaxed">
        <p className="font-semibold">{company.legalName}</p>
        <p>
          {company.address.street}, {company.address.postalCode}{" "}
          {company.address.city}
        </p>
        <p className="tabular-nums">
          {company.phone.display} · {company.email}
        </p>
        <p className="break-all text-steel">{url}</p>
      </div>
    </div>
  );
}
