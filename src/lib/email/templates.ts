import type { CrmLeadEnvelope } from "@/lib/validators/common";

export type LeadType = "contact" | "sell" | "find" | "newsletter";

export type SendLeadResult =
  | { ok: true; id: string }
  | {
      ok: false;
      error: "email_not_configured" | "send_failed";
      message?: string;
    };

export type LeadMailContent = {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatValue(value: unknown): string {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (Array.isArray(value)) {
    return value.length ? value.map(String).join(", ") : "—";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

function rowsFromRecord(
  record: Record<string, unknown>,
): Array<{ label: string; value: string }> {
  return Object.entries(record).map(([label, value]) => ({
    label,
    value: formatValue(value),
  }));
}

export function buildLeadMail(options: {
  type: LeadType;
  lead: CrmLeadEnvelope<string, Record<string, unknown>>;
  subject: string;
}): LeadMailContent {
  const { type, lead, subject } = options;
  const payloadRows = rowsFromRecord(lead.payload);
  const metaRows = [
    { label: "type", value: type },
    { label: "source", value: lead.source },
    { label: "locale", value: lead.locale },
    { label: "consent.privacy", value: formatValue(lead.consent.privacy) },
    { label: "consent.marketing", value: formatValue(lead.consent.marketing) },
    { label: "submittedAt", value: lead.meta.submittedAt },
    { label: "formStartedAt", value: String(lead.meta.formStartedAt) },
    { label: "userAgent", value: formatValue(lead.meta.userAgent) },
  ];

  const allRows = [...payloadRows, ...metaRows];

  const text = [
    `PJ Cranes lead: ${type}`,
    `Subject: ${subject}`,
    "",
    ...allRows.map((row) => `${row.label}: ${row.value}`),
  ].join("\n");

  const htmlRows = allRows
    .map(
      (row) =>
        `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#555;white-space:nowrap;">${escapeHtml(row.label)}</td><td style="padding:6px 0;vertical-align:top;">${escapeHtml(row.value).replaceAll("\n", "<br/>")}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:IBM Plex Sans,Segoe UI,sans-serif;font-size:14px;line-height:1.5;color:#1b1b1d;">
      <p style="margin:0 0 12px;"><strong>PJ Cranes lead:</strong> ${escapeHtml(type)}</p>
      <p style="margin:0 0 16px;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <table style="border-collapse:collapse;">${htmlRows}</table>
    </div>
  `.trim();

  const replyTo =
    typeof lead.payload.email === "string" && lead.payload.email
      ? lead.payload.email
      : undefined;

  return { subject, text, html, replyTo };
}

export function subjectForLead(
  type: LeadType,
  payload: Record<string, unknown>,
): string {
  switch (type) {
    case "contact": {
      const ref =
        typeof payload.craneReference === "string" && payload.craneReference
          ? ` · ${payload.craneReference}`
          : "";
      const subject =
        typeof payload.subject === "string" && payload.subject
          ? payload.subject
          : "Website contact";
      return `[Contact${ref}] ${subject}`;
    }
    case "sell": {
      const manufacturer = formatValue(payload.manufacturer);
      const model = formatValue(payload.model);
      const year = payload.year;
      const yearLabel =
        year === undefined || year === null || year === ""
          ? "year n/a"
          : formatValue(year);
      return `[Sell] ${manufacturer} ${model} (${yearLabel})`;
    }
    case "find": {
      const manufacturer = formatValue(payload.manufacturer);
      const model = formatValue(payload.model);
      const label =
        manufacturer !== "—" || model !== "—"
          ? `${manufacturer} ${model}`.trim()
          : formatValue(payload.craneType);
      return `[Find] ${label}`;
    }
    case "newsletter":
      return `[Stock alert] ${formatValue(payload.email)}`;
    default:
      return `[Lead] ${type}`;
  }
}
