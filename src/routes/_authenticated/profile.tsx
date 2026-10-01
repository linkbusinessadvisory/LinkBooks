import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getMyProfile, updateMyProfile } from "@/lib/profile.functions";
import { PageHeader, ErrorState, LoadingState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { friendlyAuthError } from "@/lib/auth-helpers";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — LinkBooks" },
      {
        name: "description",
        content: "View and update your LinkBooks account details and password.",
      },
      { property: "og:title", content: "Your profile — LinkBooks" },
      {
        property: "og:description",
        content: "View and update your LinkBooks account details and password.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const fetchProfile = useServerFn(getMyProfile);
  const saveProfile = useServerFn(updateMyProfile);
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => fetchProfile(),
  });

  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    if (profileQuery.data) {
      setFullName(profileQuery.data.full_name);
      setJobTitle(profileQuery.data.job_title ?? "");
    }
  }, [profileQuery.data]);

  const mutation = useMutation({
    mutationFn: () => saveProfile({ data: { full_name: fullName, job_title: jobTitle } }),
    onSuccess: (data) => {
      queryClient.setQueryData(["my-profile"], data);
      toast.success("Profile updated");
    },
    onError: (error) => toast.error(friendlyAuthError(error)),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your profile"
        description="Your personal account details. Organisation settings arrive in a later phase."
      />

      {profileQuery.isPending ? (
        <LoadingState />
      ) : profileQuery.isError ? (
        <ErrorState
          title="We couldn't load your profile"
          description={friendlyAuthError(profileQuery.error)}
          onRetry={() => profileQuery.refetch()}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account details</CardTitle>
              <CardDescription>This is real account data, not demo data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input id="profile-email" value={profileQuery.data.email} disabled readOnly />
                <p className="text-xs text-muted-foreground">
                  Your email is your sign-in identity and can't be changed in this phase.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full name</Label>
                <Input
                  id="profile-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-role">Job title</Label>
                <Input
                  id="profile-role"
                  value={jobTitle}
                  placeholder="e.g. Finance Manager"
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                {mutation.isPending ? "Saving…" : "Save changes"}
              </Button>
            </CardContent>
          </Card>

          <ChangePasswordCard />
        </div>
      )}
    </div>
  );
}

function ChangePasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (next.length < 8 || !/[A-Za-z]/.test(next) || !/[0-9]/.test(next)) {
      setError("New password must be at least 8 characters and include a letter and a number.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password: next,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...({ current_password: current } as any),
    });
    setBusy(false);
    if (updateError) {
      setError(friendlyAuthError(updateError));
      return;
    }
    setCurrent("");
    setNext("");
    setConfirm("");
    toast.success("Password changed");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Password</CardTitle>
        <CardDescription>Change the password you use to sign in.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {error ? (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="current-password">Current password</Label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="next-password">New password</Label>
            <Input
              id="next-password"
              type="password"
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">Confirm new password</Label>
            <Input
              id="confirm-new-password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            {busy ? "Updating…" : "Change password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
