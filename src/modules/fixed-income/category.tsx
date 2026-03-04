import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { FixedIncomeCard2 } from "@/components/cards/fixed-income-card";

const categories = [
  {
    label: "Bonds",
    value: "bonds",
  },
  {
    label: "Commercial papers",
    value: "commercial-papers",
  },
  {
    label: "Treasury Bills",
    value: "treasury-bills",
  },
  {
    label: "Cash management",
    value: "cash-management",
  },
  {
    label: "Execution only",
    value: "execution",
  },
];

const FixedIncomeCategoryUI = () => {
  const [category, setCategory] = useState<string | undefined>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initCategory = searchParams.get("category");
  console.log(initCategory, "initCategory");
  useEffect(() => {
    if (initCategory)
      setCategory(
        categories.find((item) => item.label === initCategory)?.value
      );
  }, [initCategory]);

  const selectedCategory = categories.find((item) => item.value === category);

  return (
    <>
      <Button onClick={router.back} variant={"ghost"} size={"sm"}>
        <ArrowLeft /> Back
      </Button>
      <section className="mx-auto max-w-[940px] mt-8 grid gap-4">
        <div className="flex justify-between">
          <h2 className="text-p1 sm:text-h3 font-semibold text-txt-primary">
            {selectedCategory?.label}
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-[6px] border border-stroke-primary bg-white flex gap-1 items-center px-3 py-1 font-medium text-txt-primary font-semibold">
              <span className="hidden sm:inline">See other fixed income</span>{" "}
              <span className="inline sm:hidden">See others</span>{" "}
              <ChevronDown strokeWidth={1} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="px-2 py-2 grid gap-2">
              {categories.map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  onClick={() => setCategory(item.value)}
                  className={
                    item.value === category
                      ? "bg-bg-secondary text-txt-primary font-semibold"
                      : "text-txt-secondary font-medium"
                  }
                >
                  {item.label}
                  {item.value === category ? (
                    <div className="w-4 h-4 border border-4 border-bg-brand rounded-full ml-1"></div>
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="bg-white rounded border border-stroke-primary rounded-[10px] flex">
          <Search color="#56575D" size={18} className="ml-3 mt-3" />
          <Input
            placeholder="Search by name or symbol,e.g. Access bank"
            parentClassName="w-full"
            className="border-none"
          />
        </div>
        <div className="grid gap-4 mt-4">
          <FixedIncomeCard2 />
          <FixedIncomeCard2 />
          <FixedIncomeCard2 />
          <FixedIncomeCard2 />
        </div>
      </section>
    </>
  );
};

export { FixedIncomeCategoryUI };
