import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { BankIcon } from "@/assets/vectors/icons";
import { MinorAccountTableData } from "@/types/bank-info";

export interface FixedIncomeActions {
  handleRemove: (id: string) => void;
}

export const getMinorAccountTableColumns = ({
  handleRemove,
}: FixedIncomeActions): ColumnDef<MinorAccountTableData>[] => {
  const columns: ColumnDef<MinorAccountTableData>[] = [
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
            <p className="text-txt-primary" >{account_name}</p>
          </div>
        );
      },
       size: 350
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const { email } = row.original;
        return <p>{email}</p>;
      },
       size: 240
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => {
        const { gender } = row.original;
        return <p className="capitalize">{gender}</p>;
      },
      size: 100,
    },

    {
      accessorKey: "dob",
      header: "Date of birth",
      cell: ({ row }) => {
        const { dob } = row.original;
        return <p>{dob}</p>;
      },
       size: 150
    },
    {
      accessorKey: "date_created",
      header: "Date created",
      cell: ({ row }) => {
        const { date_created } = row.original;
        return <p>{date_created}</p>;
      },
       size: 150
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
