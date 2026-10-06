import { queryOptions, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getCompanyContext, type CompanySummary } from "@/lib/company.functions";

export const companyContextKey = ["company-context"] as const;

/**
 * The signed-in user's companies and the active one, resolved server-side
 * (membership rows filtered by row-level security). Every company-scoped
 * screen reads the active company from here — never from local state.
 */
export function useActiveCompany() {
  const fetchContext = useServerFn(getCompanyContext);
  const query = useQuery(
    queryOptions({ queryKey: companyContextKey, queryFn: () => fetchContext() }),
  );
  const company: CompanySummary | null =
    query.data?.companies.find((c) => c.id === query.data?.activeCompanyId) ?? null;
  return { ...query, company };
}
