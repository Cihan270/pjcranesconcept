"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Controller,
  useForm,
  type FieldPath,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { company } from "@/data/company";
import { mapLeadError, submitLead } from "@/lib/forms/submit-lead";
import type { FormLocale } from "@/lib/validators/common";
import {
  sellCraneFormSchema,
  sellStepFields,
  type SellCraneFormValues,
  type SellFormStep,
} from "@/lib/validators/sell";
import {
  formatMaxFileSizeMb,
  SELL_ATTACHMENT_ACCEPT_ATTR,
  SELL_ATTACHMENT_ACCEPT_EXTENSIONS,
  SELL_ATTACHMENT_MAX_FILES,
  validateSellAttachments,
} from "@/lib/uploads/sell-attachments";
import { cn } from "cn";

type SellCraneFormProps = {
  className?: string;
};

type SelectedFile = {
  id: string;
  file: File;
  previewUrl?: string;
};

const STEPS: SellFormStep[] = ["contact", "machine", "files", "review"];
const OTHER_MANUFACTURER = "__other__";
const KNOWN_MANUFACTURERS: readonly string[] = company.manufacturers;

function isKnownManufacturer(value: string): boolean {
  return KNOWN_MANUFACTURERS.includes(value);
}

function displayOrEmpty(
  value: string | number | undefined | null,
  emptyLabel: string,
): string {
  if (value === undefined || value === null || value === "") return emptyLabel;
  return String(value);
}

function OptionalMark({ label }: { label: string }) {
  return (
    <span className="ml-1 text-xs font-normal text-steel">({label})</span>
  );
}

export function SellCraneForm({ className }: SellCraneFormProps) {
  const t = useTranslations("Sell.form");
  const locale = useLocale() as FormLocale;
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stepRegionRef = useRef<HTMLDivElement>(null);
  const [formStartedAt] = useState(() => Date.now());
  const [stepIndex, setStepIndex] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [referenceId, setReferenceId] = useState<string | undefined>();
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [manufacturerChoice, setManufacturerChoice] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [showErrorSummary, setShowErrorSummary] = useState(false);

  const step = STEPS[stepIndex] ?? "contact";

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    watch,
    setFocus,
    getFieldState,
    formState: { errors, isSubmitting },
  } = useForm<SellCraneFormValues>({
    resolver: zodResolver(sellCraneFormSchema) as Resolver<SellCraneFormValues>,
    mode: "onSubmit",
    defaultValues: {
      locale,
      source: "sell_page",
      name: "",
      email: "",
      phone: "",
      company: "",
      preferredContact: undefined,
      manufacturer: "",
      model: "",
      year: undefined,
      capacityTons: undefined,
      serialNumber: "",
      operatingHours: undefined,
      mileageKm: undefined,
      location: "",
      askingPrice: "",
      askingCurrency: undefined,
      conditionNotes: "",
      message: "",
      attachmentNames: [],
      website: "",
      formStartedAt,
      consent: { privacy: false as unknown as true, marketing: false },
    },
  });

  const manufacturerValue = watch("manufacturer");

  useEffect(() => {
    return () => {
      for (const item of selectedFiles) {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      }
    };
    // Revoke object URLs only on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue(
      "attachmentNames",
      selectedFiles.map((item) => item.file.name),
      { shouldValidate: false },
    );
  }, [selectedFiles, setValue]);

  const stepLabel = t(`steps.${step}`);

  useEffect(() => {
    stepRegionRef.current?.focus({ preventScroll: true });
  }, [stepIndex]);

  const goToStep = (index: number) => {
    if (index < 0 || index >= STEPS.length) return;
    if (index > maxReachedStep) return;
    setServerError(null);
    setShowErrorSummary(false);
    setStepIndex(index);
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    const fields = [
      ...(sellStepFields[step] as readonly FieldPath<SellCraneFormValues>[]),
    ];
    const ok = await trigger(fields);
    if (!ok) {
      setShowErrorSummary(true);
      for (const name of fields) {
        if (getFieldState(name).invalid) {
          try {
            setFocus(name);
          } catch {
            // Field may not support focus.
          }
          break;
        }
      }
      return false;
    }
    setShowErrorSummary(false);
    return true;
  };

  const goNext = async () => {
    const ok = await validateCurrentStep();
    if (!ok) return;
    const next = Math.min(stepIndex + 1, STEPS.length - 1);
    setMaxReachedStep((prev) => Math.max(prev, next));
    setStepIndex(next);
  };

  const goBack = () => {
    setShowErrorSummary(false);
    setServerError(null);
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const addFiles = (fileList: FileList | File[] | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    const result = validateSellAttachments(incoming, selectedFiles.length);
    if (!result.ok) {
      if (result.error === "too_many") {
        setFileError(
          t("errors.fileTooMany", { maxFiles: SELL_ATTACHMENT_MAX_FILES }),
        );
      } else if (result.error === "too_large") {
        setFileError(
          t("errors.fileTooLarge", {
            name: result.rejectedName ?? "",
            maxMb: formatMaxFileSizeMb(),
          }),
        );
      } else if (result.error === "invalid_type") {
        setFileError(
          t("errors.fileInvalidType", { name: result.rejectedName ?? "" }),
        );
      }
      return;
    }

    setFileError(null);
    const next = result.files.map((file) => {
      const id = `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`;
      const previewUrl = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined;
      return { id, file, previewUrl };
    });
    setSelectedFiles((prev) => [...prev, ...next]);
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
    setFileError(null);
  };

  const onManufacturerSelect = (value: string) => {
    setManufacturerChoice(value);
    if (value === OTHER_MANUFACTURER) {
      setValue("manufacturer", "", { shouldValidate: false });
    } else {
      setValue("manufacturer", value, { shouldValidate: true });
    }
  };

  const onSubmit: SubmitHandler<SellCraneFormValues> = async (formValues) => {
    setServerError(null);
    const result = await submitLead("/api/sell", {
      ...formValues,
      attachmentNames: selectedFiles.map((item) => item.file.name),
    });
    if (result.ok) {
      setReferenceId(result.id);
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

  const formatsLabel = useMemo(
    () =>
      SELL_ATTACHMENT_ACCEPT_EXTENSIONS.map((ext) =>
        ext.replace(".", "").toUpperCase(),
      ).join(", "),
    [],
  );

  const empty = t("notProvided");

  if (succeeded) {
    return (
      <div
        role="status"
        className={cn(
          "space-y-5 border border-brand/40 bg-brand/10 p-5 md:p-6",
          className,
        )}
      >
        <div className="space-y-2">
          <p className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {t("successTitle")}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("successBody")}
          </p>
        </div>
        {referenceId ? (
          <p className="text-sm text-foreground">
            <span className="text-steel">{t("successReference")}: </span>
            <span className="font-medium tabular-nums">{referenceId}</span>
          </p>
        ) : null}
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-steel">Email</dt>
            <dd>
              <a
                href={`mailto:${company.email}`}
                className="font-medium text-foreground hover:text-brand"
              >
                {company.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-steel">{company.mobile.label}</dt>
            <dd>
              <a
                href={`tel:${company.mobile.tel}`}
                className="font-medium tabular-nums text-foreground hover:text-brand"
              >
                {company.mobile.display}
              </a>
            </dd>
          </div>
        </dl>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
          >
            {t("successHome")}
          </Link>
          <Link
            href="/cranes"
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-line bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            {t("successInventory")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("relative space-y-6", className)}
      noValidate
    >
      <Controller
        name="website"
        control={control}
        render={({ field }) => (
          <HoneypotField
            id={`${formId}-website`}
            value={field.value ?? ""}
            onChange={field.onChange}
          />
        )}
      />

      <nav aria-label={t("sections.review")} className="border-b border-line pb-4">
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {STEPS.map((key, index) => {
            const isCurrent = index === stepIndex;
            const isComplete = index < stepIndex;
            const isReachable = index <= maxReachedStep;
            return (
              <li key={key}>
                <button
                  type="button"
                  disabled={!isReachable || isCurrent}
                  onClick={() => goToStep(index)}
                  className={cn(
                    "focus-ring flex w-full flex-col items-start gap-1 rounded-[var(--radius)] border px-3 py-2 text-left transition-colors",
                    isCurrent && "border-charcoal bg-charcoal text-surface",
                    isComplete &&
                      !isCurrent &&
                      "border-brand/50 bg-brand/10 text-foreground",
                    !isCurrent &&
                      !isComplete &&
                      "border-line bg-background text-steel",
                    isReachable && !isCurrent && "hover:border-charcoal/40",
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "font-heading text-xs font-semibold tabular-nums",
                      isCurrent ? "text-brand" : "text-brand",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading text-sm font-semibold tracking-tight">
                    {t(`steps.${key}`)}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="sr-only" aria-live="polite">
          {t("stepAnnounce", {
            current: stepIndex + 1,
            total: STEPS.length,
            label: stepLabel,
          })}
        </p>
      </nav>

      {showErrorSummary ? (
        <div
          role="alert"
          className="border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {t("errorSummary")}
        </div>
      ) : null}

      <div
        ref={stepRegionRef}
        tabIndex={-1}
        className="outline-none"
        aria-labelledby={`${formId}-step-heading`}
      >
        <h3
          id={`${formId}-step-heading`}
          className="font-heading text-sm font-semibold tracking-wide text-steel uppercase"
        >
          {t(`sections.${step === "files" ? "attachments" : step}`)}
        </h3>

        {step === "contact" ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">{t("contactHint")}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-name`}>{t("name")}</Label>
                <Input
                  id={`${formId}-name`}
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
                <Label htmlFor={`${formId}-company`}>
                  {t("company")}
                  <OptionalMark label={t("companyOptional")} />
                </Label>
                <Input
                  id={`${formId}-company`}
                  autoComplete="organization"
                  className="h-11 rounded-[var(--radius)]"
                  {...register("company")}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-email`}>{t("email")}</Label>
                <Input
                  id={`${formId}-email`}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  className="h-11 rounded-[var(--radius)]"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                {errors.email ? (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.email.message === "contact_required"
                      ? t("errors.contactRequired")
                      : t("errors.email")}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-phone`}>{t("phone")}</Label>
                <Input
                  id={`${formId}-phone`}
                  type="tel"
                  autoComplete="tel"
                  className="h-11 rounded-[var(--radius)]"
                  aria-invalid={Boolean(errors.phone)}
                  {...register("phone")}
                />
                {errors.phone ? (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.phone.message === "contact_required"
                      ? t("errors.contactRequired")
                      : t("errors.phone")}
                  </p>
                ) : null}
              </div>
            </div>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-foreground">
                {t("preferredContact")}
                <OptionalMark label={t("preferredContactOptional")} />
              </legend>
              <div className="flex flex-wrap gap-4">
                {(["phone", "whatsapp", "email"] as const).map((option) => (
                  <label
                    key={option}
                    className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground"
                  >
                    <input
                      type="radio"
                      value={option}
                      className="size-4 accent-[var(--primary)]"
                      {...register("preferredContact")}
                    />
                    {t(`preferredOptions.${option}`)}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        ) : null}

        {step === "machine" ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">{t("machineHint")}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-manufacturer`}>{t("manufacturer")}</Label>
                <select
                  id={`${formId}-manufacturer`}
                  className="h-11 w-full rounded-[var(--radius)] border border-input bg-background px-3 text-sm"
                  aria-invalid={Boolean(errors.manufacturer)}
                  value={
                    manufacturerChoice === OTHER_MANUFACTURER
                      ? OTHER_MANUFACTURER
                      : isKnownManufacturer(manufacturerValue ?? "")
                        ? manufacturerValue
                        : manufacturerValue
                          ? OTHER_MANUFACTURER
                          : ""
                  }
                  onChange={(event) => onManufacturerSelect(event.target.value)}
                >
                  <option value="" disabled>
                    {t("manufacturer")}
                  </option>
                  {KNOWN_MANUFACTURERS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                  <option value={OTHER_MANUFACTURER}>
                    {t("manufacturerOther")}
                  </option>
                </select>
                {(manufacturerChoice === OTHER_MANUFACTURER ||
                  Boolean(
                    manufacturerValue &&
                      !isKnownManufacturer(manufacturerValue),
                  )) && (
                  <div className="pt-2">
                    <Label htmlFor={`${formId}-manufacturer-other`}>
                      {t("manufacturerOtherLabel")}
                    </Label>
                    <Input
                      id={`${formId}-manufacturer-other`}
                      className="mt-1.5 h-11 rounded-[var(--radius)]"
                      aria-invalid={Boolean(errors.manufacturer)}
                      {...register("manufacturer")}
                    />
                  </div>
                )}
                {errors.manufacturer ? (
                  <p className="text-sm text-destructive" role="alert">
                    {t("errors.manufacturer")}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-model`}>{t("model")}</Label>
                <Input
                  id={`${formId}-model`}
                  className="h-11 rounded-[var(--radius)]"
                  aria-invalid={Boolean(errors.model)}
                  {...register("model")}
                />
                {errors.model ? (
                  <p className="text-sm text-destructive" role="alert">
                    {t("errors.model")}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-year`}>
                  {t("year")}
                  <OptionalMark label={t("yearOptional")} />
                </Label>
                <Input
                  id={`${formId}-year`}
                  type="number"
                  inputMode="numeric"
                  className="h-11 rounded-[var(--radius)] tabular-nums"
                  aria-invalid={Boolean(errors.year)}
                  {...register("year")}
                />
                {errors.year ? (
                  <p className="text-sm text-destructive" role="alert">
                    {t("errors.year")}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-capacity`}>
                  {t("capacityTons")}
                  <OptionalMark label={t("capacityOptional")} />
                </Label>
                <Input
                  id={`${formId}-capacity`}
                  type="number"
                  inputMode="decimal"
                  className="h-11 rounded-[var(--radius)] tabular-nums"
                  {...register("capacityTons")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-serial`}>
                  {t("serialNumber")}
                  <OptionalMark label={t("serialOptional")} />
                </Label>
                <Input
                  id={`${formId}-serial`}
                  className="h-11 rounded-[var(--radius)]"
                  {...register("serialNumber")}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-hours`}>
                  {t("operatingHours")}
                  <OptionalMark label={t("hoursOptional")} />
                </Label>
                <Input
                  id={`${formId}-hours`}
                  type="number"
                  inputMode="numeric"
                  className="h-11 rounded-[var(--radius)] tabular-nums"
                  {...register("operatingHours")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-mileage`}>
                  {t("mileageKm")}
                  <OptionalMark label={t("mileageOptional")} />
                </Label>
                <Input
                  id={`${formId}-mileage`}
                  type="number"
                  inputMode="numeric"
                  className="h-11 rounded-[var(--radius)] tabular-nums"
                  {...register("mileageKm")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-location`}>{t("location")}</Label>
                <Input
                  id={`${formId}-location`}
                  className="h-11 rounded-[var(--radius)]"
                  aria-invalid={Boolean(errors.location)}
                  {...register("location")}
                />
                {errors.location ? (
                  <p className="text-sm text-destructive" role="alert">
                    {t("errors.location")}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-price`}>
                  {t("askingPrice")}
                  <OptionalMark label={t("askingPriceOptional")} />
                </Label>
                <Input
                  id={`${formId}-price`}
                  className="h-11 rounded-[var(--radius)]"
                  placeholder={t("askingPricePlaceholder")}
                  {...register("askingPrice")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${formId}-currency`}>
                  {t("askingCurrency")}
                  <OptionalMark label={t("askingCurrencyOptional")} />
                </Label>
                <select
                  id={`${formId}-currency`}
                  className="h-11 w-full rounded-[var(--radius)] border border-input bg-background px-3 text-sm"
                  {...register("askingCurrency")}
                >
                  <option value="">{t("askingCurrency")}</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${formId}-condition`}>
                {t("conditionNotes")}
                <OptionalMark label={t("conditionOptional")} />
              </Label>
              <Textarea
                id={`${formId}-condition`}
                rows={4}
                className="rounded-[var(--radius)]"
                {...register("conditionNotes")}
              />
            </div>
          </div>
        ) : null}

        {step === "files" ? (
          <div className="mt-4 space-y-5">
            <div className="space-y-2">
              <p className="font-heading text-lg font-semibold tracking-tight">
                {t("attachmentsTitle")}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("attachmentsBody")}
              </p>
              <ul className="grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
                {(
                  [
                    "overview",
                    "cabin",
                    "plate",
                    "meters",
                    "carrier",
                    "docs",
                  ] as const
                ).map((key) => (
                  <li key={key} className="flex gap-2">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-brand" aria-hidden />
                    {t(`attachmentsGuidance.${key}`)}
                  </li>
                ))}
              </ul>
            </div>

            <div
              onDragEnter={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setDragActive(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setDragActive(false);
                addFiles(event.dataTransfer.files);
              }}
              className={cn(
                "rounded-[var(--radius)] border border-dashed px-4 py-8 text-center transition-colors",
                dragActive
                  ? "border-brand bg-brand/10"
                  : "border-line bg-background",
              )}
            >
              <p className="text-sm font-medium text-foreground">
                {t("attachmentsDrop")}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {t("attachmentsLimits", {
                  maxFiles: SELL_ATTACHMENT_MAX_FILES,
                  maxMb: formatMaxFileSizeMb(),
                  formats: formatsLabel,
                })}
              </p>
              <button
                type="button"
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-line bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:bg-background"
                onClick={() => fileInputRef.current?.click()}
              >
                {t("attachmentsBrowse")}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={SELL_ATTACHMENT_ACCEPT_ATTR}
                className="sr-only"
                onChange={(event) => {
                  addFiles(event.target.files);
                  event.target.value = "";
                }}
              />
            </div>

            {fileError ? (
              <p className="text-sm text-destructive" role="alert">
                {fileError}
              </p>
            ) : null}

            {selectedFiles.length > 0 ? (
              <ul className="space-y-3">
                <li className="text-xs text-muted-foreground">
                  {t("attachmentsSelectedNote")}
                </li>
                {selectedFiles.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 border border-line bg-background p-2.5"
                  >
                    {item.previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.previewUrl}
                        alt=""
                        className="size-14 object-cover"
                      />
                    ) : (
                      <div className="flex size-14 items-center justify-center bg-surface font-heading text-xs font-semibold text-steel">
                        PDF
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.file.name}
                      </p>
                      <p className="text-xs tabular-nums text-muted-foreground">
                        {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 text-sm font-medium text-steel underline-offset-2 hover:text-foreground hover:underline"
                      onClick={() => removeFile(item.id)}
                    >
                      {t("attachmentsRemove")}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("attachmentsEmpty")}
              </p>
            )}

            <div className="space-y-1.5">
              <Label htmlFor={`${formId}-message`}>
                {t("message")}
                <OptionalMark label={t("messageOptional")} />
              </Label>
              <Textarea
                id={`${formId}-message`}
                rows={4}
                placeholder={t("messagePlaceholder")}
                className="rounded-[var(--radius)]"
                {...register("message")}
              />
            </div>
          </div>
        ) : null}

        {step === "review" ? (
          <div className="mt-4 space-y-5">
            <ReviewGroup
              title={t("reviewContact")}
              onEdit={() => goToStep(0)}
              editLabel={t("edit")}
              rows={[
                { label: t("name"), value: displayOrEmpty(getValues("name"), empty) },
                {
                  label: t("company"),
                  value: displayOrEmpty(getValues("company"), empty),
                },
                {
                  label: t("email"),
                  value: displayOrEmpty(getValues("email"), empty),
                },
                {
                  label: t("phone"),
                  value: displayOrEmpty(getValues("phone"), empty),
                },
                {
                  label: t("preferredContact"),
                  value: getValues("preferredContact")
                    ? t(
                        `preferredOptions.${getValues("preferredContact") as "phone" | "whatsapp" | "email"}`,
                      )
                    : empty,
                },
              ]}
            />
            <ReviewGroup
              title={t("reviewMachine")}
              onEdit={() => goToStep(1)}
              editLabel={t("edit")}
              rows={[
                {
                  label: t("manufacturer"),
                  value: displayOrEmpty(getValues("manufacturer"), empty),
                },
                {
                  label: t("model"),
                  value: displayOrEmpty(getValues("model"), empty),
                },
                {
                  label: t("year"),
                  value: displayOrEmpty(getValues("year"), empty),
                },
                {
                  label: t("capacityTons"),
                  value: displayOrEmpty(getValues("capacityTons"), empty),
                },
                {
                  label: t("serialNumber"),
                  value: displayOrEmpty(getValues("serialNumber"), empty),
                },
                {
                  label: t("operatingHours"),
                  value: displayOrEmpty(getValues("operatingHours"), empty),
                },
                {
                  label: t("mileageKm"),
                  value: displayOrEmpty(getValues("mileageKm"), empty),
                },
                {
                  label: t("location"),
                  value: displayOrEmpty(getValues("location"), empty),
                },
                {
                  label: t("askingPrice"),
                  value: (() => {
                    const price = getValues("askingPrice");
                    const currency = getValues("askingCurrency");
                    if (!price) return empty;
                    return currency ? `${price} ${currency}` : price;
                  })(),
                },
                {
                  label: t("conditionNotes"),
                  value: displayOrEmpty(getValues("conditionNotes"), empty),
                },
              ]}
            />
            <ReviewGroup
              title={t("reviewFiles")}
              onEdit={() => goToStep(2)}
              editLabel={t("edit")}
              rows={[
                {
                  label: t("sections.attachments"),
                  value:
                    selectedFiles.length > 0
                      ? selectedFiles.map((f) => f.file.name).join(", ")
                      : empty,
                },
              ]}
            />
            <ReviewGroup
              title={t("reviewMessage")}
              onEdit={() => goToStep(2)}
              editLabel={t("edit")}
              rows={[
                {
                  label: t("message"),
                  value: displayOrEmpty(getValues("message"), empty),
                },
              ]}
            />

            <div className="flex items-start gap-3 border-t border-line pt-5">
              <Controller
                name="consent.privacy"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id={`${formId}-consent`}
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
                htmlFor={`${formId}-consent`}
                className="block text-sm leading-snug font-normal text-muted-foreground"
              >
                {t("consent")}
              </Label>
            </div>
            {errors.consent?.privacy ? (
              <p className="text-sm text-destructive" role="alert">
                {t("errors.consent")}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-between">
        {stepIndex > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-line bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            {t("back")}
          </button>
        ) : (
          <span />
        )}

        {step === "contact" ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
          >
            {t("nextMachine")}
          </button>
        ) : null}
        {step === "machine" ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
          >
            {t("nextFiles")}
          </button>
        ) : null}
        {step === "files" ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
          >
            {t("nextReview")}
          </button>
        ) : null}
        {step === "review" ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent disabled:opacity-60"
          >
            {isSubmitting ? t("submitting") : t("submit")}
          </button>
        ) : null}
      </div>
    </form>
  );
}

function ReviewGroup({
  title,
  editLabel,
  onEdit,
  rows,
}: {
  title: string;
  editLabel: string;
  onEdit: () => void;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="border border-line bg-background p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="font-heading text-base font-semibold tracking-tight">
          {title}
        </h4>
        <button
          type="button"
          onClick={onEdit}
          className="text-sm font-medium text-steel underline-offset-2 hover:text-foreground hover:underline"
        >
          {editLabel}
        </button>
      </div>
      <dl className="space-y-2.5 text-sm">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
          >
            <dt className="text-steel">{row.label}</dt>
            <dd className="whitespace-pre-wrap text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
