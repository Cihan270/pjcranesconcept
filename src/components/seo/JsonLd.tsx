import {
  serializeJsonLd,
  type JsonLd as JsonLdData,
} from "@/lib/seo/json-ld";

type JsonLdProps = {
  data: JsonLdData | JsonLdData[];
};

/** Renders schema.org JSON-LD as a native script tag (Next.js recommended pattern). */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
