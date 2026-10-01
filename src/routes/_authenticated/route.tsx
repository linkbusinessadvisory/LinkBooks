import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/layout/AppShell";

/**
 * Every LinkBooks application page lives under this gate. The session lives in
 * browser storage, so this subtree opts out of server rendering and checks the
 * session on the client before any child route renders.
 *
 * This gate is the user-experience layer only — data access is enforced
 * server-side by `requireSupabaseAuth` and database row-level security.
 */
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({
        to: "/auth",
        search: { redirect: location.href, mode: "signin" as const },
      });
    }
    return { user: data.user };
  },
  pendingComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
      <span className="sr-only">Loading LinkBooks</span>
    </div>
  ),
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
