import { createFileRoute } from "@tanstack/react-router";
import { Landmark } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/common/states";
import { StatCard } from "@/components/common/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/banking")({
  head: () => ({
    meta: [
      { title: "Banking — LinkBooks" },
      {
        name: "description",
        content: "Bank accounts, transaction feeds and reconciliation in LinkBooks.",
      },
      { property: "og:title", content: "Banking — LinkBooks" },
      {
        property: "og:description",
        content: "Bank accounts, transaction feeds and reconciliation in LinkBooks.",
      },
    ],
  }),
  component: Banking,
});

function Banking() {
  return (
    <>
      <PageHeader
        title="Banking"
        description="Bank accounts, statement lines and reconciliation. Live bank feeds arrive in a later phase."
        actions={<Button size="sm">Add bank account</Button>}
      />

      <CompanyEmptyState
        icon={Landmark}
        title="No bank accounts"
        description="Bank accounts and their ledger balances will appear here once added."
        actionLabel="Add bank account"
      />

      <Tabs defaultValue="reconcile" className="mt-6">
        <TabsList>
          <TabsTrigger value="reconcile">Reconcile</TabsTrigger>
          <TabsTrigger value="statements">Statements</TabsTrigger>
          <TabsTrigger value="rules">Bank rules</TabsTrigger>
        </TabsList>
        <TabsContent value="reconcile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reconciliation</CardTitle>
              <CardDescription>Match statement lines against ledger entries.</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="Reconciliation not enabled yet"
                description="Statement matching becomes available once the banking module is built."
                actionLabel="Import a statement"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="statements" className="mt-4">
          <EmptyState
            title="No statements imported"
            description="Upload a CSV statement to review transaction lines."
            actionLabel="Import CSV"
          />
        </TabsContent>
        <TabsContent value="rules" className="mt-4">
          <EmptyState
            title="No bank rules"
            description="Rules automatically suggest accounts and tax codes for repeating transactions."
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
