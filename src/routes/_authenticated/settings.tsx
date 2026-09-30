import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — LinkBooks" },
      {
        name: "description",
        content: "Organisation details, financial settings, users and notifications.",
      },
      { property: "og:title", content: "Settings — LinkBooks" },
      {
        property: "og:description",
        content: "Organisation details, financial settings, users and notifications.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Organisation profile, financial defaults, users and notification preferences."
      />

      <Tabs defaultValue="organisation">
        <TabsList>
          <TabsTrigger value="organisation">Organisation</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="organisation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organisation details</CardTitle>
              <CardDescription>Shown on invoices and reports.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organisation name</Label>
                <Input id="org-name" defaultValue="Demo Company Ltd" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-country">Country</Label>
                <Select defaultValue="gb">
                  <SelectTrigger id="org-country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="gb">United Kingdom</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="nz">New Zealand</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="in">India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Button size="sm" onClick={() => toast.success("Settings saved (demo only)")}>
                  Save changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Financial settings</CardTitle>
              <CardDescription>Base currency and financial year.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Base currency</Label>
                <Input id="currency" defaultValue="GBP" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fy">Financial year end</Label>
                <Input id="fy" defaultValue="31 March" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Users and roles</CardTitle>
              <CardDescription>Invitations are enabled with authentication.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Owner, Accountant, Bookkeeper and Viewer roles will be managed here.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              {["Invoice paid", "Bill due soon", "Unreconciled items weekly digest"].map((n) => (
                <div key={n} className="flex items-center justify-between gap-4">
                  <Label className="font-normal">{n}</Label>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
