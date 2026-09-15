"use client";

import { Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { company } from "@/data/company";
import { cn } from "cn";

type StickyMobileCtaProps = {
  enquiryHref?: string;
  /** Overrides the default "Enquire" label (e.g. sold listings). */
  enquireLabel?: string;
  className?: string;
};

export function StickyMobileCta({
  enquiryHref = "#enquiry",
  enquireLabel,
  className,
}: StickyMobileCtaProps) {
  const t = useTranslations("CraneDetail.sticky");

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm lg:hidden print:hidden",
        className,
      )}
    >
      <div className="mx-auto flex max-w-[1440px] gap-2">
        <a
          href={`tel:${company.phone.tel}`}
          className="focus-ring inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[var(--radius)] border border-line bg-background text-sm font-medium"
        >
          <Phone className="size-4" aria-hidden />
          {t("call")}
        </a>
        <a
          href={enquiryHref}
          className="focus-ring inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[var(--radius)] bg-primary text-sm font-medium text-primary-foreground"
        >
          <Mail className="size-4" aria-hidden />
          {enquireLabel ?? t("enquire")}
        </a>
      </div>
    </div>
  );
}
