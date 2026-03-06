import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  TradesFixedIncomeTableData,
  RequestsFixedIncomeTableData,
  FixedIncomeHistoryTableData,
} from "@/types/fixed-income";

export interface FixedIncomeActions {
  handleView: (id: string) => void;
  type: "trades" | "requests" | "history";
}

export const getFixedIncomeColumns = ({
  handleView,
  type,
}: FixedIncomeActions): ColumnDef<
  | TradesFixedIncomeTableData
  | RequestsFixedIncomeTableData
  | FixedIncomeHistoryTableData
>[] => {
  let columns: ColumnDef<
    | TradesFixedIncomeTableData
    | RequestsFixedIncomeTableData
    | FixedIncomeHistoryTableData
  >[] = [];

  switch (type) {
    case "trades":
      columns = [
        {
          accessorKey: "name",
          header: "Name",

          cell: ({ row }) => {
            const { name, short_form, logo } =
              row.original as TradesFixedIncomeTableData;
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
          accessorKey: "amount-invested",
          header: "Amount invested",
          cell: ({ row }) => {
            const { amount_invested } =
              row.original as TradesFixedIncomeTableData;
            return (
              <div className="flex gap-2 text-left font-medium">
                ₦ {amount_invested}
              </div>
            );
          },
        },
        {
          accessorKey: "rate",
          header: "Rate",
          cell: ({ row }) => {
            const { rate } = row.original as TradesFixedIncomeTableData;
            return (
              <div
                className={rate >= 0 ? "text-txt-success" : "text-txt-danger"}
              >
                {rate}%
              </div>
            );
          },
        },
        {
          accessorKey: "txn-date",
          header: "Transaction date",
          cell: ({ row }) => {
            const { txn_date } = row.original as TradesFixedIncomeTableData;
            return (
              <div className="flex gap-2 text-left font-medium">{txn_date}</div>
            );
          },
        },

        {
          accessorKey: "current-value",
          header: "Current value",
          cell: ({ row }) => {
            const { current_value, value_change } =
              row.original as TradesFixedIncomeTableData;
            return (
              <div className="flex items-center gap-2">
                ₦ {current_value}{" "}
                <span
                  className={
                    value_change >= 0 ? "text-txt-success" : "text-txt-danger"
                  }
                >
                  {value_change >= 0 ? "+" : "-"} {Math.abs(value_change)}%
                </span>
              </div>
            );
          },
        },
        {
          accessorKey: "fund-type",
          header: "Type",
          cell: ({ row }) => {
            const { fund_type } = row.original as TradesFixedIncomeTableData;
            return (
              <div className="flex gap-2 text-left font-medium">
                {fund_type}
              </div>
            );
          },
        },
        {
          id: "actions",
          cell: ({ row }) => {
            const { id } = row.original as TradesFixedIncomeTableData;
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
    case "requests":
      columns = [
        {
          accessorKey: "name",
          header: "Name",
          cell: ({ row }) => {
            const { name, short_form, logo } =
              row.original as RequestsFixedIncomeTableData;
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
            const { txn_date } = row.original as RequestsFixedIncomeTableData;
            return (
              <div className="flex gap-2 text-left font-medium">{txn_date}</div>
            );
          },
        },
        {
          accessorKey: "txn-amt",
          header: "Transaction amount",
          cell: ({ row }) => {
            const { txn_amount } = row.original as RequestsFixedIncomeTableData;
            return (
              <div className="flex gap-2 text-left font-medium">
                ₦ {txn_amount}
              </div>
            );
          },
        },
        {
          accessorKey: "rate",
          header: "Rate",
          cell: ({ row }) => {
            const { rate } = row.original as RequestsFixedIncomeTableData;
            return (
              <div
                className={rate >= 0 ? "text-txt-success" : "text-txt-danger"}
              >
                {rate}%
              </div>
            );
          },
        },
        {
          accessorKey: "tenure",
          header: "Tenure",
          cell: ({ row }) => {
            const { tenure } = row.original as RequestsFixedIncomeTableData;
            return <div>{tenure}</div>;
          },
        },
        {
          accessorKey: "fund-type",
          header: "Type",
          cell: ({ row }) => {
            const { fund_type } = row.original as RequestsFixedIncomeTableData;
            return <div>{fund_type}</div>;
          },
        },
        {
          accessorKey: "txn-type",
          header: "Transaction type",
          cell: ({ row }) => {
            const { txn_type } = row.original as RequestsFixedIncomeTableData;
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
      ];
      break;
    case "history":
      columns = [
        {
          accessorKey: "name",
          header: "Name",
          cell: ({ row }) => {
            const { name, short_form, logo } =
              row.original as FixedIncomeHistoryTableData;
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
            const { txn_date } = row.original as FixedIncomeHistoryTableData;
            return (
              <div className="flex gap-2 text-left font-medium">{txn_date}</div>
            );
          },
        },
        {
          accessorKey: "txn-amt",
          header: "Transaction amount",
          cell: ({ row }) => {
            const { txn_amount } = row.original as FixedIncomeHistoryTableData;
            return (
              <div className="flex gap-2 text-left font-medium">
                ₦ {txn_amount}
              </div>
            );
          },
        },
        {
          accessorKey: "rate",
          header: "Rate",
          cell: ({ row }) => {
            const { rate } = row.original as FixedIncomeHistoryTableData;
            return (
              <div
                className={rate >= 0 ? "text-txt-success" : "text-txt-danger"}
              >
                {rate}%
              </div>
            );
          },
        },
        {
          accessorKey: "txn-type",
          header: "Transaction type",
          cell: ({ row }) => {
            const { txn_type } = row.original as FixedIncomeHistoryTableData;
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
            const { status } = row.original as FixedIncomeHistoryTableData;
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
