import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/common/states";
import { StatCard, StatusBadge } from "@/components/common/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const bills = [
  {
    ref: "BILL-318",
    supplier: "Northwind Supplies",
    due: "08 Oct 2026",
    amount: "742.60",
    status: "Awaiting payment" as const,
  },
  {
    ref: "BILL-317",
    supplier: "Civic Workspace",
    due: "01 Oct 2026",
    amount: "1,850.00",
    status: "Awaiting payment" as const,
  },
  {
    ref: "BILL-315",
    supplier: "Lumen Hosting",
    due: "18 Sep 2026",
    amount: "226.15",
    status: "Paid" as const,
  },
];

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
        <StatCard label="Bills to pay" value="2,592.60" tone="warning" hint="2 bills" />
        <StatCard label="Paid this month" value="226.15" tone="positive" />
        <StatCard label="Expense claims" value="0" hint="Nothing submitted" />
      </div>

      <Tabs defaultValue="bills" className="mt-6">
        <TabsList>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="bills" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="hidden sm:table-cell">Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.map((r) => (
                    <TableRow key={r.ref}>
                      <TableCell className="font-medium">{r.ref}</TableCell>
                      <TableCell className="text-muted-foreground">{r.supplier}</TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {r.due}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="numeric text-right">{r.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
