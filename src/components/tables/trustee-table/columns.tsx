import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrusteesTableData } from "@/types/trustees";
import { ArrowBendUpLeft, BankIcon } from "@/assets/vectors/icons";

export interface FixedIncomeActions {
  handleView: (id: string) => void;
  handleRemove: (id: string) => void;
}

export const getTrusteeTableColumns = ({
  handleView,
  handleRemove,
}: FixedIncomeActions): ColumnDef<TrusteesTableData>[] => {
  const columns: ColumnDef<TrusteesTableData>[] = [
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => {
        const { product } = row.original;
        return (
          <div className="flex gap-2 items-center">
            <div className="bg-bg-secondary rounded-full p-1 w-[40px] h-[40px] flex items-center justify-center">
              <BankIcon />
            </div>
            <p>{product}</p>
          </div>
        );
      },
      size: 300,
    },
    {
      accessorKey: "date-created",
      header: "Date created",
      cell: ({ row }) => {
        const { date_created } = row.original;
        return <p>{date_created}</p>;
      },
      size: 150,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const { status } = row.original;
        return (
          <div>
            <div
              className={cn(
                "capitalize w-fit flex items-center gap-1 rounded-[6px] py-0.5 px-2 font-medium",
                status === "completed"
                  ? "text-txt-success bg-bg-success-light"
                  : status === "failed"
                  ? "text-txt-danger bg-bg-danger-light"
                  : status === "in progress"
                  ? "text-txt-warning bg-bg-warning-light"
                  : "bg-bg-tertiary text-txt-primary"
              )}
            >
              {status}
            </div>
          </div>
        );
      },
      size: 600,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const { id, status } = row.original;
        return (
          <div className="flex items-cemter gap-2 justify-start ml-auto w-fit">
            {status !== "completed" ? (
              <Button
                onClick={() => handleRemove(id)}
                className="h-7 w-7 flex"
                size="icon"
                variant="outline"
              >
                <Trash2 color="#141415" strokeWidth={1.5} />
              </Button>
            ) : null}
            <Button
              onClick={() => handleView(id)}
              className="h-7 w-7  flex"
              size="icon"
              variant="outline"
            >
              <ArrowBendUpLeft className="scale-x-[-1]" color="#141415" />
            </Button>
          </div>
        );
      },
      size: 100,
    },
  ];

  return columns;
};
