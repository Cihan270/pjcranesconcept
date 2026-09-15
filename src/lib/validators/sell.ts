import * as z from "zod";

import {
  antiSpamSchema,
  consentSchema,
  emptyToUndefined,
  formSourceSchema,
  localesSchema,
  optionalNonNegativeNumber,
  optionalPositiveNumber,
} from "./common";

const optionalEmail = z.preprocess(
  emptyToUndefined,
  z.email().max(254).optional(),
);

const optionalPhone = z.preprocess(
  emptyToUndefined,
  z.string().trim().min(6).max(40).optional(),
);

export const preferredContactSchema = z.enum(["phone", "whatsapp", "email"]);

export const askingCurrencySchema = z.enum(["EUR", "USD", "GBP"]);

const optionalPreferredContact = z.preprocess(
  emptyToUndefined,
  preferredContactSchema.optional(),
);

const optionalAskingCurrency = z.preprocess(
  emptyToUndefined,
  askingCurrencySchema.optional(),
);

/**
 * Sell-your-crane form.
 * Attachment bytes are validated client-side; only filenames are sent until storage is wired
 * (see `src/lib/uploads/sell-attachments.ts`).
 */
export const sellCraneFormSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: optionalEmail,
    phone: optionalPhone,
    company: z.string().trim().max(160).optional().or(z.literal("")),
    preferredContact: optionalPreferredContact,
    ...antiSpamSchema.shape,
    locale: localesSchema,
    source: formSourceSchema.default("sell_page"),
    manufacturer: z.string().trim().min(1).max(80),
    model: z.string().trim().min(1).max(80),
    year: z.preprocess(
      emptyToUndefined,
      z.coerce
        .number()
        .int()
        .min(1950)
        .max(new Date().getFullYear() + 1)
        .optional(),
    ),
    capacityTons: optionalPositiveNumber,
    serialNumber: z.string().trim().max(80).optional().or(z.literal("")),
    operatingHours: optionalNonNegativeNumber,
    mileageKm: optionalNonNegativeNumber,
    location: z.string().trim().min(1).max(160),
    askingPrice: z.string().trim().max(80).optional().or(z.literal("")),
    askingCurrency: optionalAskingCurrency,
    conditionNotes: z.string().trim().max(3000).optional().or(z.literal("")),
    message: z.string().trim().max(5000).optional().or(z.literal("")),
    /** Filenames only until object storage is connected. */
    attachmentNames: z.array(z.string().max(200)).max(20).optional().default([]),
    consent: consentSchema,
  })
  .superRefine((data, ctx) => {
    const email =
      typeof data.email === "string" ? data.email.trim() : "";
    const phone =
      typeof data.phone === "string" ? data.phone.trim() : "";

    if (!email && !phone) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "contact_required",
      });
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "contact_required",
      });
    }
  });
export type SellCraneFormValues = z.infer<typeof sellCraneFormSchema>;

export const sellLeadSchema = sellCraneFormSchema.transform((data) => ({
  source: data.source,
  locale: data.locale,
  type: "sell" as const,
  consent: data.consent,
  payload: {
    name: data.name,
    email: data.email || undefined,
    phone: data.phone || undefined,
    company: data.company || undefined,
    preferredContact: data.preferredContact || undefined,
    manufacturer: data.manufacturer,
    model: data.model,
    year: data.year,
    capacityTons: data.capacityTons,
    serialNumber: data.serialNumber || undefined,
    operatingHours: data.operatingHours,
    mileageKm: data.mileageKm,
    location: data.location,
    askingPrice: data.askingPrice || undefined,
    askingCurrency: data.askingCurrency || undefined,
    conditionNotes: data.conditionNotes || undefined,
    message: data.message || undefined,
    attachmentNames: data.attachmentNames,
  },
  formStartedAt: data.formStartedAt,
  website: data.website,
}));

export type SellLead = z.infer<typeof sellLeadSchema>;

/** Field groups for multi-step validation. */
export const sellStepFields = {
  contact: [
    "name",
    "email",
    "phone",
    "company",
    "preferredContact",
  ] as const,
  machine: [
    "manufacturer",
    "model",
    "year",
    "capacityTons",
    "serialNumber",
    "operatingHours",
    "mileageKm",
    "location",
    "askingPrice",
    "askingCurrency",
    "conditionNotes",
  ] as const,
  files: ["message", "attachmentNames"] as const,
  review: ["consent"] as const,
} as const;

export type SellFormStep = keyof typeof sellStepFields;
