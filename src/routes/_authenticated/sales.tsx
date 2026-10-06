import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/states";
import { StatCard } from "@/components/common/stat-card";
import { CompanyEmptyState, NO_FIGURE } from "@/components/common/company-empty";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/sales")({
  head: () => ({
    meta: [
      { title: "Sales — LinkBooks" },
      {
        name: "description",
        content: "Invoices, customer payments and credit notes in LinkBooks.",
      },
      { property: "og:title", content: "Sales — LinkBooks" },
      {
        property: "og:description",
        content: "Invoices, customer payments and credit notes in LinkBooks.",
      },
    ],
  }),
  component: Sales,
});

function Sales() {
  return (
    <>
      <PageHeader
        title="Sales"
        description="Customer invoices, payments received and credit notes. Posting to the ledger is enabled in a later phase."
        actions={
          <>
            <Button variant="outline" size="sm">
              Record payment
            </Button>
            <Button size="sm">New invoice</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Draft" value={NO_FIGURE} hint="No invoices" />
        <StatCard label="Awaiting payment" value={NO_FIGURE} hint="No invoices" />
        <StatCard label="Overdue" value={NO_FIGURE} hint="No invoices" />
      </div>

      <Tabs defaultValue="invoices" className="mt-6">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="credit-notes">Credit notes</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices" className="mt-4">
          <CompanyEmptyState
            title="No invoices"
            description="Customer invoices will be listed here once created."
            actionLabel="New invoice"
          />
        </TabsContent>
        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Customer payments will be listed here.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="credit-notes" className="mt-4">
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Credit notes will be listed here.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
