import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/common/states";
import { CompanyEmptyState } from "@/components/common/company-empty";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/contacts")({
  head: () => ({
    meta: [
      { title: "Contacts — LinkBooks" },
      { name: "description", content: "Customers and suppliers managed in LinkBooks." },
      { property: "og:title", content: "Contacts — LinkBooks" },
      { property: "og:description", content: "Customers and suppliers managed in LinkBooks." },
    ],
  }),
  component: Contacts,
});

const tabs = [
  { value: "all", title: "No contacts", noun: "Customers and suppliers" },
  { value: "customers", title: "No customers", noun: "Customers" },
  { value: "suppliers", title: "No suppliers", noun: "Suppliers" },
] as const;

function Contacts() {
  return (
    <>
      <PageHeader
        title="Contacts"
        description="A single record for every customer and supplier, shared across sales and purchases."
        actions={<Button size="sm">New contact</Button>}
      />

      <Tabs defaultValue="all">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          </TabsList>
          <Input placeholder="Search contacts" className="sm:max-w-xs" />
        </div>

        {tabs.map((t) => (
          <TabsContent key={t.value} value={t.value} className="mt-4">
            <CompanyEmptyState
              icon={Users}
              title={t.title}
              description={`${t.noun} will be listed here with their balances once added.`}
              actionLabel="New contact"
            />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
