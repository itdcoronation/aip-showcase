import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { RecurringPaymentTableData } from "@/types/recurring-payment";

export interface RecurringPaymentTableActions {
  handleCancel: (transactionRef: string) => void;
}

export const getRecurringPaymentTableColumns = ({
  handleCancel,
}: RecurringPaymentTableActions): ColumnDef<RecurringPaymentTableData>[] => {
  const columns: ColumnDef<RecurringPaymentTableData>[] = [
    {
      accessorKey: "transaction_ref",
      header: "Transaction Reference",
      cell: ({ row }) => {
        const { transaction_ref } = row.original;
        return (
          <p className="font-mono text-xs text-txt-secondary">
            {transaction_ref}
          </p>
        );
      },
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => {
        const { product } = row.original;
        return (
          <p className="font-medium">
            {product || <span className="text-txt-tertiary">N/A</span>}
          </p>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const { amount, currency } = row.original;
        const symbol = currency === "NGN" ? "₦" : "$";
        const numAmount = parseFloat(amount);
        return (
          <p className="font-medium">
            {symbol} {numAmount.toLocaleString()}
          </p>
        );
      },
    },
    {
      accessorKey: "currency",
      header: "Currency",
      cell: ({ row }) => {
        const { currency } = row.original;
        return <p>{currency}</p>;
      },
    },
    {
      accessorKey: "frequency",
      header: "Frequency",
      cell: ({ row }) => {
        const { frequency } = row.original;
        return (
          <p className="capitalize">
            {frequency.toLowerCase()}
          </p>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const { status } = row.original;
        return (
          <p className="capitalize">
            {status}
          </p>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const { transaction_ref } = row.original;
        return (
          <Button
            onClick={() => handleCancel(transaction_ref)}
            className="ml-auto flex bg-black text-white hover:bg-black/90"
            size="sm"
          >
            Cancel <XCircle />
          </Button>
        );
      },
    },
  ];

  return columns;
};
