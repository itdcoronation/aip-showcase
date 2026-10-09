import Cookies from "js-cookie";

export const ADMIN_COOKIE = "admin_session";
export const ADMIN_EMAIL_COOKIE = "admin_email";

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export const formatNaira = (n: number) => naira.format(n);

export const formatCompact = (n: number) =>
  new Intl.NumberFormat("en-NG", { notation: "compact", maximumFractionDigits: 1 }).format(n);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });

export const getAdminEmail = () => Cookies.get(ADMIN_EMAIL_COOKIE) ?? "admin";

export function signInAdmin(email: string) {
  Cookies.set(ADMIN_COOKIE, "1", { sameSite: "lax" });
  Cookies.set(ADMIN_EMAIL_COOKIE, email, { sameSite: "lax" });
}

export function signOutAdmin() {
  Cookies.remove(ADMIN_COOKIE);
  Cookies.remove(ADMIN_EMAIL_COOKIE);
}

const escapeCsv = (v: string | number) => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const blob = new Blob([rows.map((r) => r.map(escapeCsv).join(",")).join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
