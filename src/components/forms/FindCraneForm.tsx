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
import { FormSuccess } from "@/components/forms/FormSuccess";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { company } from "@/data/company";
import { mapLeadError, submitLead } from "@/lib/forms/submit-lead";
import type { FormLocale } from "@/lib/validators/common";
import {
  findCraneFormSchema,
  type FindCraneFormValues,
} from "@/lib/validators/find";
import { cn } from "cn";

const craneTypes = [
  "any",
  "mobile",
  "crawler",
  "all_terrain",
  "city",
  "rough_terrain",
  "other",
] as const;

type FindCraneFormProps = {
  className?: string;
};

export function FindCraneForm({ className }: FindCraneFormProps) {
  const t = useTranslations("Find.form");
  const locale = useLocale() as FormLocale;
  const [formStartedAt] = useState(() => Date.now());
  const [serverError, setServerError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FindCraneFormValues>({
    resolver: zodResolver(findCraneFormSchema) as Resolver<FindCraneFormValues>,
    defaultValues: {
      locale,
      source: "find_page",
      name: "",
      email: "",
      phone: "",
      company: "",
      manufacturer: "",
      model: "",
      craneType: "any",
      yearMin: undefined,
      yearMax: undefined,
      capacityMinTons: undefined,
      capacityMaxTons: undefined,
      budget: "",
      destinationCountry: "",
      timeframe: "",
      message: "",
      website: "",
      formStartedAt,
      consent: { privacy: false as unknown as true, marketing: false },
    },
  });

  const onSubmit: SubmitHandler<FindCraneFormValues> = async (values) => {
    setServerError(null);
    const result = await submitLead("/api/find", values);
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("relative space-y-4", className)}
      noValidate
    >
      <Controller
        name="website"
        control={control}
        render={({ field }) => (
          <HoneypotField
            id="find-website"
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
      />

      <fieldset className="space-y-4">
        <legend className="font-heading text-sm font-semibold tracking-wide text-steel uppercase">
          {t("sections.contact")}
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="find-name">{t("name")}</Label>
            <Input
              id="find-name"
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
            <Label htmlFor="find-email">{t("email")}</Label>
            <Input
              id="find-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className="h-11 rounded-[var(--radius)]"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-sm text-destructive" role="alert">
                {t("errors.email")}
              </p>
            ) : null}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="find-phone">{t("phone")}</Label>
            <Input
              id="find-phone"
              type="tel"
              autoComplete="tel"
              className="h-11 rounded-[var(--radius)]"
              {...register("phone")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="find-company">{t("company")}</Label>
            <Input
              id="find-company"
              autoComplete="organization"
              className="h-11 rounded-[var(--radius)]"
              {...register("company")}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-heading text-sm font-semibold tracking-wide text-steel uppercase">
          {t("sections.requirements")}
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="find-manufacturer">{t("manufacturer")}</Label>
            <Input
              id="find-manufacturer"
              list="find-manufacturer-list"
              className="h-11 rounded-[var(--radius)]"
              {...register("manufacturer")}
            />
            <datalist id="find-manufacturer-list">
              {company.manufacturers.map((brand) => (
                <option key={brand} value={brand} />
              ))}
            </datalist>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="find-model">{t("model")}</Label>
            <Input
              id="find-model"
              className="h-11 rounded-[var(--radius)]"
              {...register("model")}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="find-type">{t("craneType")}</Label>
          <Controller
            name="craneType"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                items={Object.fromEntries(
                  craneTypes.map((type) => [type, t(`types.${type}`)]),
                )}
              >
                <SelectTrigger
                  id="find-type"
                  className="h-11 w-full rounded-[var(--radius)]"
                >
                  <SelectValue placeholder={t("types.any")} />
                </SelectTrigger>
                <SelectContent>
                  {craneTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`types.${type}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="find-year-min">{t("yearMin")}</Label>
            <Input
              id="find-year-min"
              type="number"
              inputMode="numeric"
              className="h-11 rounded-[var(--radius)] tabular-nums"
              {...register("yearMin")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="find-year-max">{t("yearMax")}</Label>
            <Input
              id="find-year-max"
              type="number"
              inputMode="numeric"
              className="h-11 rounded-[var(--radius)] tabular-nums"
              {...register("yearMax")}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="find-cap-min">{t("capacityMinTons")}</Label>
            <Input
              id="find-cap-min"
              type="number"
              inputMode="decimal"
              className="h-11 rounded-[var(--radius)] tabular-nums"
              {...register("capacityMinTons")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="find-cap-max">{t("capacityMaxTons")}</Label>
            <Input
              id="find-cap-max"
              type="number"
              inputMode="decimal"
              className="h-11 rounded-[var(--radius)] tabular-nums"
              {...register("capacityMaxTons")}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="find-budget">{t("budget")}</Label>
            <Input
              id="find-budget"
              className="h-11 rounded-[var(--radius)]"
              placeholder={t("budgetPlaceholder")}
              {...register("budget")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="find-destination">{t("destinationCountry")}</Label>
            <Input
              id="find-destination"
              className="h-11 rounded-[var(--radius)]"
              {...register("destinationCountry")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="find-timeframe">{t("timeframe")}</Label>
            <Input
              id="find-timeframe"
              className="h-11 rounded-[var(--radius)]"
              placeholder={t("timeframePlaceholder")}
              {...register("timeframe")}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="find-message">{t("message")}</Label>
          <Textarea
            id="find-message"
            rows={5}
            placeholder={t("messagePlaceholder")}
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
      </fieldset>

      <div className="flex items-start gap-3">
        <Controller
          name="consent.privacy"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="find-consent"
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
          htmlFor="find-consent"
          className="text-sm leading-snug font-normal text-muted-foreground"
        >
          {t("consent")}
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
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
