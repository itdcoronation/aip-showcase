import { ColumnDef } from "@tanstack/react-table";
import {
  EquityHistoryTableData,
  EquityTableData,
  PendingEquityTableData,
} from "@/types/equity";
import { Button } from "@/components/ui/button";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface EquityTableActions {
  handleView: (id: string) => void;
  handleCancel: (id: string) => void;
  type: "trade" | "pending" | "history";
}

export const getEquityTableColumns = ({
  handleView,
  handleCancel,
  type,
}: EquityTableActions): ColumnDef<
  EquityTableData | PendingEquityTableData | EquityHistoryTableData
>[] => {
  let columns: ColumnDef<
    EquityTableData | PendingEquityTableData | EquityHistoryTableData
  >[] = [];

  switch (type) {
    case "trade":
      columns = [
        {
          accessorKey: "name",
          header: "Name",

          cell: ({ row }) => {
            const { name, short_form, logo } = row.original as EquityTableData;
            return (
              <div className="flex gap-2 items-center">
                <div className="bg-bg-secondary rounded-full p-1 w-[40px] h-[40px] flex items-center justify-center">
                  <Image
                    className="w-[26px] h-[26px]"
                    width={26}
                    height={26}
                    src={logo}
                    alt={`${name} logo`}
                  />
                </div>
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-[11px]">{short_form}</p>
                </div>
              </div>
            );
          },
        },
        {
          accessorKey: "purchase-price",
          header: () => <div className="text-right">Purchase price</div>,
          cell: ({ row }) => {
            const { purchase_price } = row.original as EquityTableData;
            return (
              <div className="flex gap-2 text-right justify-end font-medium">
                ₦ {purchase_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            );
          },
        },
        {
          accessorKey: "current-price",
          header: () => <div className="text-right">Current price</div>,
          cell: ({ row }) => {
            const { curent_price } = row.original as EquityTableData;
            return (
              <div className="flex gap-2 text-right justify-end font-medium">
                ₦ {curent_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            );
          },
        },
        {
          accessorKey: "amount-invested",
          header: () => <div className="text-right">Amount invested</div>,
          cell: ({ row }) => {
            const { amount_invested } = row.original as EquityTableData;
            return (
              <div className="flex gap-2 text-right justify-end font-medium">
                ₦ {amount_invested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            );
          },
        },
        {
          accessorKey: "units-held",
          header: () => <div className="text-right">Units held</div>,
          cell: ({ row }) => {
            const { units_held } = row.original as EquityTableData;
            return (
              <div className="flex items-center gap-2 justify-end">
                {units_held.toLocaleString('en-US')}
              </div>
            );
          },
        },
        {
          accessorKey: "current-value",
          header: () => <div className="text-right">Current value</div>,
          cell: ({ row }) => {
            const { current_value, value_change } =
              row.original as EquityTableData;
            return (
              <div className="flex items-center gap-2 justify-end font-medium">
                ₦ {current_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                <span
                  className={
                    value_change >= 0 ? "text-txt-success" : "text-txt-danger"
                  }
                >
                  {value_change >= 0 ? "+" : "-"} {Math.abs(value_change).toFixed(2)}%
                </span>
              </div>
            );
          },
        },
        {
          accessorKey: "gain-loss",
          header: () => <div className="text-right">Total gain/loss</div>,
          cell: ({ row }) => {
            const { gain_loss } = row.original as EquityTableData;
            return <div className="text-right">{gain_loss}</div>;
          },
        },
        {
          id: "actions",
          cell: ({ row }) => {
            const { id } = row.original as EquityTableData;
            return (
              <Button
                onClick={() => handleView(id)}
                className="h-7 w-7 ml-auto flex"
                size="icon"
                variant="outline"
              >
                <ChevronRight color="#141415" />
              </Button>
            );
          },
        },
      ];

      break;
    case "pending":
      columns = [
        {
          accessorKey: "name",
          header: "Name",
          cell: ({ row }) => {
            const { name, short_form, logo } =
              row.original as PendingEquityTableData;
            return (
              <div className="flex gap-2 items-center">
                <div className="bg-bg-secondary rounded-full p-1 w-[40px] h-[40px] flex items-center justify-center">
                  <Image
                    className="w-[26px] h-[26px]"
                    width={26}
                    height={26}
                    src={logo}
                    alt={`${name} logo`}
                  />
                </div>
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-[11px]">{short_form}</p>
                </div>
              </div>
            );
          },
        },
        {
          accessorKey: "txn-date",
          header: "Transaction date",
          cell: ({ row }) => {
            const { txn_date } = row.original as PendingEquityTableData;
            return (
              <div className="flex gap-2 text-left font-medium">{txn_date}</div>
            );
          },
        },
        {
          accessorKey: "txn-amt",
          header: () => <div className="text-right">Quote price</div>,
          cell: ({ row }) => {
            const { txn_amount } = row.original as PendingEquityTableData;
            return (
              <div className="flex gap-2 text-right justify-end font-medium">
                ₦ {txn_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            );
          },
        },
        {
          accessorKey: "units",
          header: () => <div className="text-right">Units</div>,
          cell: ({ row }) => {
            const { units } = row.original as PendingEquityTableData;
            return (
              <div className="flex items-center gap-2 justify-end">
                {units.toLocaleString('en-US')}
              </div>
            );
          },
        },
        {
          accessorKey: "txn-type",
          header: () => <div className="text-left">Transaction type</div>,
          cell: ({ row }) => {
            const { txn_type } = row.original as PendingEquityTableData;
            return (
              <div className="capitalize w-fit flex items-center gap-1 rounded-[6px] bg-bg-tertiary py-0.5 px-2 text-txt-primary font-medium">
                {txn_type === "buy" ? (
                  <ArrowDownLeft size={16} />
                ) : (
                  <ArrowUpRight size={16} />
                )}
                {txn_type}
              </div>
            );
          },
        },

        {
          id: "actions",
          cell: ({ row }) => {
            const { id } = row.original as PendingEquityTableData;
            return (
              <Button
                onClick={() => handleCancel(id)}
                className="border-stroke-primary ml-auto flex"
                size="sm"
                variant="outline"
              >
                Cancel <XCircle />
              </Button>
            );
          },
        },
      ];
      break;
    case "history":
      columns = [
        {
          accessorKey: "name",
          header: "Name",
          cell: ({ row }) => {
            const { name, short_form, logo } =
              row.original as EquityHistoryTableData;
            return (
              <div className="flex gap-2 items-center">
                <div className="bg-bg-secondary rounded-full p-1 w-[40px] h-[40px] flex items-center justify-center">
                  <Image
                    className="w-[26px] h-[26px]"
                    width={26}
                    height={26}
                    src={logo}
                    alt={`${name} logo`}
                  />
                </div>
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-[11px]">{short_form}</p>
                </div>
              </div>
            );
          },
        },
        {
          accessorKey: "txn-date",
          header: "Transaction date",
          cell: ({ row }) => {
            const { txn_date } = row.original as EquityHistoryTableData;
            return (
              <div className="flex gap-2 text-left font-medium">{txn_date}</div>
            );
          },
        },
        {
          accessorKey: "txn-amt",
          header: () => <div className="text-right">Transaction amount</div>,
          cell: ({ row }) => {
            const { txn_amount } = row.original as EquityHistoryTableData;
            return (
              <div className="flex gap-2 text-right justify-end font-medium">
                ₦ {txn_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            );
          },
        },
        {
          accessorKey: "unit-price",
          header: () => <div className="text-right">Unit price</div>,
          cell: ({ row }) => {
            const { unit_price } = row.original as EquityHistoryTableData;
            return (
              <div className="flex gap-2 text-right justify-end font-medium">
                ₦ {unit_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            );
          },
        },
        {
          accessorKey: "units",
          header: () => <div className="text-right">Units</div>,
          cell: ({ row }) => {
            const { units } = row.original as EquityHistoryTableData;
            return (
              <div className="flex items-center gap-2 justify-end">
                {units.toLocaleString('en-US')}
              </div>
            );
          },
        },
        {
          accessorKey: "txn-type",
          header: () => <div className="text-left">Transaction type</div>,
          cell: ({ row }) => {
            const { txn_type } = row.original as EquityHistoryTableData;
            return (
              <div className="capitalize w-fit flex items-center gap-1 rounded-[6px] bg-bg-tertiary py-0.5 px-2 text-txt-primary font-medium">
                {txn_type === "buy" ? (
                  <ArrowDownLeft size={16} />
                ) : (
                  <ArrowUpRight size={16} />
                )}
                {txn_type}
              </div>
            );
          },
        },
        {
          accessorKey: "txn-status",
          header: "Transaction status",
          cell: ({ row }) => {
            const { status } = row.original as EquityHistoryTableData;
            return (
              <div
                className={cn(
                  "capitalize w-fit flex items-center gap-1 rounded-[6px] py-0.5 px-2 font-medium",
                  status === "successful"
                    ? "text-txt-success bg-bg-success-light"
                    : status === "failed"
                    ? "text-txt-danger bg-bg-danger-light"
                    : "bg-bg-tertiary text-txt-primary"
                )}
              >
                {status}
              </div>
            );
          },
        },
      ];
      break;
    default:
      break;
  }

  return columns;
};
