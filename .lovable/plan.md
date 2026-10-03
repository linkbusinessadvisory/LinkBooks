# LinkBooks Phase 2: Company / Tenant Architecture (review before building)

## 1. Current architecture (what exists today)

- **Sign-in accounts:** handled by the built-in account system (email + password). Email confirmation is off, leaked-password check is on, and changing a password while signed in needs the current one.
- **Profiles:** one `profiles` row per user (full name, email, job title), created automatically at sign-up. Users can view, add and edit only their own row. Nobody can delete a profile. A helper function that runs only at sign-up creates it, and users cannot call it.
- **Relationships:** `profiles.id` points to the user account and is removed when the account is deleted. There are no other tables.
- **Page protection:** all 11 app pages plus Profile sit behind a sign-in check in the browser. Real data is read through server functions that verify the sign-in token, plus database row rules.
- **Demo data:** every figure (dashboard, banking, sales, the "Demo Company Ltd / Northgate Consulting" switcher, settings defaults) is hard-coded in the page code. None of it is stored in the database, so it cannot leak into real companies.

## 2. Proposed architecture

```text
User (account) ── profile
   │
   └── company_members (role, status) ──► companies ──► company_settings
                                             │              (tax foundation)
                                             ├── company_invitations
                                             ├── (future) accounting tables, all with company_id
                                             └── (future) firm_clients ◄── firms (accounting firms)
```

Every future accounting table will carry a required `company_id`, and access to it is checked through membership. A user can belong to any number of companies.

## 3. Tables to add (no accounting tables)

| Table | Purpose / key fields |
|---|---|
| `companies` | name, legal_name, country_code (ISO), base_currency (ISO 4217), fiscal_year_end_month, fiscal_year_end_day, timezone (IANA), is_demo (always false for real companies), created_by, archived_at |
| `company_members` | company_id, user_id, role, status (active / invited / suspended), unique per company+user |
| `company_invitations` | company_id, email, role, token hash, expires_at, accepted_at, invited_by. The table is only prepared; no invitation emails are sent in this phase |
| `company_tax_settings` | company_id, tax_regime (e.g. VAT / GST / sales tax / none), registration_number, prices_include_tax, filing_frequency. This is a foundation only, with no country rules hard-coded |
| `role_permissions` | role, permission key (e.g. `company.settings.edit`, `members.manage`). Seeded with a small starter set so detailed permissions can be added later without changing the schema |
| `profiles` (changed) | add `last_company_id` (remembers the user's selected company) |

Roles (fixed list): `owner`, `admin`, `accountant`, `bookkeeper`, `staff`, `read_only`.

**Future-only, designed for but not created now:** `firms`, `firm_members`, `firm_client_links` (firm to company, with an access level), `subscriptions` (linked to company or firm). These can be added on top of the tables above without rebuilding anything.

## 4. Relationships

- companies 1─N company_members N─1 users
- companies 1─1 company_tax_settings
- companies 1─N company_invitations
- profiles.last_company_id → companies (cleared if that access is removed)
- All future accounting data → companies.company_id (required, removed or blocked together with the company)

## 5. Security approach (enforced in the database)

- Row rules are switched on for every new table. Access is granted only to signed-in users, never to signed-out visitors.
- Protected helper functions (they bypass row rules safely, so the rules don't loop back on themselves):
  - `is_company_member(company_id)`: is the current user an active member?
  - `has_company_role(company_id, roles[])`: does the user hold one of these roles?
  - `has_company_permission(company_id, permission)`: for later detailed checks.
- `companies` / `company_tax_settings`: members can view; owners and admins can edit; nobody can delete (companies are archived instead).
- `company_members`: members can see the other members of their company; only owners and admins can add, change or remove members; nobody can make themselves owner; the last owner cannot be removed.
- **Company creation** runs through one protected database function, `create_company(...)`. It creates the company, its tax settings and the creator's **owner** membership in one step. This stops anyone inserting themselves into another company.
- Server functions verify the sign-in token and run as that user, so the database rules always apply. Changing a company ID in a URL or request returns nothing.

## 6. Company switching

- The selected company is held in the app (carried across the protected pages and stored in `profiles.last_company_id`). It is **always** checked against membership on the server, never trusted from the browser.
- Switching companies saves the new choice, wipes all cached data from the old company, and reloads the pages, so data from the previous company is never shown.
- The existing organisation dropdown in the top bar becomes the real company switcher (same look). It gets "Create company" and a separate **Demo Company** entry.
- **New-user flow:** a user with no company sees a short **Create company** screen (name, country, currency, financial year end, time zone). They can choose "Explore demo company" instead.

## 7. Roles and membership

- Each membership has one role, as a per-company setting (a user can be Owner of Company A and Accountant at Company B).
- A role → permission table sits behind the roles, so detailed permissions can be added later as new rows.
- Accountant/bookkeeper access is simply a membership with that role. Firm access will later work through `firm_client_links` that grant memberships, without changing the table structure.

## 8. Minimum screens

- Company switcher in the existing top bar (no redesign).
- `/onboarding/company`: the create-company form.
- Settings → Organisation, Financial and Users tabs switch from demo values to the real company. Members are listed read-only with their roles; inviting people is a later step.
- **Demo mode** stays purely in the page code with the existing "Demo data" badge, and is marked as a demo in the app's state. It is never saved as a company.

## 9. How this prepares the accounting engine

- Every ledger, account, journal, invoice and bank table will have `company_id` and reuse the same `is_company_member` / `has_company_role` rules. Isolation comes built in.
- Base currency, financial year end, time zone and tax regime live on the company, so posting, period closing and tax logic can read them without assuming a country.

## 10. Migration risks

- **Existing users** have no company. After the change they land on Create company or the Demo company; no data is lost (only profiles exist today).
- **Rules that loop back on themselves** if membership checks are written directly inside the rules. Avoided by using the protected helper functions.
- **Losing the last owner**: blocked by a database check.
- **Demo/real confusion**: demo data is never stored in the database, and `is_demo` is fixed to false for real companies.
- **The stored "last company" going stale** after access is removed: the server re-checks membership and falls back to another company or the Create company screen.
- **Inserting rows directly into companies or members** is blocked; only `create_company` can create one, which prevents someone making themselves owner of another company.

## Technical details

- Server functions: `listMyCompanies`, `getActiveCompany`, `setActiveCompany`, `createCompany`, `updateCompany`, `listCompanyMembers`, all with the sign-in token check.
- Active company in the protected pages: resolved from `last_company_id` after a membership check, provided to pages, with company-specific queries keyed by `companyId`.
- Country, currency and time-zone choices come from a static list in the code (the 6 launch markets first, then the full ISO/IANA lists).
- Testing: two test users and two companies. Confirm user B cannot read company A by changing IDs or by calling the server functions directly, and test switching, onboarding and demo mode.
