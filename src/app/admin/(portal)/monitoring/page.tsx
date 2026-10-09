"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import {
  DEFAULT_RANGE,
  DateRangeValue,
  PRODUCTS,
  ProductKey,
  TxStatus,
  breakdownByCustomer,
  getProduct,
  inRange,
  summarize,
  CustomerRow,
} from "@/lib/admin/mock-data";
import { useAdminStore } from "@/lib/admin/store";
import { downloadCsv, formatDate, formatNaira, getAdminEmail } from "@/lib/admin/utils";
import { Column, DataTable } from "@/components/admin/data-table";
import { CustomerDrawer } from "@/components/admin/customer-drawer";
import {
  DateRangeFilter,
  KpiCard,
  PageHeader,
  SearchInput,
  StatusBadge,
  StatusFilter,
  fieldClass,
} from "@/components/admin/ui";

export default function MonitoringPage() {
  const { customers, transactions, log } = useAdminStore();
  const [productKey, setProductKey] = useState<ProductKey>("fixed-income");
  const [range, setRange] = useState<DateRangeValue>(DEFAULT_RANGE);
  const [status, setStatus] = useState<TxStatus | "all">("completed");
  const [kyc, setKyc] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CustomerRow | null>(null);

  const product = getProduct(productKey);

  const filtered = useMemo(
    () =>
      transactions.filter(
        (t) =>
          t.product === productKey &&
          inRange(t, range) &&
          (status === "all" || t.status === status)
      ),
    [transactions, productKey, range, status]
  );

  const totals = useMemo(() => summarize(filtered), [filtered]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return breakdownByCustomer(filtered, customers).filter(
      (r) =>
        (kyc === "all" || r.customer.kyc === kyc) &&
        (!q ||
          r.customer.name.toLowerCase().includes(q) ||
          r.customer.id.toLowerCase().includes(q) ||
          r.customer.email.toLowerCase().includes(q))
    );
  }, [filtered, customers, search, kyc]);

  const shownTotals = useMemo(
    () =>
      rows.reduce(
        (a, r) => ({
          invested: a.invested + r.invested,
          upfront: a.upfront + r.upfront,
          partialWithdrawal: a.partialWithdrawal + r.partialWithdrawal,
          withdrawal: a.withdrawal + r.withdrawal,
        }),
        { invested: 0, upfront: 0, partialWithdrawal: 0, withdrawal: 0 }
      ),
    [rows]
  );

  const upfront = (n: number) => (product.upfrontApplicable ? formatNaira(n) : "N/A");

  const columns: Column<CustomerRow>[] = [
    {
      key: "customer",
      header: "Customer",
      sortValue: (r) => r.customer.name,
      render: (r) => (
        <div>
          <p className="font-medium">{r.customer.name}</p>
          <p className="text-xs text-slate-500">{r.customer.id}</p>
        </div>
      ),
    },
    { key: "kyc", header: "KYC", render: (r) => <StatusBadge status={r.customer.kyc} /> },
    { key: "invested", header: product.labels.invested.replace("Total ", ""), align: "right", sortValue: (r) => r.invested, render: (r) => formatNaira(r.invested) },
    { key: "upfront", header: product.labels.upfront.replace("Total ", ""), align: "right", sortValue: (r) => r.upfront, render: (r) => upfront(r.upfront) },
    { key: "partial", header: product.labels.partialWithdrawal.replace("Total ", ""), align: "right", sortValue: (r) => r.partialWithdrawal, render: (r) => formatNaira(r.partialWithdrawal) },
    { key: "withdrawal", header: product.labels.withdrawal.replace("Total ", ""), align: "right", sortValue: (r) => r.withdrawal, render: (r) => formatNaira(r.withdrawal) },
    { key: "last", header: "Last activity", sortValue: (r) => r.lastActivity, render: (r) => formatDate(r.lastActivity) },
  ];

  const exportCsv = () => {
    downloadCsv(`${productKey}-customer-breakdown.csv`, [
      ["Customer ID", "Name", "Email", "KYC", product.labels.invested, product.labels.upfront, product.labels.partialWithdrawal, product.labels.withdrawal],
      ...rows.map((r) => [
        r.customer.id, r.customer.name, r.customer.email, r.customer.kyc,
        r.invested, product.upfrontApplicable ? r.upfront : "N/A", r.partialWithdrawal, r.withdrawal,
      ]),
    ]);
    log(getAdminEmail(), "Exported monitoring report", product.label);
  };

  return (
    <>
      <PageHeader
        title="Product monitoring"
        description="Investment, upfront payment and withdrawal activity per product and customer."
        actions={
          <button
            type="button"
            onClick={exportCsv}
            className="flex h-9 items-center gap-2 rounded-lg bg-violet-600 px-3 text-sm font-medium text-white hover:bg-violet-700"
          >
            <Download className="size-4" /> Export CSV
          </button>
        }
      />

      <div role="tablist" className="mb-4 flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
        {PRODUCTS.map((p) => (
          <button
            key={p.key}
            role="tab"
            type="button"
            aria-selected={p.key === productKey}
            onClick={() => setProductKey(p.key)}
            className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium ${
              p.key === productKey
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <DateRangeFilter value={range} onChange={setRange} />
        <StatusFilter value={status} onChange={setStatus} />
        <select aria-label="KYC filter" value={kyc} onChange={(e) => setKyc(e.target.value)} className={fieldClass}>
          <option value="all">All KYC</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label={product.labels.invested} value={formatNaira(totals.invested)} />
        <KpiCard label={product.labels.upfront} value={upfront(totals.upfront)} />
        <KpiCard label={product.labels.partialWithdrawal} value={formatNaira(totals.partialWithdrawal)} />
        <KpiCard label={product.labels.withdrawal} value={formatNaira(totals.withdrawal)} />
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Customer breakdown · {product.label}
        </h2>
        <SearchInput value={search} onChange={setSearch} placeholder="Search customer, ID or email" />
      </div>

      <DataTable
        key={productKey}
        columns={columns}
        rows={rows}
        rowKey={(r) => r.customer.id}
        initialSort={{ key: "invested", dir: "desc" }}
        onRowClick={setSelected}
        emptyMessage="No customers match the current filters."
        footer={
          <tr>
            <td className="px-4 py-3" colSpan={2}>Total ({rows.length} customers)</td>
            <td className="px-4 py-3 text-right tabular-nums">{formatNaira(shownTotals.invested)}</td>
            <td className="px-4 py-3 text-right tabular-nums">{upfront(shownTotals.upfront)}</td>
            <td className="px-4 py-3 text-right tabular-nums">{formatNaira(shownTotals.partialWithdrawal)}</td>
            <td className="px-4 py-3 text-right tabular-nums">{formatNaira(shownTotals.withdrawal)}</td>
            <td />
          </tr>
        }
      />

      <CustomerDrawer
        row={selected}
        product={product}
        transactions={transactions.filter(
          (t) => t.product === productKey && t.customerId === selected?.customer.id
        )}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
