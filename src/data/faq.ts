import type { FaqItem } from "@/types/content";

/**
 * FAQ items from https://www.pj-cranes.com/en/faq.
 * EN copy is the verified source; questionKey/answerKey map to next-intl dictionaries.
 */
export const faqItems: FaqItem[] = [
  {
    id: "countries",
    questionKey: "Faq.items.countries.question",
    answerKey: "Faq.items.countries.answer",
    question: "Which countries have you been in business with?",
    answer:
      "P.J. Cranes has done business with different people and companies all over the world. Feel free to contact us if you have a question regarding the possibilities of buying or selling from a specific continent or country.",
  },
  {
    id: "experience",
    questionKey: "Faq.items.experience.question",
    answerKey: "Faq.items.experience.answer",
    question: "How long has P.J. Cranes been in business for?",
    answer:
      "P.J. Cranes has been a nested name within the crane industry for more than 20 years. With a family that has been in the market for decades, P.J. Cranes has a wide knowledge and a great network which guarantees the best service and most suitable offer for our clients.",
  },
  {
    id: "delivery",
    questionKey: "Faq.items.delivery.question",
    answerKey: "Faq.items.delivery.answer",
    question: "Does P.J. Cranes organize delivery?",
    answer:
      "At a client's request, we will deliver cranes wherever you desire (from port to doorstep). Delivery is not included in the original cost of the crane and will be calculated separately.",
  },
  {
    id: "origin",
    questionKey: "Faq.items.origin.question",
    answerKey: "Faq.items.origin.answer",
    question: "Where do the cranes P.J. Cranes sells come from?",
    answer:
      "P.J. Cranes B.V. sources the best cranes from all over the world. We have a vast and reliable network of suppliers of used cranes with whom we have been working with for years. The majority of the cranes we sell are originating Germany, France, the Netherlands and Belgium.",
  },
  {
    id: "condition",
    questionKey: "Faq.items.condition.question",
    answerKey: "Faq.items.condition.answer",
    question: "How is the condition of the cranes?",
    answer:
      "All details of each crane are described on the technical data sheets. We sell cranes from different suppliers, origins and construction years. Evidently all our cranes are in perfect working condition and are carefully investigated before selling.",
  },
  {
    id: "payment",
    questionKey: "Faq.items.payment.question",
    answerKey: "Faq.items.payment.answer",
    question: "What are the payment methods P.J. Cranes uses?",
    answer:
      "We accept payments through TT bank transfer or via a letter of credit (L/C).",
  },
  {
    id: "inspection-visit",
    questionKey: "Faq.items.inspectionVisit.question",
    answerKey: "Faq.items.inspectionVisit.answer",
    question: "How and where can I see the cranes?",
    answer:
      "The cranes can be inspected in our yard in the Netherlands or at our suppliers' terrain. To keep costs as low as possible we don't ship to the Netherlands if it isn't necessary.",
  },
  {
    id: "documents",
    questionKey: "Faq.items.documents.question",
    answerKey: "Faq.items.documents.answer",
    question: "What documents will I get when purchasing a crane?",
    answer:
      "Usually these include the crane's passport, certificate of origin, service book, parts catalog, user manual and other necessary documents. For the exact content of the package of documents, we will inform you at the time of the crane purchase.",
  },
  {
    id: "third-party-inspection",
    questionKey: "Faq.items.thirdPartyInspection.question",
    answerKey: "Faq.items.thirdPartyInspection.answer",
    question: "Does P.J. Cranes supply third party inspection reports?",
    answer: "We organize third party inspections of the crane on request.",
  },
  {
    id: "delivery-time",
    questionKey: "Faq.items.deliveryTime.question",
    answerKey: "Faq.items.deliveryTime.answer",
    question: "How long will it take to have a purchased crane delivered?",
    answer:
      "Usually all of the cranes we offer are available immediately. Delivery times differ on the current location of a crane. Feel free to get in touch with us when you have a question regarding the delivery time of a certain crane.",
  },
  {
    id: "ownership",
    questionKey: "Faq.items.ownership.question",
    answerKey: "Faq.items.ownership.answer",
    question: "Does P.J. Cranes own the cranes they sell?",
    answer:
      "80% of our stock is owned by us. For the other 20% we work on a consignment base with our suppliers.",
  },
];

export function getFaqItems(): FaqItem[] {
  return faqItems;
}

export function getFaqItemById(id: string): FaqItem | undefined {
  return faqItems.find((item) => item.id === id);
}
