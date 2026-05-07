import { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { InsurancePolicyApiItem } from "@/types/insurance";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Car,
  CreditCard,
  Download,
  Eye,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface InsurancePolicyTableActions {
  handleView: (id: string | number) => void;
  handleDownload: (policy: InsurancePolicyApiItem) => void;
  handleEdit: (id: string | number) => void;
  handleDelete: (policy: InsurancePolicyApiItem) => void;
  handlePayNow: (policy: InsurancePolicyApiItem) => void;
  handlePayAgain: (policy: InsurancePolicyApiItem) => void;
  downloadingPolicyId?: string | null;
  deletingPolicyId?: string | null;
  isDownloading?: boolean;
  isDeleting?: boolean;
}

interface ActionButton {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusPillClassName = (status: InsurancePolicyApiItem["status"]) => {
  if (status === "active" || status === "issued") {
    return "text-txt-success bg-bg-success-light";
  }

  if (status === "expired" || status === "payment_failed") {
    return "text-txt-danger bg-bg-danger-light";
  }

  if (
    status === "pending" ||
    status === "awaiting_payment_process" ||
    status === "upcoming"
  ) {
    return "text-txt-warning bg-bg-warning-light";
  }

  return "bg-bg-tertiary text-txt-primary";
};

export const getInsurancePolicyColumns = ({
  handleView,
  handleDownload,
  handleEdit,
  handleDelete,
  handlePayNow,
  handlePayAgain,
  downloadingPolicyId,
  deletingPolicyId,
  isDownloading,
  isDeleting,
}: InsurancePolicyTableActions): ColumnDef<InsurancePolicyApiItem>[] => [
  {
    accessorKey: "policyholder",
    header: "Name",
    cell: ({ row }) => {
      const {
        insurance_policy_payload,
        insurance_policy_type_snapshot,
        policy_number,
      } = row.original;
      const firstName =
        insurance_policy_payload?.policyholder?.first_name ?? "";
      const lastName = insurance_policy_payload?.policyholder?.last_name ?? "";
      const fullName =
        `${firstName} ${lastName}`.trim() || "Unnamed policyholder";
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center shrink-0">
            {insurance_policy_type_snapshot?.kind?.toLowerCase() ===
            "private" ? (
              <Car size={20} className="text-txt-secondary" />
            ) : (
              <Building2 size={20} className="text-txt-secondary" />
            )}
          </div>
          <div>
            <p className="font-semibold text-txt-primary">{fullName}</p>
            <p className="text-[11px] text-txt-secondary">
              {policy_number || `Policy #${row.original.id}`}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "vehicle",
    header: "Vehicle",
    cell: ({ row }) => {
      const vehicle = row.original.insurance_policy_payload?.vehicle;
      return (
        <div>
          <p className="text-txt-primary">{vehicle?.vehicle_make || "-"}</p>
          <p className="text-[11px] text-txt-secondary">
            {vehicle?.license_number || "-"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "premium",
    header: "Premium",
    cell: ({ row }) => {
      const amount = row.original.insurance_policy_type_snapshot?.premium;
      return (
        <p className="font-medium text-txt-primary">
          ₦ {Number(amount || 0).toLocaleString()}
        </p>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: "Valid Period",
    cell: ({ row }) => {
      const { start_date, end_date } = row.original;
      return (
        <div>
          <p className="text-txt-primary">{formatDate(start_date)}</p>
          <p className="text-[11px] text-txt-secondary">
            to {formatDate(end_date)}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;
      return (
        <div
          className={cn(
            "capitalize w-fit flex items-center gap-1 rounded-[6px] py-0.5 px-2 font-medium",
            getStatusPillClassName(status),
          )}
        >
          {status}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, status } = row.original;

      const isCurrentPolicyDownloading =
        isDownloading && downloadingPolicyId === String(id);
      const isCurrentPolicyDeleting =
        isDeleting && deletingPolicyId === String(id);

      const actionButtons: ActionButton[] =
        status === "draft"
          ? [
              {
                key: "edit",
                label: "Edit",
                icon: <Pencil size={16} />,
                onClick: () => handleEdit(id),
              },
              {
                key: "pay-now",
                label: "Pay now",
                icon: <CreditCard size={16} />,
                onClick: () => handlePayNow(row.original),
              },
              {
                key: "delete",
                label: isCurrentPolicyDeleting ? "Deleting..." : "Delete",
                icon: <Trash2 size={16} />,
                onClick: () => handleDelete(row.original),
                disabled: isDeleting,
                loading: isCurrentPolicyDeleting,
                className: "text-txt-danger hover:text-txt-danger",
              },
              {
                key: "view",
                label: "View",
                icon: <Eye size={16} />,
                onClick: () => handleView(id),
              },
            ]
          : status === "payment_failed" || status === "awaiting_payment_process"
            ? [
                {
                  key: "pay-again",
                  label: "Pay again",
                  icon: <RotateCcw size={16} />,
                  onClick: () => handlePayAgain(row.original),
                },
              ]
            : status === "issued" || status === "active" || status === "expired"
              ? [
                  {
                    key: "download",
                    label: isCurrentPolicyDownloading
                      ? "Downloading..."
                      : "Download",
                    icon: <Download size={16} />,
                    onClick: () => handleDownload(row.original),
                    disabled: isDownloading,
                    loading: isCurrentPolicyDownloading,
                  },
                  {
                    key: "view",
                    label: "View",
                    icon: <Eye size={16} />,
                    onClick: () => handleView(id),
                  },
                ]
              : [
                  {
                    key: "view",
                    label: "View",
                    icon: <Eye size={16} />,
                    onClick: () => handleView(id),
                  },
                ];

      return (
        <div className="flex items-center gap-2 justify-end">
          {actionButtons.map((action) => (
            <Tooltip key={action.key}>
              <TooltipTrigger asChild>
                <Button
                  onClick={action.onClick}
                  size="icon"
                  variant="ghost"
                  className={cn("w-8 h-8", action.className)}
                  aria-label={action.label}
                  disabled={action.disabled}
                  loading={action.loading}
                >
                  {action.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>{action.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      );
    },
  },
];
