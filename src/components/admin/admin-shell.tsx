"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileClock,
  LayoutDashboard,
  LineChart,
  LogOut,
  Moon,
  ArrowLeftRight,
  ShieldAlert,
  Sun,
} from "lucide-react";
import { getAdminEmail, signOutAdmin } from "@/lib/admin/utils";
import { useAdminStore } from "@/lib/admin/store";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/fixed-income", label: "Fixed income monitoring", icon: ShieldAlert },
  { href: "/admin/monitoring", label: "Monitoring", icon: LineChart },
  { href: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/admin/audit-log", label: "Audit log", icon: FileClock },
];

const THEME_KEY = "admin_theme";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const log = useAdminStore((s) => s.log);
  const [dark, setDark] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setDark(localStorage.getItem(THEME_KEY) === "dark");
    setEmail(getAdminEmail());
  }, []);

  const toggleTheme = () => {
    setDark((d) => {
      localStorage.setItem(THEME_KEY, d ? "light" : "dark");
      return !d;
    });
  };

  const signOut = () => {
    log(getAdminEmail(), "Signed out", "Admin portal");
    signOutAdmin();
    router.replace("/admin/login");
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:flex">
          <div className="mb-6 px-2 text-lg font-bold text-violet-600">AIP Admin</div>
          <nav className="flex flex-col gap-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname.startsWith(href)
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:px-8">
            <span className="font-bold text-violet-600 md:hidden">AIP Admin</span>
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden text-sm text-slate-500 sm:inline">{email}</span>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
              <button
                type="button"
                onClick={signOut}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </div>
          </header>

          <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-900 md:hidden">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm ${
                  pathname.startsWith(href)
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
