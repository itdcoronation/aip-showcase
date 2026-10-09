import { create } from "zustand";
import {
  AdminCustomer,
  AdminTransaction,
  AuditEntry,
  generateAuditLog,
  generateCustomers,
  generateTransactions,
} from "./mock-data";

interface AdminState {
  customers: AdminCustomer[];
  transactions: AdminTransaction[];
  audit: AuditEntry[];
  log: (actor: string, action: string, target: string) => void;
  resolveWithdrawal: (id: string, approve: boolean, actor: string) => void;
}

const customers = generateCustomers();

const entry = (
  n: number,
  actor: string,
  action: string,
  target: string
): AuditEntry => ({
  id: `AUD-${String(n + 1).padStart(4, "0")}`,
  actor,
  action,
  target,
  timestamp: new Date().toISOString(),
});

export const useAdminStore = create<AdminState>((set) => ({
  customers,
  transactions: generateTransactions(customers),
  audit: generateAuditLog(),
  log: (actor, action, target) =>
    set((s) => ({ audit: [entry(s.audit.length, actor, action, target), ...s.audit] })),
  resolveWithdrawal: (id, approve, actor) =>
    set((s) => ({
      transactions: s.transactions.map((t) =>
        t.id === id ? { ...t, status: approve ? "completed" : "rejected" } : t
      ),
      audit: [
        entry(s.audit.length, actor, approve ? "Approved withdrawal" : "Rejected withdrawal", id),
        ...s.audit,
      ],
    })),
}));
