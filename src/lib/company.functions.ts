import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { CompanyRole } from "@/lib/company-constants";

export type CompanySummary = {
  id: string;
  name: string;
  legal_name: string | null;
  country_code: string;
  base_currency: string;
  fiscal_year_end_month: number;
  fiscal_year_end_day: number;
  timezone: string;
  is_demo: boolean;
  archived_at: string | null;
  role: CompanyRole;
};

export type CompanyContext = {
  companies: CompanySummary[];
  activeCompanyId: string | null;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertUuid(value: unknown, label = "company"): string {
  if (typeof value !== "string" || !UUID_RE.test(value)) throw new Error(`Invalid ${label} id`);
  return value;
}

/**
 * Companies the signed-in user is an active member of, plus the resolved
 * active company. Row-level security returns only the caller's companies.
 */
export const getCompanyContext = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CompanyContext> => {
    const { supabase, userId } = context;

    const { data: memberships, error } = await supabase
      .from("company_members")
      .select(
        "role, companies!inner(id, name, legal_name, country_code, base_currency, fiscal_year_end_month, fiscal_year_end_day, timezone, is_demo, archived_at)",
      )
      .eq("user_id", userId)
      .eq("status", "active");
    if (error) throw new Error(error.message);

    const companies: CompanySummary[] = (memberships ?? [])
      .map((m) => ({ ...(m.companies as Omit<CompanySummary, "role">), role: m.role as CompanyRole }))
      .filter((c) => !c.archived_at)
      .sort((a, b) => Number(a.is_demo) - Number(b.is_demo) || a.name.localeCompare(b.name));

    const { data: profile } = await supabase
      .from("profiles")
      .select("last_company_id")
      .eq("id", userId)
      .maybeSingle();

    const remembered = profile?.last_company_id ?? null;
    const active =
      companies.find((c) => c.id === remembered) ??
      companies.find((c) => !c.is_demo) ??
      companies[0] ??
      null;

    return { companies, activeCompanyId: active?.id ?? null };
  });

export const setActiveCompany = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { companyId: string }) => ({ companyId: assertUuid(input?.companyId) }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Database trigger rejects companies the caller is not a member of.
    const { error } = await supabase
      .from("profiles")
      .update({ last_company_id: data.companyId })
      .eq("id", userId);
    if (error) throw new Error("You do not have access to that company.");
    return { ok: true };
  });

export type CreateCompanyInput = {
  name: string;
  legal_name?: string;
  country_code: string;
  base_currency: string;
  fiscal_year_end_month: number;
  fiscal_year_end_day: number;
  timezone: string;
};

function validateCompanyInput(input: CreateCompanyInput): CreateCompanyInput {
  const name = (input?.name ?? "").trim();
  if (name.length < 2 || name.length > 160) throw new Error("Enter a company name (2–160 characters).");
  const country_code = (input.country_code ?? "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(country_code)) throw new Error("Choose a country.");
  const base_currency = (input.base_currency ?? "").toUpperCase();
  if (!/^[A-Z]{3}$/.test(base_currency)) throw new Error("Choose a base currency.");
  const m = Number(input.fiscal_year_end_month);
  const d = Number(input.fiscal_year_end_day);
  if (!Number.isInteger(m) || m < 1 || m > 12) throw new Error("Choose a financial year end month.");
  const maxDay = new Date(2023, m, 0).getDate();
  if (!Number.isInteger(d) || d < 1 || d > maxDay) throw new Error("Choose a valid financial year end day.");
  const timezone = (input.timezone ?? "").trim();
  if (!timezone || timezone.length > 64) throw new Error("Choose a time zone.");
  const legal_name = (input.legal_name ?? "").trim().slice(0, 200);
  return { name, legal_name, country_code, base_currency, fiscal_year_end_month: m, fiscal_year_end_day: d, timezone };
}

export const createCompany = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(validateCompanyInput)
  .handler(async ({ data, context }) => {
    const { data: id, error } = await context.supabase.rpc("create_company", {
      _name: data.name,
      _country_code: data.country_code,
      _base_currency: data.base_currency,
      _fy_end_month: data.fiscal_year_end_month,
      _fy_end_day: data.fiscal_year_end_day,
      _timezone: data.timezone,
      _legal_name: data.legal_name ?? "",
    });
    if (error) throw new Error(error.message);
    return { id: id as string };
  });

export const openDemoCompany = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: id, error } = await context.supabase.rpc("create_demo_company");
    if (error) throw new Error(error.message);
    return { id: id as string };
  });

export type CompanyDetails = CompanySummary & {
  tax: {
    tax_regime: string;
    registration_number: string | null;
    prices_include_tax: boolean;
    filing_frequency: string | null;
  } | null;
};

export const getCompanyDetails = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { companyId: string }) => ({ companyId: assertUuid(input?.companyId) }))
  .handler(async ({ data, context }): Promise<CompanyDetails> => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("companies")
      .select(
        "id, name, legal_name, country_code, base_currency, fiscal_year_end_month, fiscal_year_end_day, timezone, is_demo, archived_at, company_tax_settings(tax_regime, registration_number, prices_include_tax, filing_frequency)",
      )
      .eq("id", data.companyId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Company not found or you do not have access.");

    const { data: me } = await supabase
      .from("company_members")
      .select("role")
      .eq("company_id", data.companyId)
      .eq("user_id", userId)
      .maybeSingle();

    const { company_tax_settings, ...rest } = row as typeof row & {
      company_tax_settings: CompanyDetails["tax"] | CompanyDetails["tax"][];
    };
    const tax = Array.isArray(company_tax_settings) ? (company_tax_settings[0] ?? null) : company_tax_settings;
    return { ...(rest as Omit<CompanySummary, "role">), role: (me?.role ?? "read_only") as CompanyRole, tax };
  });

export const updateCompany = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: CreateCompanyInput & { companyId: string; tax_regime: string; registration_number: string; prices_include_tax: boolean }) => {
      const base = validateCompanyInput(input);
      const tax_regime = ["none", "vat", "gst", "sales_tax", "other"].includes(input.tax_regime) ? input.tax_regime : "none";
      return {
        ...base,
        companyId: assertUuid(input.companyId),
        tax_regime,
        registration_number: (input.registration_number ?? "").trim().slice(0, 60),
        prices_include_tax: Boolean(input.prices_include_tax),
      };
    },
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: updated, error } = await supabase
      .from("companies")
      .update({
        name: data.name,
        legal_name: data.legal_name || null,
        country_code: data.country_code,
        base_currency: data.base_currency,
        fiscal_year_end_month: data.fiscal_year_end_month,
        fiscal_year_end_day: data.fiscal_year_end_day,
        timezone: data.timezone,
      })
      .eq("id", data.companyId)
      .select("id");
    if (error) throw new Error(error.message);
    if (!updated || updated.length === 0) {
      throw new Error("Only owners and administrators can change company settings.");
    }

    const { error: taxError } = await supabase
      .from("company_tax_settings")
      .update({
        tax_regime: data.tax_regime,
        registration_number: data.registration_number || null,
        prices_include_tax: data.prices_include_tax,
      })
      .eq("company_id", data.companyId);
    if (taxError) throw new Error(taxError.message);
    return { ok: true };
  });

export type CompanyMember = {
  user_id: string;
  role: CompanyRole;
  status: string;
  full_name: string;
  email: string;
  is_you: boolean;
};

export const listCompanyMembers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { companyId: string }) => ({ companyId: assertUuid(input?.companyId) }))
  .handler(async ({ data, context }): Promise<CompanyMember[]> => {
    const { supabase, userId } = context;
    const { data: rows, error } = await supabase
      .from("company_members")
      .select("user_id, role, status")
      .eq("company_id", data.companyId)
      .order("created_at");
    if (error) throw new Error(error.message);
    const ids = (rows ?? []).map((r) => r.user_id);
    const { data: profiles } = ids.length
      ? await supabase.from("profiles").select("id, full_name, email").in("id", ids)
      : { data: [] as { id: string; full_name: string; email: string }[] };
    const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
    return (rows ?? []).map((r) => ({
      user_id: r.user_id,
      role: r.role as CompanyRole,
      status: r.status,
      full_name: byId.get(r.user_id)?.full_name ?? "",
      email: byId.get(r.user_id)?.email ?? "",
      is_you: r.user_id === userId,
    }));
  });
