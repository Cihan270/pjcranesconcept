/** Verified General Terms May 2025 from pj-cranes.com. Dutch text prevails over translations. */
import type { AppLocale } from "@/i18n/routing";

export type TermsArticle = {
  number: number;
  title: string;
  paragraphs: string[];
};

export type TermsDocument = {
  locale: "nl" | "en";
  versionLabel: string;
  articles: TermsArticle[];
};

const termsByLocale: Record<"nl" | "en", TermsDocument> = {
  en: {
    locale: "en",
    versionLabel: "Version: May 2025",
    articles: [
  {
    "number": 1,
    "title": "Definitions",
    "paragraphs": [
      "PJ Cranes: the private limited liability company PJ Cranes B.V., having its registered office at Riddererf 11P, 3861 PT Nijkerk, the Netherlands, registered with the Dutch Chamber of Commerce under number 87020254.",
      "Counterparty: any natural person acting in the course of a profession or business, as well as any legal entity, negotiating with, entering into an Agreement with, or otherwise maintaining a legal relationship with PJ Cranes.",
      "Agreement: any agreement between PJ Cranes and the Counterparty, including but not limited to agreements concerning sale, purchase, repair, maintenance, mediation, service, transport, storage and other commercial activities.",
      "Equipment: all machines, cranes, crane parts, components, accessories and related goods sold, delivered, repaired, maintained, brokered, stored, rented or otherwise handled by PJ Cranes.",
      "Written: by letter, e-mail, electronic communication or any other durable means of communication.",
      "Incoterms: the latest version of the Incoterms published by the International Chamber of Commerce (ICC).",
      "Consequential Damages: all indirect damages, including but not limited to loss of profit, production loss, business interruption, reputational damage, loss of savings, contractual losses, transport costs, financing costs, penalties and other financial losses."
    ]
  },
  {
    "number": 2,
    "title": "Applicability",
    "paragraphs": [
      "These General Terms and Conditions exclusively apply to all quotations, offers, negotiations, Agreements, deliveries, services and all other legal relationships of PJ Cranes.",
      "PJ Cranes exclusively operates on a business-to-business (B2B) basis. Consumer sales within the meaning of applicable consumer protection legislation are expressly excluded.",
      "General terms and conditions of the Counterparty are expressly rejected and shall not apply, regardless of any reference thereto by the Counterparty.",
      "Deviations from these General Terms and Conditions shall only be valid if explicitly confirmed in Writing by PJ Cranes.",
      "If any provision of these General Terms and Conditions is null, void or unenforceable, the remaining provisions shall remain fully valid and enforceable. Parties shall replace the invalid provision with a provision reflecting the original intent as closely as possible.",
      "Failure by PJ Cranes to enforce any right shall not constitute a waiver of such right."
    ]
  },
  {
    "number": 3,
    "title": "Quotations and Offers",
    "paragraphs": [
      "All quotations, offers, price lists, statements and communications of PJ Cranes are non-binding unless explicitly stated otherwise in Writing.",
      "A quotation automatically expires if not accepted within the stated validity period. If no validity period is stated, the quotation expires fourteen (14) days after issuance.",
      "Any acceptance deviating from the offer of PJ Cranes shall constitute a rejection of the original offer and a new offer by the Counterparty, even if the deviation concerns minor matters only.",
      "All specifications, drawings, photographs, capacities, serial numbers, operating hours, technical data, certificates, inspection reports and other information provided by PJ Cranes are indicative only and non-binding.",
      "Clerical errors, calculation mistakes, typographical errors, omissions or mistakes shall not bind PJ Cranes.",
      "Quotations are based on performance under normal working conditions and during regular working hours.",
      "PJ Cranes shall not be liable for damages arising from negotiations, pre-contractual statements, due diligence, inspections or expectations created during negotiations.",
      "Composite quotations do not oblige PJ Cranes to perform partial deliveries at proportional prices."
    ]
  },
  {
    "number": 4,
    "title": "Formation of the Agreement",
    "paragraphs": [
      "Every order, instruction or confirmation issued by the Counterparty constitutes an irrevocable offer to PJ Cranes.",
      "An Agreement is exclusively formed: (a) by Written confirmation from PJ Cranes; (b) by actual performance by PJ Cranes; or (c) by issuance of an invoice by PJ Cranes.",
      "Oral statements, representations or commitments made by employees, representatives or intermediaries shall only bind PJ Cranes if confirmed in Writing by an authorized representative of PJ Cranes.",
      "PJ Cranes is entitled to require advance payment, additional security or guarantees before proceeding with delivery or performance.",
      "Every Agreement is concluded subject to the suspensive condition of timely receipt of a down payment of at least ten percent (10%) of the agreed purchase price, unless agreed otherwise in Writing.",
      "Any down payment shall qualify as a non-refundable security deposit securing the Counterparty's obligations."
    ]
  },
  {
    "number": 5,
    "title": "Prices and Payment",
    "paragraphs": [
      "All prices are exclusive of VAT, import duties, export duties, transport costs, storage costs, insurance, levies, certifications and any other additional costs unless explicitly agreed otherwise in Writing.",
      "PJ Cranes is entitled to adjust prices if cost-increasing circumstances occur after conclusion of the Agreement, including increases in raw material prices, energy prices, wages, transport costs, exchange rates, taxes or sanctions-related measures.",
      "Payments shall be made in euros without suspension, deduction, set-off or discount.",
      "Unless agreed otherwise in Writing, full payment shall be made prior to delivery.",
      "Payment terms constitute strict deadlines.",
      "In the event of late payment, the Counterparty shall be in default by operation of law without prior notice of default being required.",
      "From the moment of default, the Counterparty shall owe statutory commercial interest pursuant to Section 6:119a of the Dutch Civil Code.",
      "All judicial and extrajudicial collection costs shall be borne by the Counterparty. Extrajudicial collection costs shall amount to at least fifteen percent (15%) of the outstanding amount, with a minimum of EUR 1,500.",
      "Payments made by the Counterparty shall first reduce costs, then accrued interest and finally the principal amount.",
      "All claims of PJ Cranes shall become immediately due and payable if: (a) the Counterparty breaches its obligations; (b) attachment is levied against the Counterparty; (c) bankruptcy or suspension of payments is filed for; or (d) the business of the Counterparty is terminated or transferred."
    ]
  },
  {
    "number": 6,
    "title": "Delivery and Transfer of Risk",
    "paragraphs": [
      "Delivery shall take place in accordance with the applicable Incoterm agreed between the parties.",
      "Unless agreed otherwise in Writing, delivery shall take place Ex Works (EXW) Nijkerk, the Netherlands, in accordance with Incoterms 2020.",
      "Delivery times stated by PJ Cranes are indicative only and shall never qualify as strict deadlines.",
      "Exceeding a delivery time shall not entitle the Counterparty to compensation, suspension or termination.",
      "PJ Cranes is entitled to make partial deliveries and invoice separately.",
      "Risk of loss, theft, damage or destruction of the Equipment transfers to the Counterparty in accordance with the applicable Incoterm.",
      "If the Counterparty fails to take timely delivery, the risk shall nevertheless fully transfer to the Counterparty.",
      "All costs arising from delayed acceptance, including storage, transport and insurance costs, shall be borne entirely by the Counterparty."
    ]
  },
  {
    "number": 7,
    "title": "Sale of Used Equipment",
    "paragraphs": [
      "Unless explicitly agreed otherwise in Writing, all Equipment sold by PJ Cranes constitutes used equipment.",
      "Sale and delivery take place strictly on an \"as is, where is, with all faults\" basis.",
      "The Equipment is delivered in the factual condition in which it exists at the time of delivery, including all visible and hidden defects, wear, deficiencies, technical shortcomings and missing parts.",
      "PJ Cranes provides no express or implied warranty regarding (to the extent permitted by law): technical condition; functionality; maintenance history; operating hours; market value; suitability for a particular purpose; compliance with national or international laws or regulations; or CE marking, certification or inspection status.",
      "The Counterparty acknowledges that it had sufficient opportunity to inspect the Equipment, performed its own independent investigation, did not rely on representations made by PJ Cranes, and is fully aware of the condition of the Equipment. The Counterparty shall be independently responsible for verifying local safety, registration, inspection, and approval requirements prior to commissioning or export.",
      "All information and documentation provided by PJ Cranes are indicative only and non-binding.",
      "Any claims relating to non-conformity, mistake, warranty or misrepresentation are excluded to the maximum extent permitted by law.",
      "The Counterparty waives any right to rescission, price reduction or damages in relation to visible or hidden defects, except in cases of wilful misconduct or gross negligence by PJ Cranes."
    ]
  },
  {
    "number": 8,
    "title": "Inspection and Complaints",
    "paragraphs": [
      "The Counterparty shall inspect the Equipment immediately upon delivery.",
      "Visible defects must be reported in Writing within five (5) working days after delivery.",
      "Hidden defects must be reported in Writing within five (5) working days after discovery, with an absolute maximum of thirty (30) days after delivery.",
      "After expiry of these periods, all rights of the Counterparty shall lapse.",
      "Complaints do not suspend payment obligations."
    ]
  },
  {
    "number": 9,
    "title": "Retention of Title and Right of Retention",
    "paragraphs": [
      "All delivered goods shall remain the property of PJ Cranes until full payment of all claims has been received.",
      "As long as ownership has not transferred, the Counterparty shall not sell, pledge or otherwise encumber the Equipment.",
      "The Counterparty shall carefully store and adequately insure the Equipment.",
      "PJ Cranes shall be entitled to repossess the Equipment if the Counterparty fails to fulfil its obligations.",
      "The Counterparty irrevocably authorizes PJ Cranes to enter all locations where the Equipment is situated for repossession purposes.",
      "PJ Cranes shall have a right of retention over all goods belonging to the Counterparty held by PJ Cranes as long as outstanding claims exist."
    ]
  },
  {
    "number": 10,
    "title": "Repair and Maintenance Services",
    "paragraphs": [
      "All estimates of labour hours, repair duration or costs are indicative only.",
      "Additional work and unforeseen activities may be charged separately.",
      "Replaced parts and materials shall become the property of PJ Cranes unless agreed otherwise in Writing.",
      "Transport of Equipment to and from PJ Cranes shall be entirely at the risk of the Counterparty.",
      "PJ Cranes shall not be liable for hidden defects that could not reasonably have been discovered during the performance of the work."
    ]
  },
  {
    "number": 11,
    "title": "Export Control and Sanctions",
    "paragraphs": [
      "The Counterparty guarantees full compliance with all applicable export control, sanctions and trade laws, including EU, US, UK and UN sanctions regimes.",
      "The Equipment may not directly or indirectly be supplied to sanctioned countries, organizations, entities or individuals.",
      "PJ Cranes is entitled to immediately suspend or refuse delivery or performance in case of actual or suspected violations of sanctions legislation.",
      "The Counterparty shall fully indemnify PJ Cranes against all claims, penalties, damages, sanctions and costs arising from violations of export control or sanctions legislation."
    ]
  },
  {
    "number": 12,
    "title": "Force Majeure",
    "paragraphs": [
      "Force majeure shall mean any circumstance beyond the reasonable control of PJ Cranes preventing performance of its obligations.",
      "Force majeure includes, but is not limited to, war, sanctions, pandemics, strikes, cyberattacks, energy failures, governmental measures, transport disruptions, supplier failures and natural disasters.",
      "During force majeure, obligations of PJ Cranes shall be suspended.",
      "If the force majeure situation continues for more than sixty (60) days, either party may terminate the Agreement without liability."
    ]
  },
  {
    "number": 13,
    "title": "Liability and Indemnification",
    "paragraphs": [
      "Any liability of PJ Cranes shall be limited to direct damages only.",
      "PJ Cranes shall never be liable for Consequential Damages.",
      "Any liability of PJ Cranes shall be limited to: (a) the invoice amount of the relevant Agreement; or (b) the amount actually paid under PJ Cranes' liability insurance, whichever amount is lower.",
      "Any claim against PJ Cranes shall lapse twelve (12) months after delivery or performance.",
      "The Counterparty shall indemnify PJ Cranes against all third-party claims related to the Equipment or performance of the Agreement.",
      "All limitations of liability apply irrespective of the legal basis of the claim.",
      "The limitations of liability shall not apply in case of wilful misconduct or gross negligence by the management of PJ Cranes."
    ]
  },
  {
    "number": 14,
    "title": "Suspension and Termination",
    "paragraphs": [
      "PJ Cranes is entitled to suspend performance of its obligations if the Counterparty fails to fulfil its obligations.",
      "PJ Cranes is entitled to fully or partially terminate the Agreement out of court if: (a) the Counterparty breaches its obligations; (b) bankruptcy or suspension of payments is filed for; (c) attachment is levied; or (d) justified doubts exist regarding the Counterparty's creditworthiness.",
      "In the event of termination, all already due claims shall remain fully payable.",
      "Paid down payments shall not be refunded and shall qualify as minimum liquidated damages, without prejudice to the right of PJ Cranes to claim additional damages."
    ]
  },
  {
    "number": 15,
    "title": "Governing Law and Jurisdiction",
    "paragraphs": [
      "All legal relationships between PJ Cranes and the Counterparty shall exclusively be governed by Dutch law.",
      "The applicability of the United Nations Convention on Contracts for the International Sale of Goods (CISG / Vienna Sales Convention) is expressly excluded.",
      "All disputes shall exclusively be submitted to the competent court of Midden-Nederland District Court, location Utrecht, the Netherlands."
    ]
  },
  {
    "number": 16,
    "title": "Final Provisions",
    "paragraphs": [
      "The administration and electronic records of PJ Cranes shall constitute binding evidence, unless proven otherwise.",
      "Rights and obligations of the Counterparty under the Agreement may not be assigned without prior Written consent of PJ Cranes.",
      "Provisions which by their nature are intended to survive termination shall remain fully effective after termination.",
      "The Dutch version of these General Terms and Conditions shall prevail over any translation thereof.",
      "The Agreement, including these General Terms and Conditions, constitutes the entire agreement between the parties and supersedes all prior oral and written agreements, statements and representations.",
      "The Counterparty confirms that it has not entered into the Agreement based on any statements or representations other than those expressly set out in Writing."
    ]
  }
] as TermsArticle[],
  },
  nl: {
    locale: "nl",
    versionLabel: "Versie: mei 2025",
    articles: [
  {
    "number": 1,
    "title": "Definities",
    "paragraphs": [
      "PJ Cranes: de besloten vennootschap met beperkte aansprakelijkheid PJ Cranes B.V., gevestigd aan de Riddererf 11P, 3861 PT te Nijkerk, Nederland, ingeschreven in het Handelsregister van de Kamer van Koophandel onder nummer 87020254.",
      "Wederpartij: iedere natuurlijke persoon handelend in de uitoefening van beroep of bedrijf, alsmede iedere rechtspersoon, die met PJ Cranes onderhandelt over, een Overeenkomst aangaat met, dan wel anderszins een rechtsverhouding heeft met PJ Cranes.",
      "Overeenkomst: iedere overeenkomst tussen PJ Cranes en de Wederpartij, waaronder mede begrepen koop-, verkoop-, reparatie-, onderhouds-, bemiddelings-, service-, transport-, opslag- en overige commerciële overeenkomsten.",
      "Materieel: alle door PJ Cranes verkochte, geleverde, gerepareerde, onderhouden, bemiddelde, opgeslagen, verhuurde of anderszins behandelde machines, hijskranen, onderdelen, componenten, accessoires en aanverwante zaken.",
      "Schriftelijk: per brief, e-mail, elektronische communicatie of enig ander duurzaam communicatiemiddel.",
      "Incoterms: de meest recente versie van de Incoterms gepubliceerd door de International Chamber of Commerce (ICC).",
      "Gevolgschade: alle indirecte schade, waaronder mede begrepen winstderving, productieverlies, stagnatieschade, reputatieschade, gemiste besparingen, contractverlies, transportkosten, financieringskosten, boetes en overige vermogensschade."
    ]
  },
  {
    "number": 2,
    "title": "Toepasselijkheid",
    "paragraphs": [
      "Deze algemene voorwaarden zijn exclusief van toepassing op alle aanbiedingen, offertes, onderhandelingen, Overeenkomsten, leveringen, werkzaamheden en overige rechtsbetrekkingen van PJ Cranes.",
      "PJ Cranes handelt uitsluitend in de uitoefening van een B2B-onderneming. Consumentenkoop in de zin van artikel 7:5 BW is uitdrukkelijk uitgesloten.",
      "Algemene voorwaarden van de Wederpartij worden uitdrukkelijk van de hand gewezen en zijn niet van toepassing, ongeacht een verwijzing daarnaar door de Wederpartij.",
      "Afwijkingen van deze algemene voorwaarden zijn uitsluitend geldig indien deze uitdrukkelijk Schriftelijk door PJ Cranes zijn bevestigd.",
      "Indien enige bepaling van deze voorwaarden nietig, vernietigbaar of onafdwingbaar blijkt, blijven de overige bepalingen onverminderd van kracht. Partijen zullen in dat geval een vervangende bepaling overeenkomen die zoveel mogelijk aansluit bij doel en strekking van de oorspronkelijke bepaling.",
      "Het niet uitoefenen van enig recht door PJ Cranes leidt niet tot afstand van recht."
    ]
  },
  {
    "number": 3,
    "title": "Offertes en aanbiedingen",
    "paragraphs": [
      "Alle offertes, aanbiedingen, prijsopgaven, mededelingen en verklaringen van PJ Cranes zijn vrijblijvend en niet bindend, tenzij uitdrukkelijk Schriftelijk anders is vermeld.",
      "Een offerte vervalt automatisch indien deze niet binnen de daarin genoemde termijn is aanvaard. Indien geen termijn is vermeld, vervalt de offerte veertien (14) dagen na dagtekening.",
      "Een aanvaarding die afwijkt van het aanbod van PJ Cranes geldt als een verwerping van het oorspronkelijke aanbod en als een nieuw aanbod van de Wederpartij, ook indien de afwijking slechts betrekking heeft op ondergeschikte punten.",
      "Door PJ Cranes verstrekte afbeeldingen, specificaties, tekeningen, bouwjaren, gewichten, capaciteiten, serienummers, draaiuren, technische gegevens, certificaten, inspectierapporten en overige informatie zijn uitsluitend indicatief en niet bindend.",
      "Kennelijke fouten, verschrijvingen, rekenfouten, omissies of vergissingen binden PJ Cranes niet.",
      "Offertes zijn gebaseerd op uitvoering onder normale omstandigheden en gedurende normale werktijden.",
      "PJ Cranes is niet aansprakelijk voor schade voortvloeiend uit onderhandelingen, precontractuele mededelingen, due diligence, inspecties of gewekte verwachtingen.",
      "Een samengestelde prijsopgave verplicht PJ Cranes niet tot gedeeltelijke levering tegen een evenredig deel van de opgegeven prijs."
    ]
  },
  {
    "number": 4,
    "title": "Totstandkoming van de Overeenkomst",
    "paragraphs": [
      "Iedere bestelling, opdracht of bevestiging van de Wederpartij geldt als een onherroepelijk aanbod aan PJ Cranes.",
      "Een Overeenkomst komt uitsluitend tot stand:\na. door Schriftelijke bevestiging door PJ Cranes;\nb. doordat PJ Cranes feitelijk uitvoering geeft aan de Overeenkomst; of\nc. doordat PJ Cranes een factuur verzendt.",
      "Mondelinge toezeggingen of verklaringen van medewerkers, vertegenwoordigers of derden binden PJ Cranes uitsluitend indien Schriftelijk bevestigd door een bevoegde vertegenwoordiger van PJ Cranes.",
      "PJ Cranes is gerechtigd vooruitbetaling, aanvullende zekerheid of garanties te verlangen alvorens tot levering of uitvoering over te gaan.",
      "Iedere Overeenkomst wordt aangegaan onder de opschortende voorwaarde van tijdige ontvangst van een aanbetaling van minimaal tien procent (10%) van de overeengekomen koopprijs, tenzij Schriftelijk anders overeengekomen.",
      "Een aanbetaling geldt als niet-restitueerbare waarborgsom en strekt tot zekerheid van de nakoming van alle verplichtingen van de Wederpartij."
    ]
  },
  {
    "number": 5,
    "title": "Prijzen en betaling",
    "paragraphs": [
      "Alle prijzen zijn exclusief btw, invoerrechten, uitvoerrechten, transportkosten, opslagkosten, verzekeringen, heffingen, certificeringen en overige bijkomende kosten, tenzij Schriftelijk anders overeengekomen.",
      "PJ Cranes is gerechtigd prijzen aan te passen indien na het sluiten van de Overeenkomst kostprijsverhogende omstandigheden optreden, waaronder stijging van grondstofprijzen, energieprijzen, lonen, transportkosten, wisselkoersen, belastingen of sanctiemaatregelen.",
      "Betaling dient te geschieden in euro's, zonder opschorting, korting of verrekening.",
      "Tenzij Schriftelijk anders overeengekomen dient volledige betaling plaats te vinden vóór levering.",
      "Betalingstermijnen gelden als fatale termijnen.",
      "Bij niet-tijdige betaling verkeert de Wederpartij van rechtswege in verzuim zonder nadere ingebrekestelling.",
      "Vanaf het moment van verzuim is de Wederpartij de wettelijke handelsrente ex artikel 6:119a BW verschuldigd.",
      "Alle buitengerechtelijke en gerechtelijke kosten komen volledig voor rekening van de Wederpartij. De buitengerechtelijke incassokosten bedragen minimaal vijftien procent (15%) van het openstaande bedrag, met een minimum van EUR 1.500,-.",
      "Door de Wederpartij gedane betalingen strekken eerst in mindering op kosten, vervolgens op rente en daarna op de hoofdsom.",
      "Alle vorderingen van PJ Cranes worden onmiddellijk opeisbaar indien:\na. de Wederpartij tekortschiet in haar verplichtingen;\nb. beslag wordt gelegd ten laste van de Wederpartij;\nc. surseance van betaling of faillissement wordt aangevraagd;\nd. de onderneming van de Wederpartij wordt beëindigd of overgedragen."
    ]
  },
  {
    "number": 6,
    "title": "Levering en risico",
    "paragraphs": [
      "Levering geschiedt conform de toepasselijke Incoterm zoals overeengekomen tussen partijen.",
      "Tenzij Schriftelijk anders overeengekomen geschiedt levering Ex Works (EXW) Nijkerk, Nederland, conform Incoterms 2020.",
      "Opgegeven levertijden zijn uitsluitend indicatief en nimmer fatale termijnen.",
      "Overschrijding van een levertijd geeft de Wederpartij geen recht op schadevergoeding, opschorting of ontbinding.",
      "PJ Cranes is gerechtigd in gedeelten te leveren en afzonderlijk te factureren.",
      "Het risico van verlies, beschadiging, diefstal of tenietgaan van het Materieel gaat over op de Wederpartij overeenkomstig de toepasselijke Incoterm.",
      "Indien de Wederpartij het Materieel niet tijdig afneemt, gaat het risico alsnog volledig over op de Wederpartij.",
      "Alle kosten voortvloeiend uit niet-tijdige afname, waaronder opslag-, transport- en verzekeringskosten, komen volledig voor rekening van de Wederpartij."
    ]
  },
  {
    "number": 7,
    "title": "Verkoop van gebruikt materieel",
    "paragraphs": [
      "Tenzij uitdrukkelijk Schriftelijk anders overeengekomen betreft alle door PJ Cranes verkochte Materieel gebruikt materieel.",
      "Verkoop en levering geschieden strikt op basis van \"as is, where is, with all faults\".",
      "Het Materieel wordt geleverd in de feitelijke staat waarin het zich bevindt ten tijde van levering, inclusief alle zichtbare en onzichtbare gebreken, slijtage, defecten, technische tekortkomingen en ontbrekende onderdelen.",
      "PJ Cranes verstrekt geen enkele expliciete of impliciete garantie met betrekking tot (voor zover wettelijk is toegestaan):\na. technische staat;\nb. functionaliteit;\nc. onderhoudsgeschiedenis;\nd. draaiuren;\ne. marktwaarde;\nf. geschiktheid voor enig specifiek doel;\ng. naleving van nationale of internationale regelgeving;\nh. CE-markering, certificering of keuringsstatus.",
      "De Wederpartij erkent:\na. voldoende gelegenheid te hebben gehad het Materieel te inspecteren;\nb. zelfstandig onderzoek te hebben verricht;\nc. niet te hebben vertrouwd op verklaringen van PJ Cranes;\nd. volledig bekend te zijn met de staat van het Materieel;\nDe Wederpartij is zelfstandig verantwoordelijk voor controle op lokale veiligheids-, registratie-, keurings- en toelatingseisen vóór ingebruikname of export.",
      "Alle verstrekte informatie en documentatie zijn uitsluitend indicatief en niet bindend.",
      "Iedere aanspraak wegens non-conformiteit, dwaling, garantie of misleiding wordt uitgesloten voor zover wettelijk toegestaan.",
      "De Wederpartij doet afstand van ieder recht op ontbinding, prijsvermindering of schadevergoeding wegens zichtbare of onzichtbare gebreken, behoudens in geval van opzet of bewuste roekeloosheid van PJ Cranes."
    ]
  },
  {
    "number": 8,
    "title": "Onderzoeksplicht en klachten",
    "paragraphs": [
      "De Wederpartij dient het Materieel onmiddellijk bij levering zorgvuldig te inspecteren.",
      "Zichtbare gebreken dienen uiterlijk binnen vijf (5) werkdagen na levering Schriftelijk te worden gemeld.",
      "Verborgen gebreken dienen uiterlijk binnen vijf (5) werkdagen na ontdekking Schriftelijk te worden gemeld, met een absoluut maximum van dertig (30) dagen na levering.",
      "Na het verstrijken van deze termijnen vervallen alle rechten van de Wederpartij.",
      "Klachten schorten betalingsverplichtingen niet op."
    ]
  },
  {
    "number": 9,
    "title": "Eigendomsvoorbehoud en retentierecht",
    "paragraphs": [
      "Alle geleverde zaken blijven eigendom van PJ Cranes totdat volledige betaling van alle vorderingen heeft plaatsgevonden.",
      "Zolang het eigendom niet is overgegaan, is het de Wederpartij niet toegestaan het Materieel te vervreemden, verpanden of bezwaren.",
      "De Wederpartij is verplicht het Materieel zorgvuldig te bewaren en adequaat te verzekeren.",
      "PJ Cranes is gerechtigd het Materieel terug te nemen indien de Wederpartij tekortschiet in haar verplichtingen.",
      "De Wederpartij verleent PJ Cranes reeds nu voor alsdan onherroepelijke toestemming alle locaties te betreden waar het Materieel zich bevindt teneinde dit terug te nemen.",
      "PJ Cranes heeft een retentierecht op alle zaken van de Wederpartij die zij onder zich heeft zolang openstaande vorderingen bestaan."
    ]
  },
  {
    "number": 10,
    "title": "Reparatie- en onderhoudswerkzaamheden",
    "paragraphs": [
      "Alle opgaven van arbeidsuren, reparatieduur of kosten zijn indicatief.",
      "Meerwerk en aanvullende werkzaamheden mogen afzonderlijk in rekening worden gebracht.",
      "Vervangen onderdelen en materialen worden eigendom van PJ Cranes tenzij Schriftelijk anders overeengekomen.",
      "Transport van Materieel naar of van PJ Cranes geschiedt volledig voor risico van de Wederpartij.",
      "PJ Cranes staat niet in voor verborgen gebreken die tijdens werkzaamheden niet redelijkerwijs konden worden ontdekt."
    ]
  },
  {
    "number": 11,
    "title": "Exportcontrole en sanctiewetgeving",
    "paragraphs": [
      "De Wederpartij garandeert volledige naleving van alle toepasselijke exportcontrole-, sanctie- en handelswetgeving, waaronder EU-, VS-, VK- en VN-sanctieregimes.",
      "Het Materieel mag niet direct of indirect worden geleverd aan gesanctioneerde landen, organisaties, entiteiten of personen.",
      "PJ Cranes is gerechtigd levering of uitvoering onmiddellijk op te schorten of te weigeren indien sprake is van een (vermoeden van) overtreding van sanctiewetgeving.",
      "De Wederpartij vrijwaart PJ Cranes volledig tegen alle aanspraken, boetes, schade, sancties en kosten voortvloeiend uit overtreding van export- of sanctiewetgeving."
    ]
  },
  {
    "number": 12,
    "title": "Overmacht",
    "paragraphs": [
      "Onder overmacht wordt verstaan iedere omstandigheid buiten de redelijke invloedssfeer van PJ Cranes waardoor nakoming redelijkerwijs niet kan worden verlangd.",
      "Onder overmacht vallen onder meer oorlog, sancties, pandemieën, stakingen, cyberaanvallen, energiestoringen, overheidsmaatregelen, transportproblemen, leveranciersfalen en natuurrampen.",
      "Tijdens overmacht worden verplichtingen van PJ Cranes opgeschort.",
      "Indien de overmachtsituatie langer dan zestig (60) dagen voortduurt, zijn beide partijen gerechtigd de Overeenkomst geheel of gedeeltelijk te beëindigen zonder schadeplichtigheid."
    ]
  },
  {
    "number": 13,
    "title": "Aansprakelijkheid en vrijwaring",
    "paragraphs": [
      "Iedere aansprakelijkheid van PJ Cranes is beperkt tot directe schade.",
      "PJ Cranes is nooit aansprakelijk voor Gevolgschade.",
      "Iedere aansprakelijkheid van PJ Cranes is beperkt tot:\na. het factuurbedrag van de betreffende Overeenkomst; of\nb. het bedrag dat daadwerkelijk onder de aansprakelijkheidsverzekering van PJ Cranes wordt uitgekeerd,\nwaarbij het laagste bedrag geldt.",
      "Iedere vordering jegens PJ Cranes vervalt uiterlijk twaalf (12) maanden na levering of uitvoering.",
      "De Wederpartij vrijwaart PJ Cranes tegen alle aanspraken van derden verband houdende met het Materieel of de uitvoering van de Overeenkomst.",
      "Alle aansprakelijkheidsbeperkingen gelden ongeacht de rechtsgrond van de vordering.",
      "De aansprakelijkheidsbeperkingen gelden niet in geval van opzet of bewuste roekeloosheid van de directie van PJ Cranes."
    ]
  },
  {
    "number": 14,
    "title": "Opschorting en ontbinding",
    "paragraphs": [
      "PJ Cranes is gerechtigd de uitvoering van haar verplichtingen op te schorten indien de Wederpartij tekortschiet in de nakoming van haar verplichtingen.",
      "PJ Cranes is gerechtigd de Overeenkomst geheel of gedeeltelijk buitengerechtelijk te ontbinden indien:\na. de Wederpartij tekortschiet;\nb. faillissement of surseance van betaling wordt aangevraagd;\nc. beslag wordt gelegd;\nd. gegronde twijfel bestaat over de kredietwaardigheid van de Wederpartij.",
      "In geval van ontbinding blijven reeds opeisbare vorderingen volledig verschuldigd.",
      "Reeds betaalde aanbetalingen worden niet gerestitueerd en gelden als minimale gefixeerde schadevergoeding, onverminderd het recht van PJ Cranes aanvullende schadevergoeding te vorderen."
    ]
  },
  {
    "number": 15,
    "title": "Toepasselijk recht en geschillen",
    "paragraphs": [
      "Op alle rechtsverhoudingen tussen PJ Cranes en de Wederpartij is uitsluitend Nederlands recht van toepassing.",
      "De toepasselijkheid van het Weens Koopverdrag (CISG) wordt uitdrukkelijk uitgesloten.",
      "Alle geschillen zullen exclusief worden voorgelegd aan de bevoegde rechter van de rechtbank Midden-Nederland, locatie Utrecht."
    ]
  },
  {
    "number": 16,
    "title": "Slotbepalingen",
    "paragraphs": [
      "De administratie en gegevensdragers van PJ Cranes leveren dwingend bewijs op, behoudens tegenbewijs.",
      "Rechten en verplichtingen van de Wederpartij uit hoofde van de Overeenkomst zijn niet overdraagbaar zonder voorafgaande Schriftelijke toestemming van PJ Cranes.",
      "Bepalingen die naar hun aard bestemd zijn om na beëindiging van de Overeenkomst voort te duren, blijven onverminderd van kracht.",
      "De Nederlandse versie van deze voorwaarden prevaleert boven vertalingen daarvan.",
      "De Overeenkomst, inclusief deze algemene voorwaarden, vormt de volledige overeenkomst tussen partijen en vervangt alle eerdere mondelinge en schriftelijke afspraken, verklaringen en toezeggingen.",
      "De Wederpartij bevestigt de Overeenkomst niet te zijn aangegaan op basis van mededelingen of verklaringen anders dan uitdrukkelijk Schriftelijk vastgelegd."
    ]
  }
] as TermsArticle[],
  },
};

/** Prefer NL for Dutch UI; EN for other locales (Dutch original still prevails legally). */
export function getTermsDocument(locale: AppLocale | string): TermsDocument {
  if (locale === "nl") return termsByLocale.nl;
  return termsByLocale.en;
}
