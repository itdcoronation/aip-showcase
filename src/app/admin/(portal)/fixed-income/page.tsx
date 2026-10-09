"use client";

import { useMemo, useState } from "react";
import { Download, ShieldAlert } from "lucide-react";
import { PageHeader, KpiCard, fieldClass } from "@/components/admin/ui";
import { useAdminStore } from "@/lib/admin/store";
import {
  calculateFixedIncomeImpact,
  FIXED_INCOME_EXCEPTION_STATUSES,
  FixedIncomeException,
  FixedIncomeExceptionStatus,
  fixedIncomeExceptions,
} from "@/lib/admin/fixed-income";
import { downloadCsv, getAdminEmail } from "@/lib/admin/utils";

type DashboardView = "control" | "repricing" | "execution" | "audit";
type EditableTerm =
  | "faceValue"
  | "originalRate"
  | "revisedRate"
  | "tenorDays"
  | "daysElapsed"
  | "liquidationFaceValue";

interface AuditEvent {
  reference: string;
  action: string;
  actor: string;
  timestamp: string;
}

const currency = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const timestampWAT = (timestamp: string) =>
  new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "Africa/Lagos",
  }).format(new Date(timestamp));

const maturityDate = (row: FixedIncomeException) => {
  const date = new Date(row.purchaseTimestamp);
  date.setUTCDate(date.getUTCDate() + row.tenorDays);
  return date.toISOString().slice(0, 10);
};

const exceptionAge = (detectedAt: string) => {
  const elapsedHours = Math.max(
    0,
    Math.floor((Date.now() - new Date(detectedAt).getTime()) / 3_600_000)
  );
  const days = Math.floor(elapsedHours / 24);
  const hours = elapsedHours % 24;
  return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
};

const statusStyle: Record<FixedIncomeExceptionStatus, string> = {
  failed: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  "pending approval": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  approved: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  "execution pending": "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  "settlement pending": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "partially liquidated": "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  reconciled: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
};

export default function FixedIncomeDashboardPage() {
  const customers = useAdminStore((state) => state.customers);
  const log = useAdminStore((state) => state.log);
  const [rows, setRows] = useState(fixedIncomeExceptions);
  const [selectedReference, setSelectedReference] = useState(
    fixedIncomeExceptions[0].reference
  );
  const [view, setView] = useState<DashboardView>("control");
  const [query, setQuery] = useState("");
  const [purchaseFrom, setPurchaseFrom] = useState("");
  const [purchaseTo, setPurchaseTo] = useState("");
  const [maturityFrom, setMaturityFrom] = useState("");
  const [maturityTo, setMaturityTo] = useState("");
  const [minimumRate, setMinimumRate] = useState("");
  const [maximumRate, setMaximumRate] = useState("");
  const [counterpartyFilter, setCounterpartyFilter] = useState("all");
  const [dayCountBasis, setDayCountBasis] = useState<360 | 365>(365);
  const [includeAccruedInterest, setIncludeAccruedInterest] = useState(false);
  const [actualCashReceived, setActualCashReceived] = useState("");
  const [verifiedBeforeRetry, setVerifiedBeforeRetry] = useState(false);
  const [events, setEvents] = useState<AuditEvent[]>(
    fixedIncomeExceptions.flatMap((item) => [
      {
        reference: item.reference,
        action: "Purchase recorded",
        actor: "System",
        timestamp: item.purchaseTimestamp,
      },
      {
        reference: item.reference,
        action: `Exception detected: ${item.failureReason}`,
        actor: "System",
        timestamp: item.purchaseTimestamp,
      },
    ])
  );

  const selected = rows.find((row) => row.reference === selectedReference) ?? rows[0];
  const customersById = useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer])),
    [customers]
  );
  const customerName = (row: FixedIncomeException) =>
    customersById.get(row.customerId)?.name ?? row.customerId;
  const [terms, setTerms] = useState<Record<EditableTerm, string>>({
    faceValue: String(selected.faceValue),
    originalRate: String(selected.originalRate),
    revisedRate: String(selected.revisedRate),
    tenorDays: String(selected.tenorDays),
    daysElapsed: String(selected.daysElapsed),
    liquidationFaceValue: String(selected.liquidationFaceValue),
  });

  const numericTerms = {
    faceValue: Number(terms.faceValue),
    originalRate: Number(terms.originalRate),
    revisedRate: Number(terms.revisedRate),
    tenorDays: Number(terms.tenorDays),
    daysElapsed: Number(terms.daysElapsed),
    liquidationFaceValue: Number(terms.liquidationFaceValue),
  };
  const validationError = (() => {
    const values = Object.values(numericTerms);
    if (!values.every(Number.isFinite)) return "Enter valid numeric terms.";
    if (numericTerms.faceValue <= 0) return "Face value must be greater than zero.";
    if (
      numericTerms.originalRate < 0 ||
      numericTerms.originalRate > 100 ||
      numericTerms.revisedRate < 0 ||
      numericTerms.revisedRate > 100
    ) {
      return "Rates must be between 0% and 100%.";
    }
    if (numericTerms.tenorDays <= 0) return "Original tenor must be greater than zero.";
    if (
      numericTerms.daysElapsed < 0 ||
      numericTerms.daysElapsed > numericTerms.tenorDays
    ) {
      return "Days elapsed must be between zero and the original tenor.";
    }
    if (
      numericTerms.liquidationFaceValue < 0 ||
      numericTerms.liquidationFaceValue > numericTerms.faceValue
    ) {
      return "Liquidation face value must be between zero and the original face value.";
    }
    if (
      numericTerms.originalRate *
        (numericTerms.tenorDays / dayCountBasis) >=
      100
    ) {
      return "Original discount must be less than face value.";
    }
    if (
      actualCashReceived !== "" &&
      (!Number.isFinite(Number(actualCashReceived)) ||
        Number(actualCashReceived) < 0)
    ) {
      return "Actual cash received must be a non-negative amount.";
    }
    return "";
  })();
  const impact = validationError
    ? null
    : calculateFixedIncomeImpact({
        ...numericTerms,
        dayCountBasis,
        includeAccruedInterest,
        actualCashReceived:
          actualCashReceived === "" ? null : Number(actualCashReceived),
      });

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery =
        !normalizedQuery ||
        row.reference.toLowerCase().includes(normalizedQuery) ||
        row.instrument.toLowerCase().includes(normalizedQuery) ||
        (customersById.get(row.customerId)?.name ?? row.customerId)
          .toLowerCase()
          .includes(normalizedQuery) ||
        row.counterparty.toLowerCase().includes(normalizedQuery) ||
        row.failureReason.toLowerCase().includes(normalizedQuery);
      const purchaseDate = row.purchaseTimestamp.slice(0, 10);
      const rowMaturityDate = maturityDate(row);

      return (
        matchesQuery &&
        (purchaseFrom === "" || purchaseDate >= purchaseFrom) &&
        (purchaseTo === "" || purchaseDate <= purchaseTo) &&
        (maturityFrom === "" || rowMaturityDate >= maturityFrom) &&
        (maturityTo === "" || rowMaturityDate <= maturityTo) &&
        (minimumRate === "" || row.originalRate >= Number(minimumRate)) &&
        (maximumRate === "" || row.originalRate <= Number(maximumRate)) &&
        (counterpartyFilter === "all" || row.counterparty === counterpartyFilter)
      );
    });
  }, [
    rows,
    query,
    customersById,
    purchaseFrom,
    purchaseTo,
    maturityFrom,
    maturityTo,
    minimumRate,
    maximumRate,
    counterpartyFilter,
  ]);

  const updateTerm = (key: EditableTerm, value: string) =>
    setTerms((current) => ({ ...current, [key]: value }));

  const selectException = (row: FixedIncomeException) => {
    setSelectedReference(row.reference);
    setTerms({
      faceValue: String(row.faceValue),
      originalRate: String(row.originalRate),
      revisedRate: String(row.revisedRate),
      tenorDays: String(row.tenorDays),
      daysElapsed: String(row.daysElapsed),
      liquidationFaceValue: String(row.liquidationFaceValue),
    });
    setVerifiedBeforeRetry(false);
  };

  const transition = (
    nextStatus: FixedIncomeExceptionStatus,
    description: string
  ) => {
    if (!selected) return;
    const actor = getAdminEmail() || "Demo operator";
    const timestamp = new Date().toISOString();
    setRows((current) =>
      current.map((row) =>
        row.reference === selected.reference
          ? { ...row, status: nextStatus }
          : row
      )
    );
    setEvents((current) => [
      { reference: selected.reference, action: description, actor, timestamp },
      ...current,
    ]);
    log(actor, description, selected.reference);
  };

  const exceptionTotals = rows.reduce(
    (total, row) =>
      total +
      (row.status === "reconciled" || row.status === "rejected"
        ? 0
        : row.faceValue - row.liquidationFaceValue),
    0
  );
  const statusCounts = FIXED_INCOME_EXCEPTION_STATUSES.reduce(
    (counts, status) => ({
      ...counts,
      [status]: rows.filter((row) => row.status === status).length,
    }),
    {} as Record<FixedIncomeExceptionStatus, number>
  );

  const exportRows = () => {
    downloadCsv("fixed-income-exceptions.csv", [
      [
        "Reference",
        "Instrument",
        "Customer",
        "Customer ID",
        "Counterparty",
        "Status",
        "Face value",
        "Original rate",
        "Revised rate",
        "Liquidation face value",
        "Remaining face value",
        "Remaining discounted value",
        "Purchase timestamp",
        "Maturity date",
        "Exception detected at",
        "Exception age",
        "Owner",
        "Failure reason",
      ],
      ...rows.map((row) => {
        const result = calculateFixedIncomeImpact({
          faceValue: row.faceValue,
          originalRate: row.originalRate,
          revisedRate: row.revisedRate,
          tenorDays: row.tenorDays,
          daysElapsed: row.daysElapsed,
          liquidationFaceValue: row.liquidationFaceValue,
          dayCountBasis,
        });
        return [
          row.reference,
          row.instrument,
          customerName(row),
          row.customerId,
          row.counterparty,
          row.status,
          row.faceValue,
          row.originalRate,
          row.revisedRate,
          row.liquidationFaceValue,
          result.remainingFaceValue,
          result.remainingDiscountedValue,
          row.purchaseTimestamp,
          maturityDate(row),
          row.exceptionDetectedAt,
          exceptionAge(row.exceptionDetectedAt),
          row.owner,
          row.failureReason,
        ];
      }),
    ]);
    log(getAdminEmail(), "Exported fixed-income exception report", `${rows.length} rows`);
  };

  if (!selected) return null;

  return (
    <>
      <PageHeader
        title="Fixed Income Exception Control"
        description="Monitor failed CP and T-Bill trades, model repricing and showcase the controlled recovery workflow."
        actions={
          <button
            type="button"
            onClick={exportRows}
            className="flex h-9 items-center gap-2 rounded-lg bg-violet-600 px-3 text-sm font-medium text-white hover:bg-violet-700"
          >
            <Download className="size-4" /> Export CSV
          </button>
        }
      />

      <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
        <ShieldAlert className="mt-0.5 size-5 shrink-0" />
        <p>
          <strong>Showcase mode:</strong> sample exception data and the discount
          formulas below are hardcoded for demonstration. Approval, execution,
          settlement and reconciliation actions update this page only; they do
          not call a trading, payment, custody or ledger service.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total exceptions" value={rows.length} />
        <KpiCard label="Failed transactions" value={statusCounts.failed} />
        <KpiCard label="Open face value at risk" value={currency(exceptionTotals)} />
        <KpiCard label="Awaiting approval" value={statusCounts["pending approval"]} />
      </div>

      <section aria-label="Exception counts by status" className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          All exception statuses
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {FIXED_INCOME_EXCEPTION_STATUSES.map((status) => (
            <KpiCard
              key={status}
              label={status}
              value={statusCounts[status]}
            />
          ))}
        </div>
      </section>

      <div role="tablist" aria-label="Fixed income dashboard views" className="mb-5 flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
        {([
          ["control", "Exception control tower"],
          ["repricing", "Trade detail & repricing"],
          ["execution", "Execution workbench"],
          ["audit", "Audit & reconciliation"],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={view === key}
            onClick={() => setView(key)}
            className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${
              view === key
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "control" && (
        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">CP / T-Bill exception queue</h2>
              <p className="text-xs text-slate-500">Sample rows only; production data source is not connected.</p>
            </div>
            <input
              aria-label="Search exceptions"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search reference, customer, counterparty or reason"
              className={`${fieldClass} w-full sm:w-80`}
            />
          </div>
          <div className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2 xl:grid-cols-4">
            <label className="grid gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
              Purchase date from
              <input type="date" value={purchaseFrom} onChange={(event) => setPurchaseFrom(event.target.value)} className={fieldClass} />
            </label>
            <label className="grid gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
              Purchase date to
              <input type="date" value={purchaseTo} onChange={(event) => setPurchaseTo(event.target.value)} className={fieldClass} />
            </label>
            <label className="grid gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
              Maturity date from
              <input type="date" value={maturityFrom} onChange={(event) => setMaturityFrom(event.target.value)} className={fieldClass} />
            </label>
            <label className="grid gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
              Maturity date to
              <input type="date" value={maturityTo} onChange={(event) => setMaturityTo(event.target.value)} className={fieldClass} />
            </label>
            <label className="grid gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
              Original rate from (%)
              <input type="number" min="0" max="100" step="0.01" value={minimumRate} onChange={(event) => setMinimumRate(event.target.value)} className={fieldClass} />
            </label>
            <label className="grid gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
              Original rate to (%)
              <input type="number" min="0" max="100" step="0.01" value={maximumRate} onChange={(event) => setMaximumRate(event.target.value)} className={fieldClass} />
            </label>
            <label className="grid gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
              Counterparty
              <select value={counterpartyFilter} onChange={(event) => setCounterpartyFilter(event.target.value)} className={fieldClass}>
                <option value="all">All counterparties</option>
                {[...new Set(rows.map((row) => row.counterparty))].sort().map((counterparty) => (
                  <option key={counterparty} value={counterparty}>{counterparty}</option>
                ))}
              </select>
            </label>
            <p className="self-end pb-2 text-xs text-slate-500">
              {filteredRows.length} of {rows.length} exceptions shown
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800/50">
                <tr>
                  {["Reference / instrument", "Customer", "Counterparty", "Status", "Original / revised rate", "Purchase / maturity", "Age", "Face value", "Liquidated", "Owner / SLA", "Exception"].map((heading) => (
                    <th key={heading} className="whitespace-nowrap px-4 py-3 font-medium">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRows.map((row) => (
                  <tr
                    key={row.reference}
                    className={`cursor-pointer text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 ${
                      row.reference === selected.reference ? "bg-violet-50 dark:bg-violet-500/10" : ""
                    }`}
                    onClick={() => selectException(row)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{row.reference}</p>
                      <p className="text-xs text-slate-500">{row.instrument}</p>
                    </td>
                    <td className="px-4 py-3">{customerName(row)}<p className="text-xs text-slate-500">{row.customerId}</p></td>
                    <td className="px-4 py-3">{row.counterparty}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyle[row.status]}`}>{row.status}</span></td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums">{row.originalRate}% / {row.revisedRate}%</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">{row.purchaseTimestamp.slice(0, 10)}<p className="text-slate-500">Matures {maturityDate(row)}</p></td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums">{exceptionAge(row.exceptionDetectedAt)}</td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums">{currency(row.faceValue)}</td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums">{currency(row.liquidationFaceValue)}</td>
                    <td className="px-4 py-3">{row.owner}<p className="text-xs text-slate-500">{row.slaHours}h SLA</p></td>
                    <td className="max-w-xs px-4 py-3 text-xs">{row.failureReason}</td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr><td colSpan={11} className="px-4 py-8 text-center text-slate-500">No exceptions match the current filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Selected: {selected.reference} · Purchased {timestampWAT(selected.purchaseTimestamp)} WAT
          </p>
        </section>
      )}

      {view === "repricing" && (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold text-slate-900 dark:text-white">Trade terms · {selected.reference}</h2>
            <p className="mt-1 text-xs text-slate-500">Original purchase terms remain unchanged; revised terms are scenario inputs.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {([
                ["faceValue", "Original face value (₦)"],
                ["originalRate", "Original annual rate (%)"],
                ["revisedRate", "Revised annual rate (%)"],
                ["tenorDays", "Original tenor (days)"],
                ["daysElapsed", "Days elapsed"],
                ["liquidationFaceValue", "Partial liquidation face value (₦)"],
              ] as [EditableTerm, string][]).map(([key, label]) => (
                <label key={key} className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                  {label}
                  <input
                    type="number"
                    min="0"
                    step={key.toLowerCase().includes("rate") ? "0.01" : "1000"}
                    value={terms[key]}
                    onChange={(event) => updateTerm(key, event.target.value)}
                    className={fieldClass}
                  />
                </label>
              ))}
              <label className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={includeAccruedInterest}
                  onChange={(event) =>
                    setIncludeAccruedInterest(event.target.checked)
                  }
                  className="mt-1"
                />
                Include illustrative simple accrued interest only if the instrument contract requires it
              </label>
              <label className="grid gap-1 text-sm text-slate-600 dark:text-slate-300 sm:col-span-2">
                Actual cash received (demo input, ₦)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={actualCashReceived}
                  onChange={(event) => setActualCashReceived(event.target.value)}
                  placeholder="Enter settlement cash received to calculate variance"
                  className={fieldClass}
                />
              </label>
              <label className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                Day-count basis
                <select
                  value={dayCountBasis}
                  onChange={(event) => setDayCountBasis(Number(event.target.value) as 360 | 365)}
                  className={fieldClass}
                >
                  <option value={365}>365-day basis</option>
                  <option value={360}>360-day basis</option>
                </select>
              </label>
            </div>
            <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Hardcoded discount-basis formulas: upfront discount = face × rate ×
              tenor ÷ day basis; discounted value = face × (1 − revised rate ×
              remaining days ÷ day basis). Confirm the contractual instrument
              convention before any real trade action. Original implied yield =
              (face − purchase cash) ÷ purchase cash × day basis ÷ tenor. Optional
              accrued interest = liquidated face × original rate × elapsed days
              ÷ day basis; it is shown separately and excluded from discount
              proceeds to avoid double counting.
            </p>
            {validationError && <p role="alert" className="mt-3 text-sm text-red-600">{validationError}</p>}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold text-slate-900 dark:text-white">Illustrative calculation</h2>
            {impact && (
              <dl className="mt-3 divide-y divide-slate-100 text-sm dark:divide-slate-800">
                {([
                  ["Remaining tenor", `${impact.remainingDays} days`],
                  ["Original upfront discount / inverse interest", currency(impact.originalDiscount)],
                  ["Purchase cash paid upfront", currency(impact.purchaseCash)],
                  ["Original implied yield", impact.originalImpliedYield === null ? "N/A" : `${impact.originalImpliedYield.toFixed(2)}%`],
                  ["Upfront payment allocated to liquidated portion", currency(impact.allocatedPurchaseCashLiquidated)],
                  ["Upfront payment allocated to residual position", currency(impact.allocatedPurchaseCashRemaining)],
                  ["Liquidation discount at revised rate", currency(impact.liquidationDiscount)],
                  ["Gross liquidation proceeds", currency(impact.liquidationProceeds)],
                  ["Accrued interest (separate scenario)", currency(impact.accruedInterest)],
                  ["Upfront payment recovered / actual cash received", impact.actualCashRecovered === null ? "Not entered" : currency(impact.actualCashRecovered)],
                  ["Settlement variance (expected − actual)", impact.settlementVariance === null ? "Not available until actual cash is entered" : currency(impact.settlementVariance)],
                  ["Remaining face value", currency(impact.remainingFaceValue)],
                  ["Remaining discounted value at revised rate", currency(impact.remainingDiscountedValue)],
                  ["Revised inverse interest", currency(impact.revisedInverseInterest)],
                  ["Implied inverse yield", impact.impliedInverseYield === null ? "N/A — no remaining position" : `${impact.impliedInverseYield.toFixed(2)}%`],
                  ["Illustrative realised P&L", currency(impact.realisedProfitLoss)],
                  ["Illustrative unrealised P&L", currency(impact.unrealisedProfitLoss)],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="text-right font-medium tabular-nums text-slate-900 dark:text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>
      )}

      {view === "execution" && (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.75fr)]">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold text-slate-900 dark:text-white">Recovery & liquidation · {selected.reference}</h2>
            <p className="mt-2 text-sm text-slate-500">Current workflow status: <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyle[selected.status]}`}>{selected.status}</span></p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Never retry a timeout until the actual position and any previous execution have been checked. Actions on this page are showcase-only and do not execute a trade.</p>

            {selected.status === "failed" && (
              <label className="mt-5 flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={verifiedBeforeRetry}
                  onChange={(event) => setVerifiedBeforeRetry(event.target.checked)}
                  className="mt-1"
                />
                I have verified the current position and checked for a prior execution before retrying.
              </label>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {selected.status === "failed" && (
                <button type="button" disabled={!verifiedBeforeRetry} onClick={() => transition("pending approval", "Failed-trade position verified; submitted for approval (demo)")} className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">Request approval (demo)</button>
              )}
              {selected.status === "pending approval" && (
                <>
                  <button type="button" onClick={() => transition("approved", "Repricing approved by checker (demo)")} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white">Approve repricing (demo)</button>
                  <button type="button" onClick={() => transition("rejected", "Repricing rejected by checker (demo)")} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white">Reject (demo)</button>
                </>
              )}
              {selected.status === "approved" && (
                <button type="button" onClick={() => transition("execution pending", "Liquidation instruction submitted (demo)")} className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white">Simulate execution</button>
              )}
              {selected.status === "execution pending" && (
                <button type="button" onClick={() => transition("settlement pending", "Execution reference recorded (demo); awaiting settlement")} className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white">Record execution reference (demo)</button>
              )}
              {selected.status === "settlement pending" && (
                <button type="button" onClick={() => transition("partially liquidated", "Settlement confirmed (demo); residual position updated")} className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white">Confirm settlement (demo)</button>
              )}
              {selected.status === "partially liquidated" && (
                <button type="button" onClick={() => transition("reconciled", "Cash and securities reconciled (demo)")} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white">Mark reconciled (demo)</button>
              )}
              {(selected.status === "reconciled" || selected.status === "rejected") && (
                <p className="text-sm text-slate-500">This sample case is closed. Start a new case through the configured production workflow.</p>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-white">Control checklist</h3>
            <ul className="mt-3 list-inside list-decimal space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Detect and classify the exception.</li>
              <li>Reconcile actual cash, securities and prior executions.</li>
              <li>Preview the proposed liquidation and residual valuation.</li>
              <li>Obtain maker-checker approval before execution.</li>
              <li>Capture execution and settlement references.</li>
              <li>Reconcile cash and securities before closing.</li>
            </ul>
            <p className="mt-4 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700">
              Production requires authenticated roles, separated maker/checker identities, idempotent execution, timestamped service events and ledger/custody integrations.
            </p>
          </div>
        </section>
      )}

      {view === "audit" && (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.75fr)]">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold text-slate-900 dark:text-white">Purchase-to-liquidation event history</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr><th className="py-2 pr-3">Timestamp (WAT)</th><th className="py-2 pr-3">Reference</th><th className="py-2 pr-3">Event</th><th className="py-2">Actor</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {events.map((event, index) => (
                    <tr key={`${event.reference}-${event.timestamp}-${index}`}>
                      <td className="whitespace-nowrap py-3 pr-3 text-xs text-slate-500">{timestampWAT(event.timestamp)}</td>
                      <td className="whitespace-nowrap py-3 pr-3">{event.reference}</td>
                      <td className="py-3 pr-3">{event.action}</td>
                      <td className="whitespace-nowrap py-3 text-slate-500">{event.actor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-white">Selected trade timestamps</h3>
            <dl className="mt-3 space-y-3 text-sm">
              {[
                ["Purchase", selected.purchaseTimestamp],
                ["Rate effective", "Not recorded in sample"],
                ["Liquidation requested", "Not recorded in sample"],
                ["Approval", "Not recorded in sample"],
                ["Execution", "Not recorded in sample"],
                ["Settlement", "Not recorded in sample"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="text-right">{value === selected.purchaseTimestamp ? `${timestampWAT(value)} WAT` : value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700">
              Production timestamps must be recorded by the server in UTC and displayed in WAT; an operator must not be able to backdate execution.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
