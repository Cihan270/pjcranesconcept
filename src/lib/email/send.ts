import { Resend } from "resend";
import type { CrmLeadEnvelope } from "@/lib/validators/common";
import {
  getContactToEmail,
  getResendApiKey,
  getResendFromEmail,
} from "./config";
import {
  buildLeadMail,
  subjectForLead,
  type LeadType,
  type SendLeadResult,
} from "./templates";

/**
 * Deliver a CRM-shaped lead via Resend.
 * Missing API key → logs payload and returns email_not_configured (never fakes success).
 */
export async function sendLeadEmail(options: {
  type: LeadType;
  lead: CrmLeadEnvelope<string, Record<string, unknown>>;
  subject?: string;
}): Promise<SendLeadResult> {
  const subject =
    options.subject ?? subjectForLead(options.type, options.lead.payload);
  const mail = buildLeadMail({
    type: options.type,
    lead: options.lead,
    subject,
  });

  const apiKey = getResendApiKey();
  if (!apiKey) {
    console.info(
      `[email:${options.type}] RESEND_API_KEY missing — lead logged only`,
      options.lead,
    );
    return { ok: false, error: "email_not_configured" };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: getResendFromEmail(),
      to: [getContactToEmail()],
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
    });

    if (error || !data?.id) {
      console.error(`[email:${options.type}] Resend send failed`, error);
      return {
        ok: false,
        error: "send_failed",
        message: error?.message,
      };
    }

    return { ok: true, id: data.id };
  } catch (error) {
    console.error(`[email:${options.type}] Resend threw`, error);
    return {
      ok: false,
      error: "send_failed",
      message: error instanceof Error ? error.message : undefined,
    };
  }
}
