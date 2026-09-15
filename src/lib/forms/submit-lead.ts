export type LeadApiResponse = {
  ok?: boolean;
  error?: string;
  id?: string;
};

export type SubmitLeadResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

/** POST a validated lead payload to a Route Handler. */
export async function submitLead(
  endpoint: "/api/contact" | "/api/sell" | "/api/find" | "/api/newsletter",
  payload: unknown,
): Promise<SubmitLeadResult> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: LeadApiResponse = {};
  try {
    data = (await response.json()) as LeadApiResponse;
  } catch {
    return { ok: false, error: "generic" };
  }

  if (response.ok && data.ok) {
    return { ok: true, id: data.id };
  }

  if (data.error === "email_not_configured") {
    return { ok: false, error: "email_not_configured" };
  }

  return { ok: false, error: data.error || "generic" };
}

export function mapLeadError(
  error: string,
  messages: { config: string; generic: string },
): string {
  if (error === "email_not_configured") return messages.config;
  return messages.generic;
}
