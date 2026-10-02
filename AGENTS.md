<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Auth: all app pages live under `src/routes/_authenticated/` (client-only session gate, redirects to `/auth?redirect=`); public auth pages are `/auth`, `/forgot-password`, `/reset-password`. Why: the gate is UX only — data access is enforced by `requireSupabaseAuth` server functions plus row-level security.
- Future sign-in providers are registered in `src/lib/auth-helpers.ts` `authProviders`; only enabled ones render. Why: no fake provider buttons until configured.
