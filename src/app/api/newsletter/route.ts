import { NextResponse } from "next/server";
import { handleLeadRequest } from "@/lib/email";
import { newsletterFormSchema } from "@/lib/validators/newsletter";

/** Inventory-alert lead intake → Resend (or safe 503 when not configured). */
export async function POST(request: Request) {
  return handleLeadRequest({
    request,
    schema: newsletterFormSchema,
    type: "newsletter",
    sourceFallback: "newsletter",
    build: (data) => ({
      source: data.source,
      locale: data.locale,
      consent: {
        privacy: true,
        marketing: true,
      },
      payload: {
        email: data.email,
      },
    }),
  });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "method_not_allowed" }, { status: 405 });
}
