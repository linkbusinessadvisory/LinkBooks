import { createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { PageHeader } from "@/components/common/states";
import { CompanyEmptyState } from "@/components/common/company-empty";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/products-services")({
  head: () => ({
    meta: [
      { title: "Products & Services — LinkBooks" },
      {
        name: "description",
        content: "Reusable items with default accounts and tax rates for invoices and bills.",
      },
      { property: "og:title", content: "Products & Services — LinkBooks" },
      {
        property: "og:description",
        content: "Reusable items with default accounts and tax rates for invoices and bills.",
      },
    ],
  }),
  component: Items,
});

function Items() {
  return (
    <>
      <PageHeader
        title="Products & Services"
        description="Items you sell or buy, each with a default ledger account and tax treatment."
        actions={<Button size="sm">New item</Button>}
      />
      <CompanyEmptyState
        icon={Package}
        title="No products or services"
        description="Items with their default account, tax treatment and price will be listed here once added."
        actionLabel="New item"
      />
    </>
  );
}
