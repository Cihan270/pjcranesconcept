"use client";

import Error from "next/error";

/**
 * Renders when a route outside a valid locale is requested and
 * `[locale]/layout` calls `notFound()` for an invalid segment.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  );
}
