"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import {
  AdminTransaction,
  CustomerRow,
  ProductConfig,
  TX_TYPE_LABELS,
} from "@/lib/admin/mock-data";
import { formatDate, formatNaira } from "@/lib/admin/utils";
import { StatusBadge } from "./ui";

export function CustomerDrawer({
  row,
  product,
  transactions,
  onClose,
}: {
  row: CustomerRow | null;
  product: ProductConfig;
  transactions: AdminTransaction[];
  onClose: () => void;
}) {
  useEffect(() => {
    if (!row) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [row, onClose]);

  if (!row) return null;
  const { customer } = row;
  const metrics: [string, string][] = [
    [product.labels.invested, formatNaira(row.invested)],
    [product.labels.upfront, product.upfrontApplicable ? formatNaira(row.upfront) : "N/A"],
    [product.labels.partialWithdrawal, formatNaira(row.partialWithdrawal)],
    [product.labels.withdrawal, formatNaira(row.withdrawal)],
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <aside
        role="dialog"
        aria-label={`${customer.name} details`}
        className="relative h-full w-full max-w-md overflow-y-auto bg-white p-6 text-slate-900 shadow-xl dark:bg-slate-900 dark:text-white"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="size-5" />
        </button>
        <h2 className="text-xl font-semibold">{customer.name}</h2>
        <p className="text-sm text-slate-500">{customer.id} · {product.label}</p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div><dt className="text-slate-500">Email</dt><dd className="break-all">{customer.email}</dd></div>
          <div><dt className="text-slate-500">Phone</dt><dd>{customer.phone}</dd></div>
          <div><dt className="text-slate-500">Joined</dt><dd>{formatDate(customer.joinedAt)}</dd></div>
          <div><dt className="text-slate-500">KYC</dt><dd><StatusBadge status={customer.kyc} /></dd></div>
        </dl>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {metrics.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="mt-1 font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <h3 className="mb-2 mt-6 text-sm font-semibold">Transactions</h3>
        <ul className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
          {transactions.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-2 py-2">
              <div>
                <p>{TX_TYPE_LABELS[t.type]}</p>
                <p className="text-xs text-slate-500">{formatDate(t.date)} · {t.id}</p>
              </div>
              <div className="text-right">
                <p className="tabular-nums">{formatNaira(t.amount)}</p>
                <StatusBadge status={t.status} />
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
