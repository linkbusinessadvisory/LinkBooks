export type CompanyRole = "owner" | "admin" | "accountant" | "bookkeeper" | "staff" | "read_only";

export const roleLabels: Record<CompanyRole, string> = {
  owner: "Company Owner",
  admin: "Administrator",
  accountant: "Accountant",
  bookkeeper: "Bookkeeper",
  staff: "Staff",
  read_only: "Read-only",
};

export const canManageCompany = (role: CompanyRole | undefined) => role === "owner" || role === "admin";

/** Launch markets first; country-agnostic data only, no tax rules. */
export const countries = [
  { code: "US", name: "United States", currency: "USD", timezone: "America/New_York", fyMonth: 12, fyDay: 31 },
  { code: "GB", name: "United Kingdom", currency: "GBP", timezone: "Europe/London", fyMonth: 3, fyDay: 31 },
  { code: "AU", name: "Australia", currency: "AUD", timezone: "Australia/Sydney", fyMonth: 6, fyDay: 30 },
  { code: "NZ", name: "New Zealand", currency: "NZD", timezone: "Pacific/Auckland", fyMonth: 3, fyDay: 31 },
  { code: "CA", name: "Canada", currency: "CAD", timezone: "America/Toronto", fyMonth: 12, fyDay: 31 },
  { code: "IN", name: "India", currency: "INR", timezone: "Asia/Kolkata", fyMonth: 3, fyDay: 31 },
] as const;

export const currencies = ["USD", "GBP", "EUR", "AUD", "NZD", "CAD", "INR", "SGD", "ZAR", "AED"] as const;

export const timezones = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Toronto", "America/Vancouver", "Europe/London", "Europe/Dublin",
  "Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane", "Australia/Perth",
  "Pacific/Auckland", "Asia/Kolkata", "Asia/Singapore", "Asia/Dubai", "UTC",
] as const;

export const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export const taxRegimes = [
  { value: "none", label: "Not registered" },
  { value: "vat", label: "VAT" },
  { value: "gst", label: "GST" },
  { value: "sales_tax", label: "Sales tax" },
  { value: "other", label: "Other" },
] as const;

export function countryName(code: string) {
  return countries.find((c) => c.code === code)?.name ?? code;
}
