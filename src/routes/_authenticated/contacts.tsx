import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/contacts")({
  head: () => ({
    meta: [
      { title: "Contacts — LinkBooks" },
      { name: "description", content: "Customers and suppliers managed in LinkBooks." },
      { property: "og:title", content: "Contacts — LinkBooks" },
      { property: "og:description", content: "Customers and suppliers managed in LinkBooks." },
    ],
  }),
  component: Contacts,
});

const contacts = [
  { name: "Harbour Design Ltd", type: "Customer", email: "ap@harbourdesign.example", owed: "4,250.00" },
  { name: "Kestrel Analytics", type: "Customer", email: "finance@kestrel.example", owed: "9,600.00" },
  { name: "Northwind Supplies", type: "Supplier", email: "billing@northwind.example", owed: "742.60" },
  { name: "Civic Workspace", type: "Supplier", email: "accounts@civic.example", owed: "1,850.00" },
];

function Contacts() {
  return (
    <>
      <PageHeader
        title="Contacts"
        description="A single record for every customer and supplier, shared across sales and purchases."
        actions={<Button size="sm">New contact</Button>}
      />

      <Tabs defaultValue="all">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          </TabsList>
          <Input placeholder="Search contacts" className="sm:max-w-xs" />
        </div>

        {["all", "customers", "suppliers"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts
                      .filter(
                        (c) =>
                          tab === "all" ||
                          (tab === "customers" && c.type === "Customer") ||
                          (tab === "suppliers" && c.type === "Supplier"),
                      )
                      .map((c) => (
                        <TableRow key={c.name}>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{c.type}</Badge>
                          </TableCell>
                          <TableCell className="hidden text-muted-foreground md:table-cell">
                            {c.email}
                          </TableCell>
                          <TableCell className="numeric text-right">{c.owed}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
