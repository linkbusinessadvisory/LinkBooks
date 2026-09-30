import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const items = [
  { code: "CONS-STD", name: "Consulting — standard rate", type: "Service", account: "4000 Sales", price: "120.00" },
  { code: "CONS-PRJ", name: "Project delivery", type: "Service", account: "4000 Sales", price: "1,500.00" },
  { code: "SUP-PRT", name: "Printed materials", type: "Product", account: "4100 Other income", price: "35.00" },
];

function Items() {
  return (
    <>
      <PageHeader
        title="Products & Services"
        description="Items you sell or buy, each with a default ledger account and tax treatment."
        actions={<Button size="sm">New item</Button>}
      />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Default account</TableHead>
                <TableHead className="text-right">Unit price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((i) => (
                <TableRow key={i.code}>
                  <TableCell className="numeric font-medium">{i.code}</TableCell>
                  <TableCell>{i.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="secondary">{i.type}</Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {i.account}
                  </TableCell>
                  <TableCell className="numeric text-right">{i.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
