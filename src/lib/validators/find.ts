import * as z from "zod";

import {
  antiSpamSchema,
  consentSchema,
  contactDetailsSchema,
  emptyToUndefined,
  formSourceSchema,
  localesSchema,
  optionalPositiveNumber,
} from "./common";

export const findCraneFormSchema = z.object({
  ...contactDetailsSchema.shape,
  ...antiSpamSchema.shape,
  locale: localesSchema,
  source: formSourceSchema.default("find_page"),
  manufacturer: z.string().trim().max(80).optional().or(z.literal("")),
  model: z.string().trim().max(80).optional().or(z.literal("")),
  craneType: z
    .enum([
      "mobile",
      "crawler",
      "all_terrain",
      "city",
      "rough_terrain",
      "other",
      "any",
    ])
    .default("any"),
  yearMin: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1970).optional(),
  ),
  yearMax: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number()
      .int()
      .max(new Date().getFullYear() + 1)
      .optional(),
  ),
  capacityMinTons: optionalPositiveNumber,
  capacityMaxTons: optionalPositiveNumber,
  budget: z.string().trim().max(120).optional().or(z.literal("")),
  destinationCountry: z.string().trim().max(80).optional().or(z.literal("")),
  timeframe: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(5000),
  consent: consentSchema,
});

export type FindCraneFormValues = z.infer<typeof findCraneFormSchema>;

export const findLeadSchema = findCraneFormSchema.transform((data) => ({
  source: data.source,
  locale: data.locale,
  type: "find" as const,
  consent: data.consent,
  payload: {
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    company: data.company || undefined,
    manufacturer: data.manufacturer || undefined,
    model: data.model || undefined,
    craneType: data.craneType,
    yearMin: data.yearMin,
    yearMax: data.yearMax,
    capacityMinTons: data.capacityMinTons,
    capacityMaxTons: data.capacityMaxTons,
    budget: data.budget || undefined,
    destinationCountry: data.destinationCountry || undefined,
    timeframe: data.timeframe || undefined,
    message: data.message,
  },
  formStartedAt: data.formStartedAt,
  website: data.website,
}));

export type FindLead = z.infer<typeof findLeadSchema>;
