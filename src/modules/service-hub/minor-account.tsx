"use client";

import { EmptyStateSvg } from "@/assets/vectors";
import { MinorAccountTable } from "@/components/tables/minor-account-table";
import { getMinorAccountTableColumns } from "@/components/tables/minor-account-table/columns";
import { MinorAccountTableData } from "@/types/bank-info";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

const tableData: MinorAccountTableData[] = [
  // Add dummy data
  {
    id: "1",
    account_name: "Mercy Nweke",
    email: "johndoe@gmai.com",
    gender: "male",
    dob: "12 Jul, 2015",
    date_created: "12 Jul, 2025",
  },
  {
    id: "2",
    account_name: "Jane Doe",
    email: "janedoe@gmai.com",
    gender: "male",
    dob: "12 Jul, 2015",
    date_created: "12 Jul, 2025",
  },
  {
    id: "3",
    account_name: "Sam Smith",
    email: "samsmith@gmai.com",
    gender: "female",
    dob: "23 Mar, 2014",
    date_created: "15 Aug, 2025",
  },
  {
    id: "4",
    account_name: "Alex Johnson",
    email: "alexjohnson@gmai.com",
    gender: "male",
    dob: "05 May, 2016",
    date_created: "20 Sep, 2025",
  },
  {
    id: "5",
    account_name: "Emily Brown",
    email: "emilybrown@gmai.com",
    gender: "female",
    dob: "30 Oct, 2013",
    date_created: "10 Nov, 2025",
  },
];

const MinorAccountUI = () => {
  const router = useRouter();

  const columns = getMinorAccountTableColumns({
    handleRemove: (id) => console.log("remove", id),
  });

  const noFunds = tableData.length === 0;

  return (
    <>
      {noFunds ? (
        <div className="bg-white shadow-sm border border-0.5 border-[#EEEFF1] py-12 px-4 rounded-[12px]">
          <EmptyAssets
            handleCreate={() =>
              router.push(ROUTES.onboarding_minor_account_personal)
            }
          />
        </div>
      ) : (
        <section className="bg-white shadow-sm border border-0.5 border-[#EEEFF1] rounded-[12px] py-6 px-4">
          <p className="text-primary text-h5 sm:text-h4 font-medium mb-4 sm:mb-6">
            Minor account
          </p>
          {tableData.length > 0 ? (
            <MinorAccountTable columns={columns} data={tableData} />
          ) : (
            <EmptyAssets
              handleCreate={() =>
                router.push(ROUTES.onboarding_minor_account_personal)
              }
            />
          )}
          <hr />
          <Button
            onClick={() =>
              router.push(ROUTES.onboarding_minor_account_personal)
            }
            size={"xs"}
            className="mt-6"
          >
            Create new <PlusCircle />
          </Button>
        </section>
      )}
    </>
  );
};

export { MinorAccountUI };

const EmptyAssets = ({ handleCreate }: { handleCreate: () => void }) => {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-2">
      <EmptyStateSvg />
      <p className="text-p2 text-txt-primary font-semibold">
        You do not have any minor accounts
      </p>
      <p className="text-l3 text-txt-secondary max-w-[280px] text-center">
        Build financial freedowm for your ward, add a minor account today
      </p>
      <Button onClick={handleCreate} size={"xs"} className="mt-6">
        Create new <PlusCircle />
      </Button>
    </div>
  );
};
