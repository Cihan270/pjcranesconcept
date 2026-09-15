/**
 * Privacy notice — company-identity accurate draft for the redesign.
 * Full legal text should be reviewed by counsel before production launch.
 */
import { company } from "@/data/company";
import type { AppLocale } from "@/i18n/routing";

export type PrivacySection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type PrivacyDocument = {
  locale: "nl" | "en";
  updatedLabel: string;
  intro: string[];
  sections: PrivacySection[];
};

const controllerLineEn = `${company.legalName}, ${company.address.street}, ${company.address.postalCode} ${company.address.city}, ${company.address.country} (KvK ${company.kvk}). Contact: ${company.email}, ${company.phone.display}.`;

const controllerLineNl = `${company.legalName}, ${company.address.street}, ${company.address.postalCode} ${company.address.city}, ${company.address.country} (KvK ${company.kvk}). Contact: ${company.email}, ${company.phone.display}.`;

const privacyByLocale: Record<"nl" | "en", PrivacyDocument> = {
  en: {
    locale: "en",
    updatedLabel: "Last updated: May 2025",
    intro: [
      "This privacy notice explains how PJ Cranes processes personal data when you use our website, contact us, or submit an enquiry. It is drafted for transparency under the EU General Data Protection Regulation (GDPR). Counsel should review this text before production launch.",
    ],
    sections: [
      {
        id: "controller",
        title: "Controller",
        paragraphs: [
          `The controller is ${controllerLineEn}`,
        ],
      },
      {
        id: "data",
        title: "Personal data we process",
        paragraphs: [
          "Depending on how you interact with us, we may process: name, company name, email address, phone number, message content, machine or sourcing requirements, technical logs needed to operate the site, and marketing preferences when you subscribe to updates.",
          "We do not ask for special categories of personal data via our public forms.",
        ],
      },
      {
        id: "purposes",
        title: "Purposes and legal bases",
        paragraphs: [
          "Responding to buy, sell, find, contact and newsletter requests — legitimate interests in conducting B2B crane trading, and/or steps prior to entering a contract (Art. 6(1)(b) and 6(1)(f) GDPR).",
          "Operating, securing and improving the website — legitimate interests (Art. 6(1)(f) GDPR).",
          "Sending optional marketing updates — consent (Art. 6(1)(a) GDPR), which you may withdraw at any time.",
          "Meeting legal obligations such as tax or accounting retention where applicable (Art. 6(1)(c) GDPR).",
        ],
      },
      {
        id: "recipients",
        title: "Recipients and processors",
        paragraphs: [
          "We may share data with service providers that host email delivery, website hosting, analytics (if enabled) or CRM tooling, strictly as needed to process your request. Processors act on our instructions under appropriate agreements.",
          "We do not sell personal data.",
        ],
      },
      {
        id: "transfers",
        title: "International transfers",
        paragraphs: [
          "If a provider processes data outside the EEA/UK, we rely on an adequacy decision or appropriate safeguards such as Standard Contractual Clauses, where required.",
        ],
      },
      {
        id: "retention",
        title: "Retention",
        paragraphs: [
          "Enquiry and correspondence data are retained as long as needed to handle the request and for a reasonable follow-up period in our B2B relationship, unless a longer statutory period applies.",
          "Newsletter subscriptions are kept until you unsubscribe or we delete inactive contacts.",
          "Server logs are kept only as long as needed for security and diagnostics.",
        ],
      },
      {
        id: "rights",
        title: "Your rights",
        paragraphs: [
          "You may request access, rectification, erasure, restriction, portability, and object to processing based on legitimate interests, subject to GDPR conditions.",
          "Where processing is based on consent, you may withdraw consent without affecting prior lawful processing.",
          `To exercise your rights, email ${company.email}. You may also lodge a complaint with the Dutch Autoriteit Persoonsgegevens (or your local supervisory authority).`,
        ],
      },
      {
        id: "cookies",
        title: "Cookies and similar technologies",
        paragraphs: [
          "Essential cookies or local storage may be used for locale preference, form anti-spam checks, or recently viewed inventory. Non-essential analytics or marketing cookies — if introduced later — will only run with consent where required.",
        ],
      },
      {
        id: "security",
        title: "Security",
        paragraphs: [
          "We take appropriate technical and organisational measures to protect personal data against unauthorised access, loss or alteration. No method of transmission or storage is completely secure.",
        ],
      },
      {
        id: "changes",
        title: "Changes",
        paragraphs: [
          "We may update this notice when our processing practices or legal requirements change. The updated date above will be revised accordingly.",
        ],
      },
    ],
  },
  nl: {
    locale: "nl",
    updatedLabel: "Laatst bijgewerkt: mei 2025",
    intro: [
      "Deze privacyverklaring legt uit hoe PJ Cranes persoonsgegevens verwerkt wanneer u onze website gebruikt, contact opneemt of een aanvraag indient. De tekst is opgesteld met het oog op transparantie onder de AVG. Laat deze tekst juridisch toetsen vóór productielancering.",
    ],
    sections: [
      {
        id: "controller",
        title: "Verwerkingsverantwoordelijke",
        paragraphs: [
          `De verwerkingsverantwoordelijke is ${controllerLineNl}`,
        ],
      },
      {
        id: "data",
        title: "Welke persoonsgegevens wij verwerken",
        paragraphs: [
          "Afhankelijk van uw interactie kunnen wij verwerken: naam, bedrijfsnaam, e-mailadres, telefoonnummer, berichtinhoud, machine- of sourcinggegevens, technische logs die nodig zijn om de site te laten werken, en marketingvoorkeuren wanneer u updates abonneert.",
          "Via onze openbare formulieren vragen wij geen bijzondere categorieën persoonsgegevens.",
        ],
      },
      {
        id: "purposes",
        title: "Doelen en rechtsgrondslagen",
        paragraphs: [
          "Beantwoorden van koop-, verkoop-, zoek-, contact- en nieuwsbriefverzoeken — gerechtvaardigd belang bij B2B-kraanhandel en/of stappen voorafgaand aan een overeenkomst (art. 6 lid 1 onder b en f AVG).",
          "Beheren, beveiligen en verbeteren van de website — gerechtvaardigd belang (art. 6 lid 1 onder f AVG).",
          "Optionele marketingupdates — toestemming (art. 6 lid 1 onder a AVG), die u te allen tijde kunt intrekken.",
          "Voldoen aan wettelijke verplichtingen zoals fiscale of administratieve bewaarplichten waar van toepassing (art. 6 lid 1 onder c AVG).",
        ],
      },
      {
        id: "recipients",
        title: "Ontvangers en verwerkers",
        paragraphs: [
          "Wij kunnen gegevens delen met dienstverleners voor e-mailbezorging, hosting, analytics (indien ingeschakeld) of CRM, uitsluitend voor zover nodig. Verwerkers handelen volgens onze instructies onder passende overeenkomsten.",
          "Wij verkopen geen persoonsgegevens.",
        ],
      },
      {
        id: "transfers",
        title: "Internationale doorgifte",
        paragraphs: [
          "Als een provider gegevens buiten de EER/VK verwerkt, steunen wij waar nodig op een adequaatheidsbesluit of passende waarborgen zoals standaardcontractbepalingen.",
        ],
      },
      {
        id: "retention",
        title: "Bewaartermijnen",
        paragraphs: [
          "Aanvraag- en correspondentiegegevens bewaren wij zolang nodig om het verzoek te behandelen en voor een redelijke opvolging in onze B2B-relatie, tenzij een langere wettelijke termijn geldt.",
          "Nieuwsbriefabonnementen blijven actief tot u zich uitschrijft of wij inactieve contacten verwijderen.",
          "Serverlogs worden alleen bewaard zolang nodig voor beveiliging en diagnostiek.",
        ],
      },
      {
        id: "rights",
        title: "Uw rechten",
        paragraphs: [
          "U kunt verzoeken om inzage, rectificatie, wissing, beperking, overdraagbaarheid en bezwaar tegen verwerking op basis van gerechtvaardigd belang, onder de voorwaarden van de AVG.",
          "Als verwerking op toestemming berust, kunt u die intrekken zonder afbreuk te doen aan eerdere rechtmatige verwerking.",
          `Om uw rechten uit te oefenen, mail ${company.email}. U kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens (of uw lokale toezichthouder).`,
        ],
      },
      {
        id: "cookies",
        title: "Cookies en vergelijkbare technologieën",
        paragraphs: [
          "Essentiële cookies of lokale opslag kunnen worden gebruikt voor taalvoorkeur, anti-spamcontroles of recent bekeken voorraad. Niet-essentiële analytics- of marketingcookies — indien later toegevoegd — draaien alleen met toestemming waar dat verplicht is.",
        ],
      },
      {
        id: "security",
        title: "Beveiliging",
        paragraphs: [
          "Wij treffen passende technische en organisatorische maatregelen om persoonsgegevens te beschermen tegen ongeautoriseerde toegang, verlies of wijziging. Geen enkele methode van verzending of opslag is volledig veilig.",
        ],
      },
      {
        id: "changes",
        title: "Wijzigingen",
        paragraphs: [
          "Wij kunnen deze verklaring bijwerken wanneer onze verwerkingspraktijken of wettelijke eisen wijzigen. De datum hierboven wordt dan aangepast.",
        ],
      },
    ],
  },
};

export function getPrivacyDocument(locale: AppLocale | string): PrivacyDocument {
  if (locale === "nl") return privacyByLocale.nl;
  return privacyByLocale.en;
}
