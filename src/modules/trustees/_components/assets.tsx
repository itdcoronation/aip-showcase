import { EmptyStateSvg } from "@/assets/vectors";
import { TrusteesTableData } from "@/types/trustees";
import { TrusteeTable } from "@/components/tables/trustee-table";
import { getTrusteeTableColumns } from "@/components/tables/trustee-table/columns";

const tableData: TrusteesTableData[] = [
  {
    id: "1",
    product: "Philip Olorunfemi Ofei",
    date_created: "24 Apr, 2025",
    status: "completed",
  },
  {
    id: "2",
    product: "Trust & Will",
    date_created: "24 Apr, 2025",
    status: "in progress",
  },
  {
    id: "3",
    product: "Trust & Will",
    date_created: "24 Apr, 2025",
    status: "failed",
  },
  {
    id: "4",
    product: "Trust & Will",
    date_created: "24 Apr, 2025",
    status: "completed",
  },
  {
    id: "5",
    product: "Trust & Will",
    date_created: "24 Apr, 2025",
    status: "in progress",
  },
];

const Assets = () => {
  const columns = getTrusteeTableColumns({
    handleView: (id) => console.log("view", id),
    handleRemove: (id) => console.log("remove", id),
  });

  const noFunds = tableData.length === 0;

  return (
    <>
      {noFunds ? (
        <div className="bg-white shadow-sm border border-0.5 border-[#EEEFF1] py-12 px-4 rounded-[12px]">
          <EmptyAssets />
        </div>
      ) : (
        <section className="bg-white shadow-sm border border-0.5 border-[#EEEFF1] rounded-[12px] py-6 px-4 overflow-auto">
          <p className="text-primary text-h5 sm:text-h4 font-medium mb-6">
            Trust & Will
          </p>
          {tableData.length > 0 ? (
            <TrusteeTable columns={columns} data={tableData} />
          ) : (
            <EmptyAssets />
          )}
        </section>
      )}
    </>
  );
};

export { Assets };

const EmptyAssets = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-2">
      <EmptyStateSvg />
      <p className="text-p2 text-txt-primary font-semibold">
        You have not subscribed to any trustees
      </p>
      <p className="text-l3 text-txt-secondary max-w-[280px] text-center">
        Secure the future of your family, buy a trust today!
      </p>
    </div>
  );
};
