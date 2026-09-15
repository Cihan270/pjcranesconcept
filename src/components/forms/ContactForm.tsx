"use client";

import { useMemo, useState } from "react";
import {
  Controller,
  useForm,
  type FieldPath,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { FormSuccess } from "@/components/forms/FormSuccess";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import { mapLeadError, submitLead } from "@/lib/forms/submit-lead";
import type { FormLocale } from "@/lib/validators/common";
import {
  CONTACT_SUBJECT_KEYS,
  contactFormSchema,
  type ContactFormValues,
  type ContactSubjectKey,
} from "@/lib/validators/contact";
import { cn } from "cn";

type ContactFormProps = {
  className?: string;
  source?: ContactFormValues["source"];
  defaultSubjectKey?: ContactSubjectKey | null;
  defaultCraneReference?: string;
  defaultCraneSlug?: string;
};

function isContactSubjectKey(value: string): value is ContactSubjectKey {
  return (CONTACT_SUBJECT_KEYS as readonly string[]).includes(value);
}

export function ContactForm({
  className,
  source = "contact_page",
  defaultSubjectKey = null,
  defaultCraneReference = "",
  defaultCraneSlug = "",
}: ContactFormProps) {
  const t = useTranslations("Contact.form");
  const locale = useLocale() as FormLocale;
  const [formStartedAt] = useState(() => Date.now());
  const [serverError, setServerError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [showErrorSummary, setShowErrorSummary] = useState(false);

  const initialSubject = defaultSubjectKey ?? "";

  const {
    register,
    control,
    handleSubmit,
    watch,
    setFocus,
    getFieldState,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema) as Resolver<ContactFormValues>,
    defaultValues: {
      locale,
      source,
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: initialSubject,
      message: "",
      craneReference: defaultCraneReference,
      craneSlug: defaultCraneSlug,
      website: "",
      formStartedAt,
      consent: { privacy: false as unknown as true, marketing: false },
    },
  });

  const subjectValue = watch("subject");
  const craneReference = watch("craneReference");

  const fieldOrder = useMemo(
    () =>
      [
        "name",
        "company",
        "email",
        "phone",
        "subject",
        "craneReference",
        "message",
        "consent.privacy",
      ] as const satisfies readonly FieldPath<ContactFormValues>[],
    [],
  );

  const onInvalid = () => {
    setShowErrorSummary(true);
    for (const name of fieldOrder) {
      if (getFieldState(name).invalid) {
        try {
          setFocus(name);
        } catch {
          // Some fields may not support focus.
        }
        break;
      }
    }
  };

  const onSubmit: SubmitHandler<ContactFormValues> = async (values) => {
    setServerError(null);
    setShowErrorSummary(false);

    const subjectLabel = isContactSubjectKey(values.subject)
      ? t(`subjects.${values.subject}`)
      : values.subject;

    const result = await submitLead("/api/contact", {
      ...values,
      subject: subjectLabel,
      email: values.email || undefined,
      phone: values.phone || undefined,
    });

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
  };

  if (succeeded) {
    return (
      <FormSuccess
        title={t("successTitle")}
        description={t("successBody")}
        className={cn("border border-brand/40 bg-brand/10 p-5", className)}
      />
    );
  }

  const emailError =
    errors.email?.message === "contact_required"
      ? t("errors.contactRequired")
      : errors.email
        ? t("errors.email")
        : null;
  const phoneError =
    errors.phone?.message === "contact_required"
      ? t("errors.contactRequired")
      : errors.phone
        ? t("errors.phone")
        : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className={cn("relative space-y-4", className)}
      noValidate
      aria-describedby={showErrorSummary ? "contact-error-summary" : undefined}
    >
      <Controller
        name="website"
        control={control}
        render={({ field }) => (
          <HoneypotField
            id="contact-website"
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
      />

      <input type="hidden" {...register("craneSlug")} />

      {showErrorSummary ? (
        <div
          id="contact-error-summary"
          role="alert"
          className="border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {t("errorSummary")}
        </div>
      ) : null}

      {craneReference ? (
        <p className="border border-line bg-background px-3 py-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{t("referenceLabel")}: </span>
          {craneReference}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contact-name">{t("name")}</Label>
          <Input
            id="contact-name"
            autoComplete="name"
            className="h-11 rounded-[var(--radius)]"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-sm text-destructive" role="alert">
              {t("errors.name")}
            </p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-company">
            {t("company")}{" "}
            <span className="font-normal text-muted-foreground">
              ({t("optional")})
            </span>
          </Label>
          <Input
            id="contact-company"
            autoComplete="organization"
            className="h-11 rounded-[var(--radius)]"
            {...register("company")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contact-email">{t("email")}</Label>
          <Input
            id="contact-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className="h-11 rounded-[var(--radius)]"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {emailError ? (
            <p className="text-sm text-destructive" role="alert">
              {emailError}
            </p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-phone">{t("phone")}</Label>
          <Input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            className="h-11 rounded-[var(--radius)]"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
          {phoneError ? (
            <p className="text-sm text-destructive" role="alert">
              {phoneError}
            </p>
          ) : null}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{t("contactHint")}</p>

      <div className="space-y-1.5">
        <Label htmlFor="contact-subject">{t("subject")}</Label>
        <select
          id="contact-subject"
          className={cn(
            "flex h-11 w-full rounded-[var(--radius)] border border-input bg-transparent px-3 text-sm outline-none transition-colors",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
          )}
          aria-invalid={Boolean(errors.subject)}
          {...register("subject")}
        >
          <option value="">{t("subjectPlaceholder")}</option>
          {CONTACT_SUBJECT_KEYS.map((key) => (
            <option key={key} value={key}>
              {t(`subjects.${key}`)}
            </option>
          ))}
        </select>
        {errors.subject ? (
          <p className="text-sm text-destructive" role="alert">
            {t("errors.subject")}
          </p>
        ) : null}
      </div>

      {subjectValue === "sell" ? (
        <p className="border border-line bg-background px-3 py-2.5 text-sm leading-relaxed text-muted-foreground">
          {t.rich("sellHint", {
            link: (chunks) => (
              <Link
                href="/sell-your-crane"
                className="font-medium text-foreground underline-offset-4 hover:text-brand hover:underline"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      ) : null}

      {subjectValue === "source" ? (
        <p className="border border-line bg-background px-3 py-2.5 text-sm leading-relaxed text-muted-foreground">
          {t.rich("sourceHint", {
            link: (chunks) => (
              <Link
                href="/find-a-crane"
                className="font-medium text-foreground underline-offset-4 hover:text-brand hover:underline"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="contact-reference">
          {t("craneReference")}{" "}
          <span className="font-normal text-muted-foreground">
            ({t("optional")})
          </span>
        </Label>
        <Input
          id="contact-reference"
          className="h-11 rounded-[var(--radius)]"
          autoComplete="off"
          {...register("craneReference")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-message">{t("message")}</Label>
        <Textarea
          id="contact-message"
          rows={5}
          className="rounded-[var(--radius)]"
          aria-invalid={Boolean(errors.message)}
          {...register("message")}
        />
        {errors.message ? (
          <p className="text-sm text-destructive" role="alert">
            {t("errors.message")}
          </p>
        ) : null}
      </div>

      <div className="flex items-start gap-3">
        <Controller
          name="consent.privacy"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="contact-consent"
              checked={field.value === true}
              onCheckedChange={(checked) =>
                field.onChange(checked ? true : false)
              }
              className="mt-0.5"
              aria-invalid={Boolean(errors.consent?.privacy)}
            />
          )}
        />
        <Label
          htmlFor="contact-consent"
          className="text-sm leading-snug font-normal text-muted-foreground"
        >
          {t.rich("consent", {
            privacy: (chunks) => (
              <Link
                href="/privacy"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {chunks}
              </Link>
            ),
          })}
        </Label>
      </div>
      {errors.consent?.privacy ? (
        <p className="text-sm text-destructive" role="alert">
          {t("errors.consent")}
        </p>
      ) : null}

      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent disabled:opacity-60"
        aria-busy={isSubmitting}
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
