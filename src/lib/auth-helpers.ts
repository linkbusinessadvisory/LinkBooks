/**
 * Shared, provider-agnostic authentication helpers.
 *
 * Phase 1 ships email + password only. The shapes below exist so additional
 * identity providers (Google, Microsoft, and any other OAuth 2.0 / OpenID
 * Connect issuer) can be added later without reworking the screens. No
 * provider is advertised in the UI until it is genuinely configured.
 */

export type AuthProviderId = "password" | "google" | "microsoft";

export type AuthProviderDescriptor = {
  id: AuthProviderId;
  label: string;
  /** Only configured providers are rendered. */
  enabled: boolean;
};

/** Enabled sign-in methods for this deployment. */
export const authProviders: AuthProviderDescriptor[] = [
  { id: "password", label: "Email and password", enabled: true },
  { id: "google", label: "Google", enabled: false },
  { id: "microsoft", label: "Microsoft", enabled: false },
];

export const enabledSocialProviders = authProviders.filter(
  (p) => p.enabled && p.id !== "password",
);

/** Only allow same-origin relative paths as post-login destinations. */
export function safeRedirect(value: unknown, fallback = "/"): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

const messages: Record<string, string> = {
  "invalid login credentials": "That email and password combination isn't right.",
  "email not confirmed": "Please confirm your email address before signing in.",
  "user already registered": "An account with this email already exists. Try signing in.",
  "password should be at least 8 characters":
    "Your password must be at least 8 characters long.",
};

/** Turn provider errors into plain language without leaking internals. */
export function friendlyAuthError(error: unknown): string {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Something went wrong.";
  const key = raw.toLowerCase().trim();
  for (const [needle, friendly] of Object.entries(messages)) {
    if (key.includes(needle)) return friendly;
  }
  if (key.includes("pwned") || key.includes("compromised")) {
    return "That password has appeared in a known data breach. Please choose another.";
  }
  if (key.includes("rate limit") || key.includes("too many")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  return raw;
}

export type FieldErrors = Record<string, string>;

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must include at least one letter and one number.";
  }
  return null;
}

export function initialsFrom(name: string | null | undefined, email?: string | null): string {
  const source = (name ?? "").trim() || (email ?? "").split("@")[0] || "";
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
}
