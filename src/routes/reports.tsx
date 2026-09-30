import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/common/states";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — LinkBooks" },
      {
        name: "description",
        content: "Profit & loss, balance sheet, trial balance and aged reports in LinkBooks.",
      },
      { property: "og:title", content: "Reports — LinkBooks" },
      {
        property: "og:description",
        content: "Profit & loss, balance sheet, trial balance and aged reports in LinkBooks.",
      },
    ],
  }),
  component: Reports,
});

const reports = [
  { name: "Profit & Loss", desc: "Income and expenses for a period" },
  { name: "Balance Sheet", desc: "Assets, liabilities and equity at a date" },
  { name: "Trial Balance", desc: "Debit and credit totals per account" },
  { name: "General Ledger", desc: "Every posted journal line by account" },
  { name: "Aged Receivables", desc: "Outstanding customer balances by age" },
  { name: "Aged Payables", desc: "Outstanding supplier balances by age" },
  { name: "Cash Summary", desc: "Cash movement across bank accounts" },
  { name: "Tax Summary", desc: "Tax collected and paid for a period" },
];

function Reports() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Financial statements generated from the ledger. Report output becomes live once the accounting engine is enabled."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.name} className="transition-shadow hover:shadow-raised">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary text-secondary-foreground">
                  <FileText className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base">{r.name}</CardTitle>
                  <CardDescription>{r.desc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link to="/accounting" className="text-sm font-medium text-accent hover:underline">
                View source accounts
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
