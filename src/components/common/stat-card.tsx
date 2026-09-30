import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: "neutral" | "positive" | "negative" | "warning";
}) {
  const toneClass = {
    neutral: "text-foreground",
    positive: "text-success",
    negative: "text-destructive",
    warning: "text-warning",
  }[tone];

  return (
    <Card className="shadow-none">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
        </div>
        <div className={cn("numeric mt-3 text-2xl font-semibold", toneClass)}>{value}</div>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

export function StatusBadge({
  status,
}: {
  status: "Draft" | "Awaiting payment" | "Paid" | "Overdue" | "Reconciled" | "Unreconciled";
}) {
  const map: Record<string, string> = {
    Draft: "bg-secondary text-secondary-foreground",
    "Awaiting payment": "bg-info/10 text-info",
    Paid: "bg-success/10 text-success",
    Overdue: "bg-destructive/10 text-destructive",
    Reconciled: "bg-success/10 text-success",
    Unreconciled: "bg-warning/15 text-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        map[status],
      )}
    >
      {status}
    </span>
  );
}
