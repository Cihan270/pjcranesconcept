import { NextResponse } from "next/server";
import { handleLeadRequest } from "@/lib/email";
import { findCraneFormSchema } from "@/lib/validators/find";

/** Find-a-crane sourcing intake → Resend (or safe 503 when not configured). */
export async function POST(request: Request) {
  return handleLeadRequest({
    request,
    schema: findCraneFormSchema,
    type: "find",
    sourceFallback: "find_page",
    build: (data) => ({
      source: data.source,
      locale: data.locale,
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
    }),
  });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "method_not_allowed" }, { status: 405 });
}
