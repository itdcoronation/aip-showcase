"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CustomerRow,
  PRODUCTS,
  REFERENCE_DATE,
  breakdownByCustomer,
  summarize,
  TX_TYPE_LABELS,
} from "@/lib/admin/mock-data";
import { useAdminStore } from "@/lib/admin/store";
import { formatCompact, formatNaira } from "@/lib/admin/utils";
import { KpiCard, PageHeader } from "@/components/admin/ui";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AXIS = { fill: "#94a3b8", fontSize: 12 };

export default function DashboardPage() {
  const { customers, transactions } = useAdminStore();
  // Charts need client-only width measurement.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const completed = useMemo(
    () => transactions.filter((t) => t.status === "completed"),
    [transactions]
  );
  const totals = useMemo(() => summarize(completed), [completed]);
  const pending = useMemo(
    () =>
      transactions.filter(
        (t) => t.status === "pending" && (t.type === "withdrawal" || t.type === "partial-withdrawal")
      ),
    [transactions]
  );

  const byProduct = useMemo(
    () =>
      PRODUCTS.map((p) => {
        const m = summarize(completed.filter((t) => t.product === p.key));
        return {
          name: p.label,
          Invested: m.invested,
          Withdrawn: m.withdrawal + m.partialWithdrawal,
        };
      }),
    [completed]
  );

  const monthly = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(Date.UTC(REFERENCE_DATE.getUTCFullYear(), REFERENCE_DATE.getUTCMonth() - (11 - i), 1));
      return { key: d.toISOString().slice(0, 7), name: d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" }), Invested: 0, Withdrawn: 0 };
    });
    for (const t of completed) {
      const m = months.find((x) => x.key === t.date.slice(0, 7));
      if (!m) continue;
      if (t.type === "investment") m.Invested += t.amount;
      else if (t.type !== "upfront") m.Withdrawn += t.amount;
    }
    return months;
  }, [completed]);

  const topCustomers: CustomerRow[] = useMemo(
    () => breakdownByCustomer(completed, customers).sort((a, b) => b.invested - a.invested).slice(0, 5),
    [completed, customers]
  );

  const tooltipFmt = (v: unknown) => formatNaira(Number(v));

  return (
    <>
      <PageHeader title="Overview" description="Completed activity across all products." />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total amount invested" value={formatNaira(totals.invested)} />
        <KpiCard label="Total paid upfront" value={formatNaira(totals.upfront)} />
        <KpiCard label="Total partial withdrawal" value={formatNaira(totals.partialWithdrawal)} />
        <KpiCard label="Total withdrawal" value={formatNaira(totals.withdrawal)} />
        <KpiCard label="Customers" value={customers.length} />
        <KpiCard label="KYC pending" value={customers.filter((c) => c.kyc === "pending").length} />
        <KpiCard
          label="Pending withdrawal requests"
          value={pending.length}
          hint={formatNaira(pending.reduce((s, t) => s + t.amount, 0))}
        />
        <KpiCard label="Transactions" value={transactions.length} />
      </div>

      {mounted && (
        <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">By product</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byProduct}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e180" />
                <XAxis dataKey="name" tick={AXIS} />
                <YAxis tickFormatter={formatCompact} tick={AXIS} />
                <Tooltip formatter={tooltipFmt} />
                <Legend />
                <Bar dataKey="Invested" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Withdrawn" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Monthly trend</h2>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e180" />
                <XAxis dataKey="name" tick={AXIS} />
                <YAxis tickFormatter={formatCompact} tick={AXIS} />
                <Tooltip formatter={tooltipFmt} />
                <Legend />
                <Area dataKey="Invested" stroke="#7c3aed" fill="#7c3aed33" />
                <Area dataKey="Withdrawn" stroke="#f59e0b" fill="#f59e0b33" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Top customers by amount invested</h2>
          <ul className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
            {topCustomers.map((r) => (
              <li key={r.customer.id} className="flex justify-between py-2 text-slate-700 dark:text-slate-200">
                <span>{r.customer.name}</span>
                <span className="tabular-nums">{formatNaira(r.invested)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Pending withdrawal requests</h2>
            <Link href="/admin/transactions" className="text-xs text-violet-600 hover:underline">
              Review all
            </Link>
          </div>
          <ul className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
            {pending.slice(0, 5).map((t) => (
              <li key={t.id} className="flex justify-between py-2 text-slate-700 dark:text-slate-200">
                <span>
                  {customers.find((c) => c.id === t.customerId)?.name} · {TX_TYPE_LABELS[t.type]}
                </span>
                <span className="tabular-nums">{formatNaira(t.amount)}</span>
              </li>
            ))}
            {pending.length === 0 && <li className="py-2 text-slate-500">Nothing pending.</li>}
          </ul>
        </div>
      </div>
    </>
  );
}
