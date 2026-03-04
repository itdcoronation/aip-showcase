import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { BankIcon } from "@/assets/vectors/icons";
import { BankAccountTableData } from "@/types/bank-info";

export interface FixedIncomeActions {
  handleRemove: (id: string) => void;
}

export const getBankAccountTableColumns = ({
  handleRemove,
}: FixedIncomeActions): ColumnDef<BankAccountTableData>[] => {
  const columns: ColumnDef<BankAccountTableData>[] = [
    {
      accessorKey: "account_name",
      header: "Account name",
      cell: ({ row }) => {
        const { account_name } = row.original;
        return (
          <div className="flex gap-2 items-center">
            <div className="bg-bg-secondary rounded-full p-1 w-[40px] h-[40px] flex items-center justify-center">
              <BankIcon />
            </div>
            <p >{account_name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "bank",
      header: "Bank",
      cell: ({ row }) => {
        const { bank } = row.original;
        return <p>{bank}</p>;
      },
    },
    {
      accessorKey: "account_number",
      header: "Account number",
      cell: ({ row }) => {
        const { account_number } = row.original;
        return <p>{account_number}</p>;
      },
    },
    {
      accessorKey: "date-added",
      header: "Date added",
      cell: ({ row }) => {
        const { date_added } = row.original;
        return <p>{date_added}</p>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const { id } = row.original;
        return (
          <div className="flex items-cemter gap-2 justify-start ml-auto w-fit">
            <Button
              onClick={() => handleRemove(id)}
              className="h-7 w-7 flex"
              size="icon"
              variant="outline"
            >
              <Trash2 color="#141415" strokeWidth={1.5} />
            </Button>
          </div>
        );
      },
      size: 50,
    },
  ];

  return columns;
};
