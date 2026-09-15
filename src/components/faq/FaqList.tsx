"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type FaqListItem = {
  id: string;
  question: string;
  answer: string;
};

type FaqListProps = {
  items: FaqListItem[];
};

export function FaqList({ items }: FaqListProps) {
  return (
    <Accordion className="border-y border-line">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="border-line not-last:border-b"
        >
          <AccordionTrigger className="min-h-11 rounded-none py-4 text-left font-heading text-base font-semibold tracking-tight hover:no-underline md:text-lg">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground md:text-base">
            <p>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
