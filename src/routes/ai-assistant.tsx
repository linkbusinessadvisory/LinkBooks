import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — LinkBooks" },
      {
        name: "description",
        content: "Accounting guidance and review suggestions, always subject to user approval.",
      },
      { property: "og:title", content: "AI Assistant — LinkBooks" },
      {
        property: "og:description",
        content: "Accounting guidance and review suggestions, always subject to user approval.",
      },
    ],
  }),
  component: AiAssistant,
});

function AiAssistant() {
  return (
    <>
      <PageHeader
        title="AI Assistant"
        description="Ask questions about the books and get suggestions. The assistant never posts to the ledger without explicit approval."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Ask the assistant</CardTitle>
            <CardDescription>Not connected yet — enabled in a later phase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
              <Sparkles className="mx-auto mb-2 size-5" />
              Conversations will appear here.
            </div>
            <Textarea placeholder="e.g. Which invoices are overdue by more than 30 days?" rows={3} />
            <div className="flex justify-end">
              <Button size="sm" onClick={() => toast("The assistant is not connected yet.")}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-success" />
              <CardTitle className="text-base">Safety rules</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Suggestions only — no automatic posting.</p>
            <p>Every proposed entry is shown in full before approval.</p>
            <p>All accepted actions are written to the audit trail.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
