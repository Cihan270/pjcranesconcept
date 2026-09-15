"use client";

import { useState } from "react";
import {
  Controller,
  useForm,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as z from "zod";
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
import { capacityClasses } from "@/data/capacity-classes";
import { mapLeadError, submitLead } from "@/lib/forms/submit-lead";
import {
  antiSpamSchema,
  contactDetailsSchema,
  type FormLocale,
} from "@/lib/validators/common";
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

const capacityOptions = ["any", ...capacityClasses.map((item) => item.id)] as const;

const quickFindSchema = z.object({
  name: contactDetailsSchema.shape.name,
  email: contactDetailsSchema.shape.email,
  craneType: z.enum(craneTypes),
  capacity: z.enum(capacityOptions),
  privacy: z.literal(true),
  ...antiSpamSchema.shape,
});

type QuickFindValues = z.infer<typeof quickFindSchema>;

const fieldClass =
  "h-11 w-full rounded-[var(--radius)] border-white/25 bg-white/5 text-surface placeholder:text-surface/45";

/**
 * Short sourcing request for the homepage. Posts to the same /api/find
 * route as the full form; the message is composed from the selections.
 */
export function QuickFindForm({ className }: { className?: string }) {
  const t = useTranslations("Home.sourcing");
  const tFind = useTranslations("Find.form");
  const tCapacity = useTranslations("Home.capacity.classes");
  const locale = useLocale() as FormLocale;
  const [formStartedAt] = useState(() => Date.now());
  const [serverError, setServerError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuickFindValues>({
    resolver: zodResolver(quickFindSchema) as Resolver<QuickFindValues>,
    defaultValues: {
      name: "",
      email: "",
      craneType: "any",
      capacity: "any",
      privacy: false as unknown as true,
      website: "",
      formStartedAt,
    },
  });

  const typeItems = Object.fromEntries(
    craneTypes.map((type) => [type, tFind(`types.${type}`)]),
  );
  const capacityItems = Object.fromEntries(
    capacityOptions.map((id) => [
      id,
      id === "any" ? t("anyCapacity") : tCapacity(`${id}.label`),
    ]),
  );

  const onSubmit: SubmitHandler<QuickFindValues> = async (values) => {
    setServerError(null);
    const selectedClass = capacityClasses.find(
      (item) => item.id === values.capacity,
    );
    const result = await submitLead("/api/find", {
      locale,
      source: "website",
      name: values.name,
      email: values.email,
      craneType: values.craneType,
      capacityMinTons:
        selectedClass?.minKg != null
          ? (selectedClass.minKg - 1) / 1000
          : undefined,
      capacityMaxTons:
        selectedClass?.maxKg != null ? selectedClass.maxKg / 1000 : undefined,
      message: t("message", {
        type: typeItems[values.craneType],
        capacity: capacityItems[values.capacity],
      }),
      website: values.website,
      formStartedAt: values.formStartedAt,
      consent: { privacy: true, marketing: false },
    });
    if (result.ok) {
      setSucceeded(true);
      return;
    }
    setServerError(
      mapLeadError(result.error, {
        config: tFind("errors.config"),
        generic: tFind("errors.generic"),
      }),
    );
  };

  if (succeeded) {
    return (
      <div
        role="status"
        className={cn("space-y-2 border border-brand/50 bg-brand/10 p-5", className)}
      >
        <p className="font-heading text-lg font-semibold tracking-tight text-surface">
          {tFind("successTitle")}
        </p>
        <p className="text-sm leading-relaxed text-surface/75">
          {tFind("successBody")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("relative grid gap-3 sm:grid-cols-2", className)}
      noValidate
    >
      <Controller
        name="website"
        control={control}
        render={({ field }) => (
          <HoneypotField
            id="quick-find-website"
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
      />

      <div className="space-y-1.5">
        <Label htmlFor="quick-find-type" className="text-surface/80">
          {tFind("craneType")}
        </Label>
        <Controller
          name="craneType"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              items={typeItems}
            >
              <SelectTrigger id="quick-find-type" className={fieldClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {craneTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {typeItems[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="quick-find-capacity" className="text-surface/80">
          {t("capacity")}
        </Label>
        <Controller
          name="capacity"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              items={capacityItems}
            >
              <SelectTrigger id="quick-find-capacity" className={fieldClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {capacityOptions.map((id) => (
                  <SelectItem key={id} value={id}>
                    {capacityItems[id]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="quick-find-name" className="text-surface/80">
          {tFind("name")}
        </Label>
        <Input
          id="quick-find-name"
          autoComplete="name"
          className={fieldClass}
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-sm text-[#ff9b8f]" role="alert">
            {tFind("errors.name")}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="quick-find-email" className="text-surface/80">
          {tFind("email")}
        </Label>
        <Input
          id="quick-find-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          className={fieldClass}
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-[#ff9b8f]" role="alert">
            {tFind("errors.email")}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <div className="flex items-start gap-2.5">
          <Controller
            name="privacy"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="quick-find-consent"
                checked={field.value === true}
                onCheckedChange={(checked) =>
                  field.onChange(checked ? true : false)
                }
                aria-invalid={Boolean(errors.privacy)}
                className="mt-0.5 border-white/40"
              />
            )}
          />
          <Label
            htmlFor="quick-find-consent"
            className="text-xs leading-snug font-normal text-surface/70 sm:text-sm"
          >
            {tFind("consent")}
          </Label>
        </div>
        {errors.privacy ? (
          <p className="text-sm text-[#ff9b8f]" role="alert">
            {tFind("errors.consent")}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <p className="text-sm text-[#ff9b8f] sm:col-span-2" role="alert">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="focus-ring group inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent disabled:opacity-60 sm:col-span-2"
      >
        {isSubmitting ? tFind("submitting") : t("submit")}
        <ArrowRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden
        />
      </button>
    </form>
  );
}
