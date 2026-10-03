CREATE OR REPLACE FUNCTION public.shares_company_with(_other UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_members me
    JOIN public.company_members them ON them.company_id = me.company_id
    WHERE me.user_id = auth.uid() AND me.status = 'active' AND them.user_id = _other
  )
$$;
REVOKE ALL ON FUNCTION public.shares_company_with(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.shares_company_with(UUID) TO authenticated;

CREATE POLICY "Members can view profiles of fellow company members"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.shares_company_with(id));