import { NextResponse } from "next/server";
import { handleLeadRequest } from "@/lib/email";
import { sellCraneFormSchema } from "@/lib/validators/sell";

/** Sell-your-crane intake → Resend (or safe 503 when not configured). */
export async function POST(request: Request) {
  return handleLeadRequest({
    request,
    schema: sellCraneFormSchema,
    type: "sell",
    sourceFallback: "sell_page",
    build: (data) => ({
      source: data.source,
      locale: data.locale,
      consent: data.consent,
      payload: {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        company: data.company || undefined,
        preferredContact: data.preferredContact || undefined,
        manufacturer: data.manufacturer,
        model: data.model,
        year: data.year,
        capacityTons: data.capacityTons,
        serialNumber: data.serialNumber || undefined,
        operatingHours: data.operatingHours,
        mileageKm: data.mileageKm,
        location: data.location,
        askingPrice: data.askingPrice || undefined,
        askingCurrency: data.askingCurrency || undefined,
        conditionNotes: data.conditionNotes || undefined,
        message: data.message || undefined,
        attachmentNames: data.attachmentNames,
      },
    }),
  });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "method_not_allowed" }, { status: 405 });
}
