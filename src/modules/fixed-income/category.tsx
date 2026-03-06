import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  fixedIncomeCategoryOptions,
  fixedIncomeCategoryProducts,
  FixedIncomeCategoryValue,
} from "./showcase-data";
import Image from "next/image";
import Link from "next/link";

const FixedIncomeCategoryUI = () => {
  const [category, setCategory] = useState<FixedIncomeCategoryValue>("bonds");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const initCategory = searchParams.get("category");

  useEffect(() => {
    if (!initCategory) return;

    const normalized = initCategory.trim().toLowerCase();
    const matchedCategory = fixedIncomeCategoryOptions.find(
      (item) => item.label.toLowerCase() === normalized
    );

    if (matchedCategory) {
      setCategory(matchedCategory.value);
    }
  }, [initCategory]);

  const selectedCategory = fixedIncomeCategoryOptions.find(
    (item) => item.value === category
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return fixedIncomeCategoryProducts.filter((item) => {
      if (item.category !== category) return false;
      if (!normalizedSearch) return true;

      return (
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.short_form.toLowerCase().includes(normalizedSearch) ||
        item.issuer.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [category, search]);

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
              {fixedIncomeCategoryOptions.map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  onClick={() => setCategory(item.value as FixedIncomeCategoryValue)}
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
            placeholder="Search by instrument or issuer, e.g. FGN Bond"
            parentClassName="w-full"
            className="border-none"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <p className="text-xs text-txt-secondary">{selectedCategory?.description}</p>
        <div className="grid gap-4 mt-4">
          {filteredProducts.map((item) => (
            <Link
              key={`${item.category}-${item.id}`}
              href={`/fixed-income/${item.id}`}
              className="shadow-sm p-4 bg-white border-0.5 border-[#EEEFF1] rounded-[24px]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2 items-center">
                  <Image src={item.logo} alt="" width={32} height={32} />
                  <div>
                    <p className="text-txt-primary">{item.name}</p>
                    <p className="text-l2 text-txt-secondary text-[11px]">{item.issuer}</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-txt-secondary mb-3">{item.shortDescription}</p>

              <div className="flex items-center justify-between border-0.5 border-t border-[#EFEFF0] pt-2">
                <div>
                  <p className="text-[11px] text-txt-secondary mb-0.5">Rate</p>
                  <p className="text-p4 text-txt-success-dark font-semibold">{item.rate}%</p>
                </div>
                <div>
                  <p className="text-[11px] text-txt-secondary mb-0.5">Tenure</p>
                  <p className="text-p4 text-txt-primary">{item.tenure}</p>
                </div>
                <div>
                  <p className="text-[11px] text-txt-secondary mb-0.5">Type</p>
                  <p className="text-p4 text-txt-primary">{item.type}</p>
                </div>
              </div>
            </Link>
          ))}

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-[12px] border border-stroke-primary p-4 text-sm text-txt-secondary">
              No products found for this category.
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
};

export { FixedIncomeCategoryUI };
