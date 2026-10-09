import { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
