import { ColumnDef } from "@tanstack/react-table";
import {
  FundHistoryTableData,
  CompletedFundTableData,
  PendingFundTableData,
} from "@/types/mutual-fund";
import { Button } from "@/components/ui/button";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  XCircle,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getCurrencySymbol } from "@/lib/currency-mapping";
import { checkRedeemAvailability } from "@/lib/fund-restrictions";

export interface MutualFundTableActions {
  handleView: (id: string) => void;
  handleCancel: (id: string) => void;
  handleRedeemRestriction?: (message: string) => void;
  type: "active" | "pending" | "history";
}

export const getMutualFundTableColumns = ({
  handleView,
  handleCancel,
  handleRedeemRestriction,
  type,
}: MutualFundTableActions): ColumnDef<
  CompletedFundTableData | PendingFundTableData | FundHistoryTableData
>[] => {
  let columns: ColumnDef<
    CompletedFundTableData | PendingFundTableData | FundHistoryTableData
  >[] = [];

  switch (type) {
    case "active":
      columns = [
        {
          accessorKey: "name",
          header: "Name",

          cell: ({ row }) => {
            const { name, short_form, logo } =
              row.original as CompletedFundTableData;
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
          accessorKey: "current-value",
          header: () => <div className="text-right">Current value</div>,
          cell: ({ row }) => {
            const { current_value, short_form } =
              row.original as CompletedFundTableData;
            const currencySymbol = getCurrencySymbol(short_form);
            return (
              <div className="flex items-center justify-end text-center">
                {/* <div className="flex items-center gap-2 justify-end text-right"> */}
                {currencySymbol} {current_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                {/* <span
                  className={
                    value_change >= 0 ? "text-txt-success" : "text-txt-danger"
                  }
                >
                  {value_change >= 0 ? "+" : "-"} {Math.abs(value_change)}%
                </span> */}
              </div>
            );
          },
        },
        // {
        //   accessorKey: "est-yield",
        //   header: "Estimated yield",
        //   cell: ({ row }) => {
        //     const { est_yield } = row.original as CompletedFundTableData;
        //     return (
        //       <div
        //         className={
        //           est_yield >= 0 ? "text-txt-success" : "text-txt-danger"
        //         }
        //       >
        //         {est_yield}%
        //       </div>
        //     );
        //   },
        // },
        // {
        //   accessorKey: "txn-date",
        //   header: "Transaction date",
        //   cell: ({ row }) => {
        //     const { txn_date } = row.original as CompletedFundTableData;
        //     return (
        //       <div className="flex gap-2 text-left font-medium">{txn_date}</div>
        //     );
        //   },
        // },
        {
          id: "invest-more",
          header: "",
          cell: ({ row }) => {
            const { short_form } = row.original as CompletedFundTableData;
            return (
              <Button
                onClick={() => {
                  // Navigate to invest page for this fund
                  window.location.href = `/mutual-funds/${short_form}/invest`;
                }}
                size="m"
                variant="secondary"
              >
                Top up
                <PlusCircle />
              </Button>
            );
          },
        },
        {
          id: "redeem",
          header: "",
          cell: ({ row }) => {
            const { short_form, name } = row.original as CompletedFundTableData;
            
            const handleRedeem = () => {
              // Check if redeem is restricted for this fund
              const redeemCheck = checkRedeemAvailability(short_form, name);
              
              if (!redeemCheck.isAvailable && redeemCheck.message) {
                // Show restriction notice modal if handler is provided
                if (handleRedeemRestriction) {
                  handleRedeemRestriction(redeemCheck.message);
                  return;
                }
              }
              
              // Navigate to redeem page if not restricted
              window.location.href = `/mutual-funds/${short_form}/redeem`;
            };

            return (
              <Button
                onClick={handleRedeem}
                size="m"
              >
                Redeem
                <TrendingUp />
              </Button>
            );
          },
        },
        {
          id: "actions",
          cell: ({ row }) => {
            const { id } = row.original as CompletedFundTableData;
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
              row.original as PendingFundTableData;
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
            const { txn_date } = row.original as PendingFundTableData;
            return (
              <div className="flex gap-2 text-left font-medium">{txn_date}</div>
            );
          },
        },
        {
          accessorKey: "txn-amt",
          header: "Transaction amount",
          cell: ({ row }) => {
            const { txn_amount } = row.original as PendingFundTableData;
            return (
              <div className="flex gap-2 text-left font-medium">
                ₦ {txn_amount}
              </div>
            );
          },
        },
        {
          accessorKey: "est-yield",
          header: "Estimated yield",
          cell: ({ row }) => {
            const { est_yield } = row.original as PendingFundTableData;
            return (
              <div
                className={
                  est_yield >= 0 ? "text-txt-success" : "text-txt-danger"
                }
              >
                {est_yield}%
              </div>
            );
          },
        },
        {
          accessorKey: "txn-type",
          header: "Transaction type",
          cell: ({ row }) => {
            const { txn_type } = row.original as PendingFundTableData;
            return (
              <div className="capitalize w-fit flex items-center gap-1 rounded-[6px] bg-bg-tertiary py-0.5 px-2 text-txt-primary font-medium">
                {txn_type === "invest" ? (
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
            const { id } = row.original as PendingFundTableData;
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
              row.original as FundHistoryTableData;
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
            const { txn_date } = row.original as FundHistoryTableData;
            return (
              <div className="flex gap-2 text-left font-medium">{txn_date}</div>
            );
          },
        },
        {
          accessorKey: "txn-amt",
          header: "Transaction amount",
          cell: ({ row }) => {
            const { txn_amount } = row.original as FundHistoryTableData;
            return (
              <div className="flex gap-2 text-left font-medium">
                ₦ {txn_amount}
              </div>
            );
          },
        },
        {
          accessorKey: "est-yield",
          header: "Estimated yield",
          cell: ({ row }) => {
            const { est_yield } = row.original as FundHistoryTableData;
            return (
              <div
                className={
                  est_yield >= 0 ? "text-txt-success" : "text-txt-danger"
                }
              >
                {est_yield}%
              </div>
            );
          },
        },
        {
          accessorKey: "txn-type",
          header: "Transaction type",
          cell: ({ row }) => {
            const { txn_type } = row.original as FundHistoryTableData;
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
            const { status } = row.original as FundHistoryTableData;
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
