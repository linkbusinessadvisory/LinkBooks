import type { ReactNode } from "react";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string | undefined;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-sidebar p-10 lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-md bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            LB
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-sidebar-accent-foreground">LinkBooks</div>
            <div className="text-[11px] text-sidebar-foreground/70">Cloud accounting</div>
          </div>
        </div>

        <div className="max-w-sm space-y-4">
          <h2 className="text-2xl font-semibold leading-snug text-sidebar-accent-foreground">
            Accounting records you can trust.
          </h2>
          <p className="text-sm leading-relaxed text-sidebar-foreground/75">
            Double-entry bookkeeping, bank reconciliation and financial reporting for small
            businesses and their accountants.
          </p>
        </div>

        <p className="text-[11px] text-sidebar-foreground/60">
          Phase 1 — authentication. Accounting features arrive in later phases.
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="grid size-9 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              LB
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">LinkBooks</div>
              <div className="text-[11px] text-muted-foreground">Cloud accounting</div>
            </div>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}

          <div className="mt-7">{children}</div>

          {footer ? <div className="mt-6 text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
