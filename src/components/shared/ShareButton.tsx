"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";

type ShareButtonProps = {
  title: string;
  text?: string;
  url?: string;
  className?: string;
};

export function ShareButton({
  title,
  text,
  url,
  className,
}: ShareButtonProps) {
  const t = useTranslations("CraneDetail.share");
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const shareUrl =
      url ?? (typeof window !== "undefined" ? window.location.href : "");
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // User cancelled share sheet — ignore.
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-[var(--radius)] border border-line bg-surface px-4 text-sm font-medium transition-colors hover:border-steel/40 hover:bg-background",
        className,
      )}
    >
      {copied ? (
        <Check className="size-4 text-steel" aria-hidden />
      ) : (
        <Share2 className="size-4 text-steel" aria-hidden />
      )}
      {copied ? t("copied") : t("label")}
    </button>
  );
}
