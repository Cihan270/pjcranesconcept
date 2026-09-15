import * as z from "zod";

import {
  antiSpamSchema,
  formSourceSchema,
  localesSchema,
} from "./common";

export const newsletterFormSchema = z.object({
  ...antiSpamSchema.shape,
  locale: localesSchema,
  source: formSourceSchema.default("newsletter"),
  email: z.email().max(254),
  consentMarketing: z.literal(true, {
    error: "Marketing consent is required to subscribe",
  }),
});

export type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

export const newsletterLeadSchema = newsletterFormSchema.transform((data) => ({
  source: data.source,
  locale: data.locale,
  type: "newsletter" as const,
  consent: {
    privacy: true as const,
    marketing: true as const,
  },
  payload: {
    email: data.email,
  },
  formStartedAt: data.formStartedAt,
  website: data.website,
}));

export type NewsletterLead = z.infer<typeof newsletterLeadSchema>;
