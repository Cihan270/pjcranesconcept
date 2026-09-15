/**
 * Sell-page attachment validation and upload boundary.
 *
 * TODO(storage): Wire a real upload provider (e.g. Supabase Storage / S3 / Vercel Blob).
 * Required before bytes leave the browser:
 * - Server-side multipart or signed-upload route
 * - Env vars for the storage bucket/credentials (never expose secrets to the client)
 * - Persist returned object keys/URLs on the sell lead payload instead of filenames only
 * - Serve secure links in internal notification emails (do not attach large binaries)
 */

export const SELL_ATTACHMENT_MAX_FILES = 12;
export const SELL_ATTACHMENT_MAX_BYTES = 8 * 1024 * 1024; // 8 MB per file

export const SELL_ATTACHMENT_ACCEPT_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export const SELL_ATTACHMENT_ACCEPT_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".pdf",
] as const;

/** Value for `<input accept>` / dropzone hints. */
export const SELL_ATTACHMENT_ACCEPT_ATTR = [
  ...SELL_ATTACHMENT_ACCEPT_MIME,
  ...SELL_ATTACHMENT_ACCEPT_EXTENSIONS,
].join(",");

export type SellAttachmentValidationError =
  | "too_many"
  | "too_large"
  | "invalid_type"
  | "empty";

export type SellAttachmentValidationResult =
  | { ok: true; files: File[] }
  | { ok: false; error: SellAttachmentValidationError; rejectedName?: string };

function extensionOf(name: string): string {
  const idx = name.lastIndexOf(".");
  if (idx < 0) return "";
  return name.slice(idx).toLowerCase();
}

function isAllowedFile(file: File): boolean {
  const mime = file.type.toLowerCase();
  if (
    (SELL_ATTACHMENT_ACCEPT_MIME as readonly string[]).includes(mime)
  ) {
    return true;
  }
  // Some browsers omit MIME for PDFs/images — fall back to extension.
  return (SELL_ATTACHMENT_ACCEPT_EXTENSIONS as readonly string[]).includes(
    extensionOf(file.name),
  );
}

/**
 * Validate newly selected files against configured limits.
 * Does not upload; merge with existing selections in the form UI.
 */
export function validateSellAttachments(
  incoming: File[],
  alreadySelectedCount: number,
): SellAttachmentValidationResult {
  if (incoming.length === 0) {
    return { ok: false, error: "empty" };
  }

  if (alreadySelectedCount + incoming.length > SELL_ATTACHMENT_MAX_FILES) {
    return { ok: false, error: "too_many" };
  }

  for (const file of incoming) {
    if (!isAllowedFile(file)) {
      return { ok: false, error: "invalid_type", rejectedName: file.name };
    }
    if (file.size <= 0 || file.size > SELL_ATTACHMENT_MAX_BYTES) {
      return { ok: false, error: "too_large", rejectedName: file.name };
    }
  }

  return { ok: true, files: incoming };
}

/**
 * Generate a storage-safe object key once a backend exists.
 * Keeps original extension; strips path segments and unsafe characters.
 */
export function buildSafeStorageFilename(
  originalName: string,
  prefix = "sell",
): string {
  const ext = extensionOf(originalName).replace(/[^a-z0-9.]/gi, "") || "";
  const base = originalName
    .replace(/^.*[/\\]/, "")
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const stamp = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}/${stamp}-${base || "file"}${ext}`;
}

export type SellUploadResult =
  | { status: "not_configured" }
  | { status: "uploaded"; key: string; url: string };

/**
 * Upload boundary for sell attachments.
 * Returns `not_configured` until storage env/service is connected.
 * Callers must not present this as a successful file submission to visitors.
 */
export async function uploadSellAttachment(
  _file: File,
): Promise<SellUploadResult> {
  // TODO(storage): implement signed upload / server multipart here.
  void _file;
  return { status: "not_configured" };
}

export function formatMaxFileSizeMb(): string {
  return String(SELL_ATTACHMENT_MAX_BYTES / (1024 * 1024));
}
