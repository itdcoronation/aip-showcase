import { ColumnDef } from "@tanstack/react-table";
import { ReferralTableData } from "@/types/referral";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export const getReferralTableColumns = (): ColumnDef<ReferralTableData>[] => {
  const columns: ColumnDef<ReferralTableData>[] = [
    {
      accessorKey: "account_name",
      header: "Account name",
      cell: ({ row }) => {
        const { account_name, avatar } = row.original;
        return (
          <div className="flex gap-2 items-center">
            <Avatar className="w-[32px] h-[32px]" >
              <AvatarImage src={avatar} alt="avatar" />
              <AvatarFallback>{getInitials(account_name)}</AvatarFallback>
            </Avatar>
            <p className="text-txt-primary text-medium" >{account_name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "date_registered",
      header: "Registration date",
      cell: ({ row }) => {
        const { date_registered } = row.original;
        return <p className="font-medium text-right" >{date_registered}</p>;
      },
      
    },
    
  ];

  return columns;
};
