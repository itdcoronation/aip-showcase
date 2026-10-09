export type ProductKey =
  | "fixed-income"
  | "mutual-funds"
  | "equities"
  | "insurance";

export type TxType = "investment" | "upfront" | "partial-withdrawal" | "withdrawal";
export type TxStatus = "completed" | "pending" | "failed" | "rejected";

export interface ProductConfig {
  key: ProductKey;
  label: string;
  upfrontApplicable: boolean;
  labels: {
    invested: string;
    upfront: string;
    partialWithdrawal: string;
    withdrawal: string;
  };
}

const standardLabels = {
  invested: "Total amount invested",
  upfront: "Total paid upfront",
  partialWithdrawal: "Total partial withdrawal",
  withdrawal: "Total withdrawal",
};

export const PRODUCTS: ProductConfig[] = [
  { key: "fixed-income", label: "Fixed Income", upfrontApplicable: true, labels: standardLabels },
  { key: "mutual-funds", label: "Mutual Funds", upfrontApplicable: false, labels: standardLabels },
  { key: "equities", label: "Equities", upfrontApplicable: false, labels: standardLabels },
  {
    key: "insurance",
    label: "Insurance",
    upfrontApplicable: true,
    labels: {
      invested: "Total premiums paid",
      upfront: "Total paid upfront",
      partialWithdrawal: "Total partial claims/refunds",
      withdrawal: "Total cancellations/refunds",
    },
  },
];

export const getProduct = (key: ProductKey) =>
  PRODUCTS.find((p) => p.key === key) as ProductConfig;

export const TX_TYPE_LABELS: Record<TxType, string> = {
  investment: "Investment",
  upfront: "Upfront payment",
  "partial-withdrawal": "Partial withdrawal",
  withdrawal: "Withdrawal",
};

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  kyc: "verified" | "pending" | "rejected";
  joinedAt: string;
}

export interface AdminTransaction {
  id: string;
  reference: string;
  customerId: string;
  product: ProductKey;
  type: TxType;
  amount: number;
  status: TxStatus;
  date: string;
  discountedValue?: number | null;
  remainingAmount?: number | null;
  interestReversal?: number | null;
  purchasedAt?: string | null;
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface Metrics {
  invested: number;
  upfront: number;
  partialWithdrawal: number;
  withdrawal: number;
}

export interface CustomerRow extends Metrics {
  customer: AdminCustomer;
  txCount: number;
  lastActivity: string;
}

// Fixed anchor so the generated data and the date presets stay consistent.
export const REFERENCE_DATE = new Date("2026-10-09T12:00:00Z");
const DAY = 86_400_000;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = [
  "Adaeze", "Tunde", "Chioma", "Ibrahim", "Ngozi", "Emeka", "Funke", "Yusuf",
  "Amaka", "Segun", "Halima", "Chinedu", "Bisi", "Olumide", "Zainab", "Kelechi",
  "Tolu", "Aisha", "Uche", "Femi",
];
const LAST = [
  "Okafor", "Adeyemi", "Bello", "Nwosu", "Balogun", "Ogunleye", "Eze",
  "Abubakar", "Afolabi", "Chukwu", "Danjuma", "Ikenna", "Lawal", "Obi",
  "Salami", "Williams",
];

const PRODUCT_RANGE: Record<ProductKey, [number, number]> = {
  "fixed-income": [500_000, 20_000_000],
  "mutual-funds": [100_000, 5_000_000],
  equities: [50_000, 3_000_000],
  insurance: [20_000, 600_000],
};

const round = (n: number, step = 1000) => Math.max(step, Math.round(n / step) * step);

export function generateCustomers(count = 48): AdminCustomer[] {
  const rand = mulberry32(7);
  return Array.from({ length: count }, (_, i) => {
    const first = FIRST[i % FIRST.length];
    const last = LAST[Math.floor(rand() * LAST.length)];
    const r = rand();
    return {
      id: `CUS-${String(1001 + i)}`,
      name: `${first} ${last}`,
      email: `${first}.${last}${i}@example.com`.toLowerCase(),
      phone: `+23480${String(Math.floor(rand() * 1e8)).padStart(8, "0")}`,
      kyc: r < 0.82 ? "verified" : r < 0.94 ? "pending" : "rejected",
      joinedAt: new Date(
        REFERENCE_DATE.getTime() - (200 + rand() * 500) * DAY
      ).toISOString(),
    };
  });
}

export function generateTransactions(customers: AdminCustomer[]): AdminTransaction[] {
  const rand = mulberry32(42);
  const txs: AdminTransaction[] = [];
  let seq = 1;

  const pickStatus = (withdrawal: boolean): TxStatus => {
    const r = rand();
    if (withdrawal) return r < 0.7 ? "completed" : r < 0.95 ? "pending" : "rejected";
    return r < 0.9 ? "completed" : r < 0.96 ? "pending" : "failed";
  };

  const push = (
    customerId: string,
    product: ProductKey,
    type: TxType,
    amount: number,
    date: number
  ) => {
    const isWithdrawal = type === "withdrawal" || type === "partial-withdrawal";
    txs.push({
      id: `TX-${String(seq).padStart(5, "0")}`,
      reference: `REF${Math.floor(rand() * 9e8 + 1e8)}`,
      customerId,
      product,
      type,
      amount,
      status: pickStatus(isWithdrawal),
      date: new Date(date).toISOString(),
    });
    seq += 1;
  };

  for (const c of customers) {
    for (const p of PRODUCTS) {
      if (rand() > 0.55) continue;
      const [min, max] = PRODUCT_RANGE[p.key];
      const nInv = 1 + Math.floor(rand() * 4);
      const dates: number[] = [];
      let total = 0;
      for (let i = 0; i < nInv; i++) {
        const amount = round(min + rand() * (max - min) * 0.5);
        const date = REFERENCE_DATE.getTime() - rand() * 360 * DAY;
        dates.push(date);
        total += amount;
        push(c.id, p.key, "investment", amount, date);
      }
      const first = Math.min(...dates);
      const after = () => first + rand() * (REFERENCE_DATE.getTime() - first);

      if (p.upfrontApplicable && rand() < 0.6) {
        push(c.id, p.key, "upfront", round(total * (0.05 + rand() * 0.1)), first);
      }
      if (rand() < 0.35) {
        push(c.id, p.key, "partial-withdrawal", round(total * (0.05 + rand() * 0.2)), after());
      }
      if (rand() < 0.2) {
        push(c.id, p.key, "withdrawal", round(total * (0.3 + rand() * 0.3)), after());
      }
    }
  }
  return txs.sort((a, b) => b.date.localeCompare(a.date));
}

export function generateAuditLog(): AuditEntry[] {
  const rand = mulberry32(99);
  const actions: [string, string][] = [
    ["Approved withdrawal", "TX-000"],
    ["Rejected withdrawal", "TX-000"],
    ["Exported monitoring report", "Fixed Income"],
    ["Exported monitoring report", "Mutual Funds"],
    ["Viewed customer profile", "CUS-10"],
    ["Updated KYC status", "CUS-10"],
  ];
  const actors = ["ops.lead@coronation.test", "compliance@coronation.test", "admin@coronation.test"];
  return Array.from({ length: 30 }, (_, i) => {
    const [action, target] = actions[Math.floor(rand() * actions.length)];
    const suffix = /\d$/.test(target) ? String(Math.floor(rand() * 90) + 10) : "";
    return {
      id: `AUD-${String(i + 1).padStart(4, "0")}`,
      actor: actors[Math.floor(rand() * actors.length)],
      action,
      target: `${target}${suffix}`,
      timestamp: new Date(
        REFERENCE_DATE.getTime() - (i * 0.4 + rand() * 0.3) * DAY
      ).toISOString(),
    };
  });
}

export const emptyMetrics = (): Metrics => ({
  invested: 0,
  upfront: 0,
  partialWithdrawal: 0,
  withdrawal: 0,
});

function addTo(m: Metrics, tx: AdminTransaction) {
  if (tx.type === "investment") m.invested += tx.amount;
  else if (tx.type === "upfront") m.upfront += tx.amount;
  else if (tx.type === "partial-withdrawal") m.partialWithdrawal += tx.amount;
  else m.withdrawal += tx.amount;
}

export function summarize(txs: AdminTransaction[]): Metrics {
  const m = emptyMetrics();
  txs.forEach((t) => addTo(m, t));
  return m;
}

export function breakdownByCustomer(
  txs: AdminTransaction[],
  customers: AdminCustomer[]
): CustomerRow[] {
  const byId = new Map(customers.map((c) => [c.id, c]));
  const rows = new Map<string, CustomerRow>();
  for (const tx of txs) {
    const customer = byId.get(tx.customerId);
    if (!customer) continue;
    let row = rows.get(tx.customerId);
    if (!row) {
      row = { customer, ...emptyMetrics(), txCount: 0, lastActivity: tx.date };
      rows.set(tx.customerId, row);
    }
    addTo(row, tx);
    row.txCount += 1;
    if (tx.date > row.lastActivity) row.lastActivity = tx.date;
  }
  return [...rows.values()];
}

export type RangePreset = "30d" | "90d" | "12m" | "all" | "custom";

export interface DateRangeValue {
  preset: RangePreset;
  from: string;
  to: string;
}

export const DEFAULT_RANGE: DateRangeValue = { preset: "all", from: "", to: "" };

export function resolveRange(v: DateRangeValue): { from: number; to: number } {
  const end = REFERENCE_DATE.getTime();
  switch (v.preset) {
    case "30d":
      return { from: end - 30 * DAY, to: end };
    case "90d":
      return { from: end - 90 * DAY, to: end };
    case "12m":
      return { from: end - 365 * DAY, to: end };
    case "custom":
      return {
        from: v.from ? new Date(`${v.from}T00:00:00`).getTime() : -Infinity,
        to: v.to ? new Date(`${v.to}T23:59:59`).getTime() : Infinity,
      };
    default:
      return { from: -Infinity, to: Infinity };
  }
}

export function inRange(tx: AdminTransaction, range: DateRangeValue) {
  const { from, to } = resolveRange(range);
  const t = new Date(tx.date).getTime();
  return t >= from && t <= to;
}
