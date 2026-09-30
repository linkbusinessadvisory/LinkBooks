import { createFileRoute } from "@tanstack/react-router";
import { Wallet, TrendingUp, FileWarning, Landmark } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/common/states";
import { StatCard, StatusBadge } from "@/components/common/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Dashboard — LinkBooks" },
      {
        name: "description",
        content: "Cash position, receivables, payables and recent activity in LinkBooks.",
      },
      { property: "og:title", content: "Dashboard — LinkBooks" },
      {
        property: "og:description",
        content: "Cash position, receivables, payables and recent activity in LinkBooks.",
      },
    ],
  }),
  component: Dashboard,
});

const activity = [
  { ref: "INV-1042", party: "Harbour Design Ltd", date: "28 Sep 2026", amount: "4,250.00" },
  { ref: "INV-1041", party: "Stonebridge Media", date: "26 Sep 2026", amount: "1,180.00" },
  { ref: "BILL-318", party: "Northwind Supplies", date: "24 Sep 2026", amount: "742.60" },
  { ref: "INV-1040", party: "Kestrel Analytics", date: "21 Sep 2026", amount: "9,600.00" },
] as const;

const statuses = ["Awaiting payment", "Paid", "Overdue", "Paid"] as const;

function Dashboard() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A summary view of the organisation. Figures shown are demo placeholders until the accounting engine is enabled."
        actions={
          <>
            <Button variant="outline" size="sm">
              This month
            </Button>
            <Button size="sm">New invoice</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Cash in bank" value="82,415.20" hint="3 accounts" icon={Wallet} />
        <StatCard
          label="Money coming in"
          value="18,940.00"
          hint="9 unpaid invoices"
          icon={TrendingUp}
          tone="positive"
        />
        <StatCard
          label="Money going out"
          value="6,318.75"
          hint="4 bills due"
          icon={FileWarning}
          tone="warning"
        />
        <StatCard label="Unreconciled items" value="27" hint="Across 3 accounts" icon={Landmark} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
            <CardDescription>Latest sales and purchase documents.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activity.map((row, i) => (
                  <TableRow key={row.ref}>
                    <TableCell className="font-medium">{row.ref}</TableCell>
                    <TableCell className="text-muted-foreground">{row.party}</TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {row.date}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={statuses[i] ?? "Draft"} />
                    </TableCell>
                    <TableCell className="numeric text-right">{row.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Period close</CardTitle>
            <CardDescription>Nothing to review yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="No open tasks"
              description="Close checklists appear here once accounting periods are enabled."
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
