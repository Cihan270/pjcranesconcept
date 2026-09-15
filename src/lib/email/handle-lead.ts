import { NextResponse } from "next/server";
import type { z } from "zod";
import {
  assertAntiSpam,
  toCrmEnvelope,
  type FormLocale,
  type FormSource,
} from "@/lib/validators/common";
import { sendLeadEmail } from "./send";
import type { LeadType } from "./templates";

type ConsentFields = {
  privacy: true;
  marketing?: boolean;
};

/**
 * Shared JSON lead intake: validate → anti-spam → CRM envelope → Resend.
 * Never returns ok:true unless the email provider accepted the message.
 */
export async function handleLeadRequest<TSchema extends z.ZodType>(options: {
  request: Request;
  schema: TSchema;
  type: LeadType;
  sourceFallback: FormSource;
  build: (data: z.infer<TSchema>) => {
    source: FormSource;
    locale: FormLocale;
    consent: ConsentFields;
    payload: Record<string, unknown>;
  };
}): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await options.request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const parsed = options.schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "validation",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const data = parsed.data as z.infer<TSchema> & {
    website?: string;
    formStartedAt: number;
  };

  const spam = assertAntiSpam({
    website: data.website ?? "",
    formStartedAt: data.formStartedAt,
  });
  if (!spam.ok) {
    return NextResponse.json(
      { ok: false, error: spam.reason },
      { status: 400 },
    );
  }

  const built = options.build(data);
  const lead = toCrmEnvelope({
    source: built.source ?? options.sourceFallback,
    locale: built.locale,
    type: options.type,
    payload: built.payload,
    consent: {
      privacy: true,
      marketing: built.consent.marketing ?? false,
    },
    formStartedAt: data.formStartedAt,
    userAgent: options.request.headers.get("user-agent") ?? undefined,
  });

  const result = await sendLeadEmail({
    type: options.type,
    lead,
  });

  if (!result.ok) {
    const status = result.error === "email_not_configured" ? 503 : 502;
    return NextResponse.json(
      { ok: false, error: result.error },
      { status },
    );
  }

  return NextResponse.json({ ok: true, id: result.id });
}
