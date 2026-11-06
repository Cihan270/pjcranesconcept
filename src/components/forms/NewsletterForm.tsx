"use client";

import { useState } from "react";
import {
  Controller,
  useForm,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mapLeadError, submitLead } from "@/lib/forms/submit-lead";
import type { FormLocale } from "@/lib/validators/common";
import {
  newsletterFormSchema,
  type NewsletterFormValues,
} from "@/lib/validators/newsletter";
import { cn } from "cn";

type NewsletterFormProps = {
  className?: string;
  inverted?: boolean;
};

const invertedFieldClass =
  "border-white/25 bg-white/5 text-surface placeholder:text-surface/45";

export function NewsletterForm({
  className,
  inverted = false,
}: NewsletterFormProps) {
  const t = useTranslations("Home.newsletter");
  const locale = useLocale() as FormLocale;
  const [formStartedAt] = useState(() => Date.now());
  const [serverError, setServerError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(
      newsletterFormSchema,
    ) as Resolver<NewsletterFormValues>,
    defaultValues: {
      locale,
      source: "newsletter",
      email: "",
      website: "",
      formStartedAt,
      consentMarketing: false as unknown as true,
    },
  });

  const onSubmit: SubmitHandler<NewsletterFormValues> = async (values) => {
    if (isSubmitting || succeeded) return;
    setServerError(null);
    const result = await submitLead("/api/newsletter", values);
    if (result.ok) {
      setSucceeded(true);
      return;
    }
    setServerError(
      mapLeadError(result.error, {
        config: t("errorConfig"),
        generic: t("error"),
      }),
    );
  };

  if (succeeded) {
    return (
      <div
        role="status"
        className={cn(
          "space-y-2 border p-4",
          inverted
            ? "border-brand/50 bg-brand/10"
            : "border-brand/40 bg-brand/10",
        )}
      >
        <p
          className={cn(
            "font-heading text-lg font-semibold tracking-tight",
            inverted ? "text-surface" : "text-foreground",
          )}
        >
          {t("successTitle")}
        </p>
        <p
          className={cn(
            "text-sm leading-relaxed",
            inverted ? "text-surface/75" : "text-muted-foreground",
          )}
        >
          {t("successBody")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("relative space-y-3", className)}
      noValidate
    >
      <Controller
        name="website"
        control={control}
        render={({ field }) => (
          <HoneypotField
            id="newsletter-website"
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
      />

      <div className="space-y-1.5">
        <Label htmlFor="newsletter-email" className="sr-only">
          {t("email")}
        </Label>
        <div
          className={cn(
            "flex flex-col gap-2 sm:flex-row sm:items-stretch",
            inverted &&
              "rounded-[var(--radius)] sm:gap-0 sm:overflow-hidden sm:border sm:border-white/25 sm:bg-white/5 sm:focus-within:border-brand/60",
          )}
        >
          <Input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            aria-invalid={Boolean(errors.email)}
            className={cn(
              "h-11 min-w-0 flex-1 rounded-[var(--radius)]",
              inverted &&
                cn(
                  invertedFieldClass,
                  "sm:border-0 sm:bg-transparent sm:shadow-none sm:focus-visible:ring-0",
                ),
            )}
            placeholder={t("emailPlaceholder")}
            {...register("email")}
          />
          <button
            type="submit"
            disabled={isSubmitting || succeeded}
            className={cn(
              "inline-flex h-11 shrink-0 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-60",
              inverted && "sm:rounded-none",
            )}
          >
            {isSubmitting ? t("submitting") : t("submit")}
          </button>
        </div>
        {errors.email ? (
          <p className="text-sm text-destructive" role="alert">
            {t("emailInvalid")}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-start gap-2.5">
          <Controller
            name="consentMarketing"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="newsletter-consent"
                checked={field.value === true}
                onCheckedChange={(checked) =>
                  field.onChange(checked ? true : false)
                }
                aria-invalid={Boolean(errors.consentMarketing)}
                className="mt-0.5"
              />
            )}
          />
          <Label
            htmlFor="newsletter-consent"
            className={cn(
              "block text-xs leading-snug font-normal sm:text-sm",
              inverted ? "text-surface/75" : "text-muted-foreground",
            )}
          >
            {t("consent")}
          </Label>
        </div>
        {errors.consentMarketing ? (
          <p className="text-sm text-destructive" role="alert">
            {t("consentRequired")}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}
    </form>
  );
}
