"use client";
import { EmptyStateSvg } from "@/assets/vectors";
import { CopySimpleIcon } from "@/assets/vectors/icons";
import { ReferralTable } from "@/components/tables/referral-table";
import { getReferralTableColumns } from "@/components/tables/referral-table/columns";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { ReferralTableData } from "@/types/referral";

const tableData: ReferralTableData[] = [
  {
    id: "1",
    avatar: "",
    account_name: "Philip Olorunfemi Ofei",
    date_registered: "24 Apr, 2025",
  },
  {
    id: "2",
    avatar: "",
    account_name: "Mercy Nweke",
    date_registered: "24 Apr, 2025",
  },
  {
    id: "3",
    avatar: "",
    account_name: "Mercy Nweke",
    date_registered: "24 Apr, 2025",
  },
  {
    id: "4",
    avatar: "",
    account_name: "Mercy Nweke",
    date_registered: "24 Apr, 2025",
  },
  {
    id: "5",
    avatar: "",
    account_name: "Mercy Nweke",
    date_registered: "24 Apr, 2025",
  },
];

const ReferralUI = () => {
  const columns = getReferralTableColumns();
  const { copy } = useCopyToClipboard();

  return (
    <section className="max-w-md flex flex-col gap-6 min-h-[calc(100dvh-180px)] items-start">
      <div className="py-4 px-3 border border-[#EEEFF1] rounded-md bg-white shadow-sm w-full">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-txt-primary text-sm">128903949</p>
          <CopySimpleIcon
            onClick={() => copy("128903949")}
            width={16}
            height={16}
            viewBox="0 0 24 24"
          />
        </div>
        <p className="text-txt-tertiary text-xs">
          Invite your friends to invest with you on Coronation. Copy your
          referral code to share.
        </p>
      </div>

      <div className="py-4 px-3 border border-[#EEEFF1] rounded-md bg-white shadow-sm w-full">
        <p className="text-primary text-h5 sm:text-h4 font-medium mb-4 sm:mb-6">
          Referrals
        </p>
        {tableData.length > 0 ? (
          <ReferralTable columns={columns} data={tableData} />
        ) : (
          <EmptyAssets />
        )}
      </div>
    </section>
  );
};

export { ReferralUI };

const EmptyAssets = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-2">
      <EmptyStateSvg />
      <p className="text-p2 text-txt-primary font-semibold">
        You do not have any referrals yet
      </p>
      <p className="text-l3 text-txt-secondary max-w-[280px] text-center">
        Invite your friends to invest with you on Coronation and earn rewards
        when they invest
      </p>
    </div>
  );
};
