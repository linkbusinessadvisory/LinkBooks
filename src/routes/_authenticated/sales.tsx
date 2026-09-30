import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/states";
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

const invoices = [
  {
    ref: "INV-1042",
    customer: "Harbour Design Ltd",
    due: "12 Oct 2026",
    amount: "4,250.00",
    status: "Awaiting payment" as const,
  },
  {
    ref: "INV-1041",
    customer: "Stonebridge Media",
    due: "30 Sep 2026",
    amount: "1,180.00",
    status: "Paid" as const,
  },
  {
    ref: "INV-1039",
    customer: "Alder & Finch",
    due: "05 Sep 2026",
    amount: "2,410.00",
    status: "Overdue" as const,
  },
  {
    ref: "INV-1043",
    customer: "Kestrel Analytics",
    due: "—",
    amount: "9,600.00",
    status: "Draft" as const,
  },
];

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
        <StatCard label="Draft" value="1" hint="Not yet posted" />
        <StatCard label="Awaiting payment" value="4,250.00" tone="warning" />
        <StatCard label="Overdue" value="2,410.00" tone="negative" hint="1 invoice" />
      </div>

      <Tabs defaultValue="invoices" className="mt-6">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="credit-notes">Credit notes</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden sm:table-cell">Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((r) => (
                    <TableRow key={r.ref}>
                      <TableCell className="font-medium">{r.ref}</TableCell>
                      <TableCell className="text-muted-foreground">{r.customer}</TableCell>
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
