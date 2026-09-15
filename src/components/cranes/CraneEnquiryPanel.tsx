"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FormSuccess } from "@/components/forms/FormSuccess";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { company } from "@/data/company";
import { mapLeadError, submitLead } from "@/lib/forms/submit-lead";
import { contactFormSchema } from "@/lib/validators/contact";
import type { FormLocale } from "@/lib/validators/common";
import { cn } from "cn";

type CraneEnquiryPanelProps = {
  craneReference: string;
  craneSlug: string;
  craneName: string;
  className?: string;
};

export function CraneEnquiryPanel({
  craneReference,
  craneSlug,
  craneName,
  className,
}: CraneEnquiryPanelProps) {
  const t = useTranslations("CraneDetail.enquiry");
  const locale = useLocale() as FormLocale;
  const [formStartedAt] = useState(() => Date.now());

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setServerError(null);

    const parsed = contactFormSchema.safeParse({
      locale,
      source: "crane_detail",
      name,
      email,
      phone,
      company: companyName,
      subject: t("defaultSubject", { crane: craneName, reference: craneReference }),
      message:
        message.trim() ||
        t("defaultMessage", { crane: craneName, reference: craneReference }),
      craneReference,
      craneSlug,
      consent: { privacy: consent ? true : false, marketing: false },
      website,
      formStartedAt,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const next: Record<string, string> = {};
      if (fieldErrors.name?.length) next.name = t("errors.name");
      if (fieldErrors.email?.length) {
        next.email = fieldErrors.email.includes("contact_required")
          ? t("errors.contactRequired")
          : t("errors.email");
      }
      if (fieldErrors.phone?.length) {
        next.phone = fieldErrors.phone.includes("contact_required")
          ? t("errors.contactRequired")
          : t("errors.phone");
      }
      if (fieldErrors.message?.length) next.message = t("errors.message");
      if (fieldErrors.consent?.length) {
        next.consent = t("errors.consent");
      }
      if (Object.keys(next).length === 0) next.form = t("errors.generic");
      setErrors(next);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitLead("/api/contact", parsed.data);
      if (result.ok) {
        setSucceeded(true);
        return;
      }
      setServerError(
        mapLeadError(result.error, {
          config: t("errors.config"),
          generic: t("errors.generic"),
        }),
      );
    } catch {
      setServerError(t("errors.generic"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (succeeded) {
    return (
      <FormSuccess
        title={t("successTitle")}
        description={t("successBody")}
        className={cn("border border-brand/40 bg-brand/10 p-5", className)}
      />
    );
  }

  return (
    <div className={cn("border border-line bg-surface p-5 md:p-6", className)}>
      <div className="space-y-2">
        <p className="font-heading text-xs font-semibold tracking-[0.22em] text-steel uppercase">
          {t("eyebrow")}
        </p>
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          {t("title")}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("subtitle", { crane: craneName })}
        </p>
        <p className="text-sm font-medium tabular-nums text-foreground">
          {t("priceOnRequest")}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <a
          href={`tel:${company.phone.tel}`}
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-line bg-background px-4 font-medium transition-colors hover:border-steel/40"
        >
          {t("call")}
        </a>
        <a
          href={`mailto:${company.email}?subject=${encodeURIComponent(
            t("defaultSubject", { crane: craneName, reference: craneReference }),
          )}`}
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-line bg-background px-4 font-medium transition-colors hover:border-steel/40"
        >
          {t("email")}
        </a>
      </div>

      <form onSubmit={onSubmit} className="relative mt-6 space-y-4" noValidate>
        <div
          className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden"
          aria-hidden
        >
          <label htmlFor="enquiry-website">Website</label>
          <input
            id="enquiry-website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="enquiry-name">{t("name")}</Label>
          <Input
            id="enquiry-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            className="h-11 rounded-[var(--radius)]"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="enquiry-email">{t("emailField")}</Label>
          <Input
            id="enquiry-email"
            type="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="h-11 rounded-[var(--radius)]"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="enquiry-phone">{t("phone")}</Label>
            <Input
              id="enquiry-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              autoComplete="tel"
              className="h-11 rounded-[var(--radius)]"
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone ? (
              <p className="text-sm text-destructive" role="alert">
                {errors.phone}
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="enquiry-company">{t("company")}</Label>
            <Input
              id="enquiry-company"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              autoComplete="organization"
              className="h-11 rounded-[var(--radius)]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="enquiry-message">{t("message")}</Label>
          <Textarea
            id="enquiry-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            placeholder={t("messagePlaceholder")}
            className="rounded-[var(--radius)]"
            aria-invalid={Boolean(errors.message)}
          />
          {errors.message ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.message}
            </p>
          ) : null}
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="enquiry-consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(Boolean(checked))}
            className="mt-0.5"
            aria-invalid={Boolean(errors.consent)}
          />
          <Label
            htmlFor="enquiry-consent"
            className="text-sm leading-snug font-normal text-muted-foreground"
          >
            {t("consent")}
          </Label>
        </div>
        {errors.consent ? (
          <p className="text-sm text-destructive" role="alert">
            {errors.consent}
          </p>
        ) : null}

        {serverError || errors.form ? (
          <p className="text-sm text-destructive" role="alert">
            {serverError ?? errors.form}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent disabled:opacity-60"
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </button>
      </form>
    </div>
  );
}
