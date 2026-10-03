# LinkBooks roadmap

## Phase 2 — Company / tenant architecture
- [ ] Database: companies, company_members, company_invitations, company_tax_settings, role_permissions, profiles.last_company_id
- [ ] Security helpers + RLS; create_company function; last-owner protection
- [ ] Demo Company as a normal company (is_demo = true) via the same tables/rules — per-user, created on demand
- [ ] Server functions: list/active/switch/create/update company, list members
- [ ] Company switcher in top bar (real companies + Demo Company)
- [ ] Onboarding: create company screen for users with no company
- [ ] Settings Organisation / Financial / Users tabs read real company
- [ ] Test isolation with two users, switching, onboarding, demo
- [ ] Report and STOP before Phase 3
