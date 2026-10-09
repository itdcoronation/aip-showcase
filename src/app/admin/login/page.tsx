"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { signInAdmin } from "@/lib/admin/utils";
import { useAdminStore } from "@/lib/admin/store";
import { fieldClass } from "@/components/admin/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const log = useAdminStore((s) => s.log);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    signInAdmin(email.trim());
    log(email.trim(), "Signed in", "Admin portal");
    router.replace("/admin/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-2 text-violet-600">
          <ShieldCheck className="size-6" />
          <span className="text-lg font-bold">AIP Admin</span>
        </div>
        <h1 className="text-xl font-semibold text-slate-900">Sign in</h1>
        <p className="mb-6 mt-1 text-sm text-slate-500">
          Demo portal: any email and password will work.
        </p>

        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${fieldClass} mb-4 w-full`}
        />

        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${fieldClass} w-full`}
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="mt-6 h-10 w-full rounded-lg bg-violet-600 text-sm font-medium text-white hover:bg-violet-700"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
