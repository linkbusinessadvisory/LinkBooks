import { createFileRoute } from "@tanstack/react-router";
import { Wallet, TrendingUp, FileWarning, Landmark } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/common/states";
import { StatCard } from "@/components/common/stat-card";
import { CompanyEmptyState, NO_FIGURE } from "@/components/common/company-empty";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

function Dashboard() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A summary of the selected company. Figures appear once transactions are posted to its ledger."
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
        <StatCard label="Cash in bank" value={NO_FIGURE} hint="No bank accounts" icon={Wallet} />
        <StatCard label="Money coming in" value={NO_FIGURE} hint="No invoices" icon={TrendingUp} />
        <StatCard label="Money going out" value={NO_FIGURE} hint="No bills" icon={FileWarning} />
        <StatCard
          label="Unreconciled items"
          value={NO_FIGURE}
          hint="No bank transactions"
          icon={Landmark}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
            <CardDescription>Latest sales and purchase documents.</CardDescription>
          </CardHeader>
          <CardContent>
            <CompanyEmptyState
              title="No activity yet"
              description="Invoices, bills and payments will be listed here as they are recorded."
            />
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
