import * as z from "zod";

/** Treat blank form values as undefined before numeric coercion. */
export function emptyToUndefined(value: unknown): unknown {
  if (value === "" || value === null || value === undefined) return undefined;
  return value;
}

export const optionalCoercedNumber = z.preprocess(
  emptyToUndefined,
  z.coerce.number().optional(),
);

export const optionalPositiveNumber = z.preprocess(
  emptyToUndefined,
  z.coerce.number().positive().max(2000).optional(),
);

export const optionalNonNegativeNumber = z.preprocess(
  emptyToUndefined,
  z.coerce.number().nonnegative().optional(),
);

/** Shared anti-spam + CRM envelope fields for all lead forms. */
export const localesSchema = z.enum(["nl", "en", "de", "es", "fr"]);

export const formSourceSchema = z.enum([
  "website",
  "crane_detail",
  "inventory",
  "sell_page",
  "find_page",
  "contact_page",
  "newsletter",
  "other",
]);

/**
 * Honeypot must stay empty. Timestamp is client-set ms since epoch;
 * server should reject submissions that are too fast or too old.
 */
export const antiSpamSchema = z.object({
  website: z.string().max(0).optional().default(""),
  formStartedAt: z.coerce.number().int().positive(),
});

export const consentSchema = z.object({
  privacy: z.literal(true, {
    error: "Privacy consent is required",
  }),
  marketing: z.boolean().optional().default(false),
});

export const contactDetailsSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  phone: z.string().trim().min(6).max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
});

export type FormLocale = z.infer<typeof localesSchema>;
export type FormSource = z.infer<typeof formSourceSchema>;

export type CrmLeadEnvelope<TType extends string, TPayload> = {
  source: FormSource;
  locale: FormLocale;
  type: TType;
  payload: TPayload;
  consent: z.infer<typeof consentSchema>;
  meta: {
    formStartedAt: number;
    submittedAt: string;
    userAgent?: string;
  };
};

export function toCrmEnvelope<TType extends string, TPayload>(input: {
  source: FormSource;
  locale: FormLocale;
  type: TType;
  payload: TPayload;
  consent: z.infer<typeof consentSchema>;
  formStartedAt: number;
  userAgent?: string;
}): CrmLeadEnvelope<TType, TPayload> {
  return {
    source: input.source,
    locale: input.locale,
    type: input.type,
    payload: input.payload,
    consent: input.consent,
    meta: {
      formStartedAt: input.formStartedAt,
      submittedAt: new Date().toISOString(),
      userAgent: input.userAgent,
    },
  };
}

/** Reject bots that fill honeypot or submit instantly / with a stale token. */
export function assertAntiSpam(
  data: z.infer<typeof antiSpamSchema>,
  options?: { minMs?: number; maxMs?: number },
): { ok: true } | { ok: false; reason: string } {
  const minMs = options?.minMs ?? 2_000;
  const maxMs = options?.maxMs ?? 1000 * 60 * 60 * 24;
  if (data.website && data.website.length > 0) {
    return { ok: false, reason: "spam_honeypot" };
  }
  const elapsed = Date.now() - data.formStartedAt;
  if (elapsed < minMs) return { ok: false, reason: "spam_too_fast" };
  if (elapsed > maxMs) return { ok: false, reason: "spam_expired" };
  return { ok: true };
}
