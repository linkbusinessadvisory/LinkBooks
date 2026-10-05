// Stale-asset recovery.
//
// When a new deploy replaces the files an open tab is still using, the app
// reloads itself once instead of leaving a blank screen. This module owns the
// status painted across that reload: it appears before the reload starts and
// stays up until the fresh version has finished rendering.
//
// The status is plain DOM with its own inline styles rather than a React
// component, because it has to survive a broken component tree and a missing
// stylesheet — the two things that cause the failure it is describing.

import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";

const RELOAD_KEY = "lb-chunk-reload";
const PENDING_KEY = "lb-chunk-reload-pending";
const RELOAD_COOLDOWN_MS = 10_000;
const RELOAD_DELAY_MS = 500;
const MIN_VISIBLE_MS = 450;
const MAX_VISIBLE_MS = 12_000;
const POLL_MS = 120;
const OVERLAY_ID = "lb-recovery";
const STYLE_ID = "lb-recovery-style";

type RecoveryVariant = "reloading" | "recovering";

const COPY: Record<RecoveryVariant, { title: string; body: string }> = {
  reloading: {
    title: "Updating to the latest version",
    body: "LinkBooks was just updated. This page is reloading — it only takes a moment.",
  },
  recovering: {
    title: "Loading the latest version",
    body: "Almost there. LinkBooks is finishing the update.",
  },
};

// Set as soon as a reload is queued: the recovery overlay is then owned by the
// reload, and the post-reload poller must stop touching it.
let reloadScheduled = false;

const RECOVERY_STYLE = `
#${OVERLAY_ID}{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:24px;background:var(--background, oklch(0.985 0.003 250));color:var(--foreground, oklch(0.23 0.03 250));font-family:"IBM Plex Sans",ui-sans-serif,system-ui,sans-serif;opacity:1;transition:opacity .2s ease}
#${OVERLAY_ID}[data-lb-hidden="1"]{opacity:0}
#${OVERLAY_ID} .lb-recovery-stack{display:flex;flex-direction:column;align-items:center;text-align:center;gap:14px;max-width:360px}
#${OVERLAY_ID} .lb-recovery-mark{width:40px;height:40px;border-radius:10px;background:var(--primary, oklch(0.32 0.06 252));color:var(--primary-foreground, oklch(0.985 0.005 250));display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;letter-spacing:.02em}
#${OVERLAY_ID} .lb-recovery-spinner{width:26px;height:26px;border-radius:50%;border:3px solid var(--border, oklch(0.905 0.01 250));border-top-color:var(--accent, oklch(0.6 0.1 190));animation:lb-recovery-spin .8s linear infinite}
#${OVERLAY_ID} h1{margin:0;font-size:17px;font-weight:600;letter-spacing:-.01em}
#${OVERLAY_ID} p{margin:0;font-size:14px;line-height:1.5;color:var(--muted-foreground, oklch(0.52 0.025 252))}
@keyframes lb-recovery-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){#${OVERLAY_ID} .lb-recovery-spinner{animation-duration:2s}}
`;

const RECOVERY_MARKUP = `
<div class="lb-recovery-stack">
  <div class="lb-recovery-mark" aria-hidden="true">LB</div>
  <div class="lb-recovery-spinner" aria-hidden="true"></div>
  <h1 data-lb-recovery-title></h1>
  <p data-lb-recovery-body></p>
</div>
`;

function ensureRecoveryStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = RECOVERY_STYLE;
  document.head.appendChild(style);
}

export function showRecoveryStatus(variant: RecoveryVariant) {
  if (typeof document === "undefined") return;
  ensureRecoveryStyle();

  let overlay = document.getElementById(OVERLAY_ID);
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-live", "polite");
    overlay.innerHTML = RECOVERY_MARKUP;
    document.body.appendChild(overlay);
  }

  overlay.dataset["lbHidden"] = "0";
  const copy = COPY[variant];
  const title = overlay.querySelector("[data-lb-recovery-title]");
  const body = overlay.querySelector("[data-lb-recovery-body]");
  if (title) title.textContent = copy.title;
  if (body) body.textContent = copy.body;
}

export function hideRecoveryStatus() {
  if (typeof document === "undefined") return;
  const overlay = document.getElementById(OVERLAY_ID);
  if (!overlay || overlay.dataset["lbHidden"] === "1") return;
  overlay.dataset["lbHidden"] = "1";
  // Only remove if nothing re-claimed the overlay in the meantime.
  window.setTimeout(() => {
    if (overlay?.dataset["lbHidden"] === "1") overlay.remove();
  }, 220);
}

export function isStaleChunkError(error: unknown) {
  const msg = error instanceof Error ? error.message : String(error ?? "");
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(
    msg,
  );
}

function readReloadStamp(): number {
  try {
    return Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
  } catch {
    return 0;
  }
}

/**
 * Reloads the page once to pick up a replaced build, showing the recovery
 * status first. Returns false when the cooldown says we already tried, so the
 * caller falls back to its normal error UI instead of looping.
 */
export function reloadOnceForStaleChunk(): boolean {
  if (typeof window === "undefined") return false;
  if (Date.now() - readReloadStamp() < RELOAD_COOLDOWN_MS) return false;

  try {
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    sessionStorage.setItem(PENDING_KEY, "1");
  } catch {
    // Storage unavailable: still reload, just without the cross-reload status.
  }

  reloadScheduled = true;
  showRecoveryStatus("reloading");
  window.setTimeout(() => window.location.reload(), RELOAD_DELAY_MS);
  return true;
}

function consumeRecoveryPending(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  try {
    const pending = sessionStorage.getItem(PENDING_KEY) === "1";
    if (pending) sessionStorage.removeItem(PENDING_KEY);
    return pending;
  } catch {
    return false;
  }
}

/**
 * Keeps the recovery status visible after the automatic reload until the
 * freshly loaded app has actually rendered. Mounted once in the root route.
 */
export function useRecoveryStatus() {
  const router = useRouter();
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    if (!consumeRecoveryPending()) return;
    showRecoveryStatus("recovering");
    setRecovering(true);
  }, []);

  useEffect(() => {
    if (!recovering) return;
    const started = Date.now();
    const timer = window.setInterval(() => {
      if (reloadScheduled) {
        window.clearInterval(timer);
        return;
      }
      const settled = router.state.status === "idle" && !router.state.isLoading;
      const held = Date.now() - started;
      if ((settled && held >= MIN_VISIBLE_MS) || held >= MAX_VISIBLE_MS) {
        window.clearInterval(timer);
        hideRecoveryStatus();
        setRecovering(false);
      }
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [recovering, router]);
}
