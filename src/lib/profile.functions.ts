import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  job_title: string | null;
  created_at: string;
};

/**
 * Server-enforced read of the signed-in user's own profile.
 * The bearer token is validated server-side; row-level security scopes the row.
 */
export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Profile> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, job_title, created_at")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Profile not found");
    return data as Profile;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { full_name: string; job_title: string }) => {
    const full_name = input.full_name?.trim() ?? "";
    if (full_name.length < 2) throw new Error("Please enter your full name.");
    if (full_name.length > 120) throw new Error("Name is too long.");
    const job_title = (input.job_title ?? "").trim().slice(0, 120);
    return { full_name, job_title };
  })
  .handler(async ({ data, context }): Promise<Profile> => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("profiles")
      .update({ full_name: data.full_name, job_title: data.job_title || null })
      .eq("id", userId)
      .select("id, full_name, email, job_title, created_at")
      .single();

    if (error) throw new Error(error.message);
    return row as Profile;
  });
