import type { ServiceItem } from "@/types/content";

/**
 * Service themes from the live site: buy, sell, source, transport, documents.
 * Dedicated transport / documentation pages are new in this redesign.
 */
const MACHINE = "https://pj-cranes.com/machines";

export const services: ServiceItem[] = [
  {
    id: "buy",
    slug: "buy",
    titleKey: "Services.buy.title",
    summaryKey: "Services.buy.summary",
    title: "Used cranes",
    summary:
      "High-quality used mobile and crawler cranes from Liebherr, Grove, Terex-Demag and Tadano Faun — enquiry-only pricing.",
    href: "/cranes",
    image: {
      src: `${MACHINE}/1678695475prkuy.jpg`,
      alt: "Grove GMK 4100L-1 mobile crane",
      objectPosition: "52% 42%",
    },
  },
  {
    id: "sell",
    slug: "sell",
    titleKey: "Services.sell.title",
    summaryKey: "Services.sell.summary",
    title: "Sell your crane",
    summary:
      "No cure, no pay sales process: valuation, exclusivity, active market approach, paperwork and handover.",
    href: "/sell-your-crane",
    image: {
      src: `${MACHINE}/1702912842pqh3u.jpg`,
      alt: "Grove GMK 5250 XL mobile crane",
      objectPosition: "48% 40%",
    },
  },
  {
    id: "find",
    slug: "find",
    titleKey: "Services.find.title",
    summaryKey: "Services.find.summary",
    title: "Source your crane",
    summary:
      "Looking for a specific machine? Tell us the manufacturer, model and capacity — we search our international network.",
    href: "/find-a-crane",
    image: {
      src: `${MACHINE}/1666880941nl0l3.jpg`,
      alt: "Liebherr LTM 1060-3.1 mobile crane",
      objectPosition: "45% 38%",
    },
  },
  {
    id: "transport-shipping",
    slug: "transport-shipping",
    titleKey: "Services.transport.title",
    summaryKey: "Services.transport.summary",
    title: "Transport & shipping",
    summary:
      "Road and ocean logistics arranged on request, from port to doorstep. Delivery is calculated separately from the machine price.",
    href: "/services/transport-shipping",
    image: {
      src: `${MACHINE}/1762941241qtp3m.jpg`,
      alt: "Liebherr LTM 1130-5.1 ready for transport",
      objectPosition: "50% 55%",
    },
  },
  {
    id: "documentation-export",
    slug: "documentation-export",
    titleKey: "Services.documentation.title",
    summaryKey: "Services.documentation.summary",
    title: "Documentation & export",
    summary:
      "Certificates, inspections, customs coordination and the document package needed for international handover.",
    href: "/services/documentation-export",
    image: {
      src: `${MACHINE}/1782138469msxz9.jpg`,
      alt: "Liebherr LTM 1100-4.1 mobile crane",
      objectPosition: "55% 40%",
    },
  },
];

export function getServices(): ServiceItem[] {
  return services;
}

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return services.find((service) => service.slug === slug);
}
