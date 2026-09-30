import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/states";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — LinkBooks" },
      { name: "description", content: "Guides, answers and support for using LinkBooks." },
      { property: "og:title", content: "Help — LinkBooks" },
      { property: "og:description", content: "Guides, answers and support for using LinkBooks." },
    ],
  }),
  component: Help,
});

const faqs = [
  {
    q: "What is currently available?",
    a: "This is the product foundation: navigation, layout, the design system and every main section. Accounting calculations, banking and AI are added in later phases.",
  },
  {
    q: "Is the data on screen real?",
    a: "No. Everything shown is clearly marked demo data and is never used for real financial records.",
  },
  {
    q: "How does LinkBooks record transactions?",
    a: "Every financial document will post balanced debit and credit entries to the general ledger, which remains the single source of truth.",
  },
  {
    q: "Which countries are supported?",
    a: "The product is being built for the United States, United Kingdom, Australia, New Zealand, Canada and India, with room for more.",
  },
];

function Help() {
  return (
    <>
      <PageHeader title="Help" description="Guides and answers about how LinkBooks works." />
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base">Frequently asked</CardTitle>
          <CardDescription>Short answers about the current build.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
}
