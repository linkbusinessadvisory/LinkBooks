import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/common/states";
import { StatCard } from "@/components/common/stat-card";
import { CompanyEmptyState, NO_FIGURE } from "@/components/common/company-empty";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/purchases")({
  head: () => ({
    meta: [
      { title: "Purchases — LinkBooks" },
      { name: "description", content: "Supplier bills, payments and expenses in LinkBooks." },
      { property: "og:title", content: "Purchases — LinkBooks" },
      {
        property: "og:description",
        content: "Supplier bills, payments and expenses in LinkBooks.",
      },
    ],
  }),
  component: Purchases,
});

function Purchases() {
  return (
    <>
      <PageHeader
        title="Purchases"
        description="Supplier bills, supplier payments and employee expenses."
        actions={
          <>
            <Button variant="outline" size="sm">
              New expense
            </Button>
            <Button size="sm">New bill</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Bills to pay" value={NO_FIGURE} hint="No bills" />
        <StatCard label="Paid this month" value={NO_FIGURE} hint="No payments" />
        <StatCard label="Expense claims" value={NO_FIGURE} hint="No expenses" />
      </div>

      <Tabs defaultValue="bills" className="mt-6">
        <TabsList>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="bills" className="mt-4">
          <CompanyEmptyState
            title="No bills"
            description="Supplier bills will be listed here once entered."
            actionLabel="New bill"
          />
        </TabsContent>
        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Supplier payments will be listed here.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses" className="mt-4">
          <EmptyState
            title="No expense claims"
            description="Expenses recorded with receipts will appear here for review and approval."
            actionLabel="New expense"
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
