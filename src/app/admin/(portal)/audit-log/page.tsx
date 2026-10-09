"use client";

import { useMemo, useState } from "react";
import { AuditEntry } from "@/lib/admin/mock-data";
import { useAdminStore } from "@/lib/admin/store";
import { formatDateTime } from "@/lib/admin/utils";
import { Column, DataTable } from "@/components/admin/data-table";
import { PageHeader, SearchInput } from "@/components/admin/ui";

const columns: Column<AuditEntry>[] = [
  { key: "time", header: "Time (UTC)", sortValue: (a) => a.timestamp, render: (a) => formatDateTime(a.timestamp) },
  { key: "actor", header: "Admin", sortValue: (a) => a.actor, render: (a) => a.actor },
  { key: "action", header: "Action", sortValue: (a) => a.action, render: (a) => a.action },
  { key: "target", header: "Target", sortValue: (a) => a.target, render: (a) => a.target },
];

export default function AuditLogPage() {
  const audit = useAdminStore((s) => s.audit);
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? audit.filter((a) => [a.actor, a.action, a.target].some((v) => v.toLowerCase().includes(q)))
      : audit;
  }, [audit, search]);

  return (
    <>
      <PageHeader
        title="Audit log"
        description="Admin actions in this demo session are recorded here."
        actions={<SearchInput value={search} onChange={setSearch} placeholder="Search audit log" />}
      />
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(a) => a.id}
        initialSort={{ key: "time", dir: "desc" }}
      />
    </>
  );
}
