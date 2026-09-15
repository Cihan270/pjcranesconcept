import { company } from "@/data/company";

/** Recipient for lead notifications. */
export function getContactToEmail(): string {
  return process.env.CONTACT_TO_EMAIL?.trim() || company.email;
}

/**
 * From address for Resend.
 * Dev default uses Resend's onboarding sender; production should set a verified domain.
 */
export function getResendFromEmail(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    `PJ Cranes <onboarding@resend.dev>`
  );
}

export function getResendApiKey(): string | undefined {
  const key = process.env.RESEND_API_KEY?.trim();
  return key || undefined;
}
