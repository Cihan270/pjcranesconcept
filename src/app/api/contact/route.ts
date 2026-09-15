import { NextResponse } from "next/server";
import { handleLeadRequest } from "@/lib/email";
import { contactFormSchema } from "@/lib/validators/contact";

/** Contact / crane enquiry intake → Resend (or safe 503 when not configured). */
export async function POST(request: Request) {
  return handleLeadRequest({
    request,
    schema: contactFormSchema,
    type: "contact",
    sourceFallback: "contact_page",
    build: (data) => ({
      source: data.source,
      locale: data.locale,
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
      },
    }),
  });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "method_not_allowed" }, { status: 405 });
}
