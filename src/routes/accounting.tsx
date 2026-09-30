import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState, LoadingState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/accounting")({
  head: () => ({
    meta: [
      { title: "Accounting — LinkBooks" },
      {
        name: "description",
        content: "Chart of accounts, manual journals and the general ledger in LinkBooks.",
      },
      { property: "og:title", content: "Accounting — LinkBooks" },
      {
        property: "og:description",
        content: "Chart of accounts, manual journals and the general ledger in LinkBooks.",
      },
    ],
  }),
  component: Accounting,
});

const coa = [
  { code: "1000", name: "Business Current Account", type: "Asset" },
  { code: "1100", name: "Accounts Receivable", type: "Asset" },
  { code: "2100", name: "Accounts Payable", type: "Liability" },
  { code: "3000", name: "Owner's Equity", type: "Equity" },
  { code: "4000", name: "Sales", type: "Income" },
  { code: "5000", name: "Cost of Sales", type: "Expense" },
];

function Accounting() {
  return (
    <>
      <PageHeader
        title="Accounting"
        description="The ledger side of LinkBooks: chart of accounts, manual journals, periods and the general ledger."
        actions={<Button size="sm">New manual journal</Button>}
      />

      <Alert className="mb-6">
        <AlertTitle>Engine not yet enabled</AlertTitle>
        <AlertDescription>
          Double-entry posting, period locking and the trial balance are implemented in a later
          phase. Nothing shown here affects real records.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="coa">
        <TabsList>
          <TabsTrigger value="coa">Chart of accounts</TabsTrigger>
          <TabsTrigger value="journals">Manual journals</TabsTrigger>
          <TabsTrigger value="ledger">General ledger</TabsTrigger>
          <TabsTrigger value="periods">Periods</TabsTrigger>
        </TabsList>

        <TabsContent value="coa" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coa.map((a) => (
                    <TableRow key={a.code}>
                      <TableCell className="numeric font-medium">{a.code}</TableCell>
                      <TableCell>{a.name}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{a.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journals" className="mt-4">
          <EmptyState
            title="No manual journals"
            description="Balanced debit and credit entries posted by hand will be listed here."
            actionLabel="New manual journal"
          />
        </TabsContent>

        <TabsContent value="ledger" className="mt-4">
          <LoadingState />
        </TabsContent>

        <TabsContent value="periods" className="mt-4">
          <EmptyState
            title="No accounting periods defined"
            description="Financial year and period locking are configured once the engine is live."
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
