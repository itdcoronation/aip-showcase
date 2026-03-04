import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { MastercardIcon, VisacardIcon } from "@/assets/vectors/icons";
import { CardsTableData } from "@/types/bank-info";
import { JSX } from "react";

export interface FixedIncomeActions {
  handleRemove: (id: string) => void;
}

export const getCardsTableColumns = ({
  handleRemove,
}: FixedIncomeActions): ColumnDef<CardsTableData>[] => {
  const cardIcons: Record<string, JSX.Element> = {
    Visa: <VisacardIcon />,
    Mastercard: <MastercardIcon />,
  };
  const columns: ColumnDef<CardsTableData>[] = [
    {
      accessorKey: "card_number",
      header: "Card number",
      cell: ({ row }) => {
        const { card_number, card_type } = row.original;
        return (
          <div className="flex gap-2 items-center py-2">
            {cardIcons[card_type]}
            <p>
              {card_type} ({card_number})
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "account_name",
      header: "Name on card",
      cell: ({ row }) => {
        const { account_name } = row.original;
        return <p>{account_name}</p>;
      },
    },
    {
      accessorKey: "bank",
      header: "Issuing bank",
      cell: ({ row }) => {
        const { bank } = row.original;
        return <p>{bank}</p>;
      },
    },
    {
      accessorKey: "expiration_date",
      header: "Expiry date",
      cell: ({ row }) => {
        const { expiration_date } = row.original;
        return <p>{expiration_date}</p>;
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
