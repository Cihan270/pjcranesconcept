"use client";

import { Camera, Printer, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { ENQUIRY_REQUEST_EVENT } from "@/components/cranes/CraneEnquiryPanel";
import type { CraneRequestType } from "@/lib/validators/contact";
import { cn } from "cn";

type CraneActionsProps = {
  /** Sold cranes only get the datasheet action. */
  sold?: boolean;
  className?: string;
};

const buttonClass =
  "focus-ring inline-flex min-h-11 items-center gap-2 rounded-[var(--radius)] border border-line bg-surface px-3 text-sm font-medium transition-colors hover:border-steel/40 hover:bg-background sm:px-4";

export function CraneActions({ sold = false, className }: CraneActionsProps) {
  const t = useTranslations("CraneDetail.actions");

  function request(type: CraneRequestType) {
    window.dispatchEvent(
      new CustomEvent(ENQUIRY_REQUEST_EVENT, { detail: type }),
    );
    const panel = document.getElementById("enquiry");
    panel?.scrollIntoView({ behavior: "smooth", block: "start" });
    panel
      ?.querySelector<HTMLInputElement>("#enquiry-name")
      ?.focus({ preventScroll: true });
  }

  return (
    <div className={cn("contents print:hidden", className)}>
      {!sold ? (
        <>
          <button
            type="button"
            className={buttonClass}
            onClick={() => request("media")}
          >
            <Camera className="size-4 text-steel" aria-hidden />
            {t("media")}
          </button>
          <button
            type="button"
            className={buttonClass}
            onClick={() => request("transport")}
          >
            <Truck className="size-4 text-steel" aria-hidden />
            {t("transport")}
          </button>
        </>
      ) : null}
      <button
        type="button"
        className={buttonClass}
        onClick={() => window.print()}
      >
        <Printer className="size-4 text-steel" aria-hidden />
        {t("datasheet")}
      </button>
    </div>
  );
}
