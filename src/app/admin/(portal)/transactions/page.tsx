"use client";

import { useMemo, useState } from "react";
import {
  AdminTransaction,
  DEFAULT_RANGE,
  DateRangeValue,
  PRODUCTS,
  ProductKey,
  TX_TYPE_LABELS,
  TxStatus,
  TxType,
  getProduct,
  inRange,
} from "@/lib/admin/mock-data";
import { useAdminStore } from "@/lib/admin/store";
import { downloadCsv, formatDate, formatNaira, getAdminEmail } from "@/lib/admin/utils";
import { Column, DataTable } from "@/components/admin/data-table";
import {
  DateRangeFilter,
  PageHeader,
  SearchInput,
  StatusBadge,
  StatusFilter,
  fieldClass,
} from "@/components/admin/ui";

const isWithdrawal = (t: AdminTransaction) =>
  t.type === "withdrawal" || t.type === "partial-withdrawal";

export default function TransactionsPage() {
  const { customers, transactions, resolveWithdrawal, log } = useAdminStore();
  const [view, setView] = useState<"all" | "requests">("all");
  const [product, setProduct] = useState<ProductKey | "all">("all");
  const [type, setType] = useState<TxType | "all">("all");
  const [status, setStatus] = useState<TxStatus | "all">("all");
  const [range, setRange] = useState<DateRangeValue>(DEFAULT_RANGE);
  const [search, setSearch] = useState("");

  const names = useMemo(() => new Map(customers.map((c) => [c.id, c.name])), [customers]);
  const pendingCount = transactions.filter(
    (t) =>
      t.product === "fixed-income" &&
      isWithdrawal(t) &&
      t.status === "pending"
  ).length;

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions.filter(
      (t) =>
        (view === "all" ||
          (t.product === "fixed-income" &&
            isWithdrawal(t) &&
            t.status === "pending")) &&
        (product === "all" || t.product === product) &&
        (type === "all" || t.type === type) &&
        (status === "all" || t.status === status) &&
        inRange(t, range) &&
        (!q ||
          t.id.toLowerCase().includes(q) ||
          t.reference.toLowerCase().includes(q) ||
          (names.get(t.customerId) ?? "").toLowerCase().includes(q))
    );
  }, [transactions, view, product, type, status, range, search, names]);

  const columns: Column<AdminTransaction>[] = [
    { key: "id", header: "ID", sortValue: (t) => t.id, render: (t) => t.id },
    { key: "customer", header: "Customer", sortValue: (t) => names.get(t.customerId) ?? "", render: (t) => names.get(t.customerId) },
    { key: "product", header: "Product", sortValue: (t) => t.product, render: (t) => getProduct(t.product).label },
    { key: "type", header: "Type", sortValue: (t) => t.type, render: (t) => TX_TYPE_LABELS[t.type] },
    { key: "amount", header: "Amount", align: "right", sortValue: (t) => t.amount, render: (t) => formatNaira(t.amount) },
    { key: "status", header: "Status", sortValue: (t) => t.status, render: (t) => <StatusBadge status={t.status} /> },
    { key: "date", header: "Date", sortValue: (t) => t.date, render: (t) => formatDate(t.date) },
    {
      key: "actions",
      header: "Actions",
      render: (t) =>
        t.product === "fixed-income" &&
        isWithdrawal(t) &&
        t.status === "pending" ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => resolveWithdrawal(t.id, true, getAdminEmail())}
              className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => resolveWithdrawal(t.id, false, getAdminEmail())}
              className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
  ];

  const exportCsv = () => {
    downloadCsv("transactions.csv", [
      ["ID", "Reference", "Customer", "Product", "Type", "Amount", "Status", "Date"],
      ...rows.map((t) => [t.id, t.reference, names.get(t.customerId) ?? "", getProduct(t.product).label, TX_TYPE_LABELS[t.type], t.amount, t.status, t.date]),
    ]);
    log(getAdminEmail(), "Exported transactions", `${rows.length} rows`);
  };

  return (
    <>
      <PageHeader
        title="Transactions"
        description="All activity and pending withdrawal requests."
        actions={
          <button
            type="button"
            onClick={exportCsv}
            className="h-9 rounded-lg bg-violet-600 px-3 text-sm font-medium text-white hover:bg-violet-700"
          >
            Export CSV
          </button>
        }
      />

      <div role="tablist" className="mb-4 flex gap-1 border-b border-slate-200 dark:border-slate-800">
        {([["all", "All transactions"], ["requests", `Withdrawal requests (${pendingCount})`]] as const).map(([k, label]) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={view === k}
            onClick={() => setView(k)}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              view === k ? "border-violet-600 text-violet-600" : "border-transparent text-slate-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchInput value={search} onChange={setSearch} placeholder="Search customer, ID or reference" />
        <select aria-label="Product filter" value={product} onChange={(e) => setProduct(e.target.value as ProductKey | "all")} className={fieldClass}>
          <option value="all">All products</option>
          {PRODUCTS.map((p) => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>
        <select aria-label="Type filter" value={type} onChange={(e) => setType(e.target.value as TxType | "all")} className={fieldClass}>
          <option value="all">All types</option>
          {Object.entries(TX_TYPE_LABELS).map(([k, l]) => (
            <option key={k} value={k}>{l}</option>
          ))}
        </select>
        {view === "all" && <StatusFilter value={status} onChange={setStatus} />}
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      <DataTable
        key={view}
        columns={columns}
        rows={rows}
        rowKey={(t) => t.id}
        initialSort={{ key: "date", dir: "desc" }}
        emptyMessage={view === "requests" ? "No pending withdrawal requests." : "No transactions found."}
      />
    </>
  );
}
