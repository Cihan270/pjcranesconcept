import * as z from "zod";

import {
  antiSpamSchema,
  consentSchema,
  emptyToUndefined,
  formSourceSchema,
  localesSchema,
} from "./common";

/** Contact-page subject keys (also used for `?subject=` preselection). */
export const CONTACT_SUBJECT_KEYS = [
  "inventory",
  "sell",
  "source",
  "transport",
  "general",
] as const;

export type ContactSubjectKey = (typeof CONTACT_SUBJECT_KEYS)[number];

export const contactSubjectKeySchema = z.enum(CONTACT_SUBJECT_KEYS);

export function resolveContactSubjectKey(
  value: string | string[] | undefined | null,
): ContactSubjectKey | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const match = CONTACT_SUBJECT_KEYS.find((key) => key === raw);
  return match ?? null;
}

/** What a buyer asks for on a crane detail page. */
export const CRANE_REQUEST_TYPES = [
  "price",
  "inspection",
  "transport",
  "media",
] as const;

export type CraneRequestType = (typeof CRANE_REQUEST_TYPES)[number];

const optionalEmail = z.preprocess(
  emptyToUndefined,
  z.email().max(254).optional(),
);

const optionalPhone = z.preprocess(
  emptyToUndefined,
  z.string().trim().min(6).max(40).optional(),
);

export const contactFormSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: optionalEmail,
    phone: optionalPhone,
    company: z.string().trim().max(160).optional().or(z.literal("")),
    ...antiSpamSchema.shape,
    locale: localesSchema,
    source: formSourceSchema.default("contact_page"),
    /** Human-readable subject (localized label or crane enquiry subject). */
    subject: z.string().trim().min(1).max(160),
    message: z.string().trim().min(10).max(5000),
    craneReference: z.string().trim().max(40).optional().or(z.literal("")),
    craneSlug: z.string().trim().max(120).optional().or(z.literal("")),
    requestType: z.enum(CRANE_REQUEST_TYPES).optional(),
    /** Destination / buyer country for crane enquiries. */
    country: z.string().trim().max(80).optional().or(z.literal("")),
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

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const contactLeadSchema = contactFormSchema.transform((data) => ({
  source: data.source,
  locale: data.locale,
  type: "contact" as const,
  consent: data.consent,
  payload: {
    name: data.name,
    email: data.email || undefined,
    phone: data.phone || undefined,
    company: data.company || undefined,
    subject: data.subject,
    message: data.message,
    craneReference: data.craneReference || undefined,
    craneSlug: data.craneSlug || undefined,
    requestType: data.requestType,
    country: data.country || undefined,
  },
  formStartedAt: data.formStartedAt,
  website: data.website,
}));

export type ContactLead = z.infer<typeof contactLeadSchema>;
