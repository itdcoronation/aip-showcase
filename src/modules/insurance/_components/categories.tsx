"use client";

import {
  commercialMotorInsuranceImg,
  otherInsuranceProductsImg,
  privateMotorInsuranceImg,
} from "@/assets/images";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchInsuranceProducts } from "@/requests/services/insurance/products";
import useInsuranceStore from "@/store/insurance";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

export const InsuranceCategories = () => {
  const products = useInsuranceStore((state) => state.products);
  const { isLoading, isError } = useFetchInsuranceProducts();

  const categories = useMemo<InsuranceCategoryData[]>(() => {
    const privateProducts = Object.keys(
      products.third_party_motor_insurance["private"],
    );
    const commercialProducts = Object.keys(
      products.third_party_motor_insurance["commercial"],
    );

    return [
      {
        id: "private-motor",
        title: "3rd Party Motor Insurance (Private)",
        image: privateMotorInsuranceImg.src,
        description: `${privateProducts.length} vehicle option${
          privateProducts.length === 1 ? "" : "s"
        } available`,
        isAvailable: privateProducts.length > 0,
      },
      {
        id: "commercial-motor",
        title: "3rd Party Motor Insurance (Commercial)",
        image: commercialMotorInsuranceImg.src,
        description: `${commercialProducts.length} vehicle option${
          commercialProducts.length === 1 ? "" : "s"
        } available`,
        isAvailable: commercialProducts.length > 0,
      },
      {
        id: "other-products",
        title: "Other Products\n(Coming Soon)",
        image: otherInsuranceProductsImg.src,
        isComingSoon: true,
        isAvailable: true,
      },
    ];
  }, [products]);

  const hasLoadedProducts =
    Object.keys(products.third_party_motor_insurance["private"]).length > 0 ||
    Object.keys(products.third_party_motor_insurance["commercial"]).length > 0;

  return (
    <section className="overflow-auto">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div>
          <p className="text-p2 text-txt-primary font-semibold mb-1">
            Other Insurance Products
          </p>
          <p className="text-p4 text-txt-secondary">
            Select a category to see more product details
          </p>
        </div>
        <div className="flex gap-2">
          <Button size={"icon"} variant={"outline"} className="rounded-full">
            <ChevronLeft size={18} className="w-[18px]! h-[18px]!" />
          </Button>
          <Button size={"icon"} variant={"outline"} className="rounded-full">
            <ChevronRight size={18} className="w-[18px]! h-[18px]!" />
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-auto w-full pb-2">
        {isLoading && !hasLoadedProducts
          ? Array.from({ length: 3 }).map((_, index) => (
              <InsuranceCategorySkeleton key={`insurance-category-${index}`} />
            ))
          : categories.map((item) => (
              <InsuranceCategoryCard key={item.title} {...item} />
            ))}
      </div>

      {isError && !hasLoadedProducts ? (
        <p className="text-xs text-red-600 mt-3">
          We couldn&apos;t load insurance products right now.
        </p>
      ) : null}
    </section>
  );
};

interface InsuranceCategoryData {
  id?: string;
  title: string;
  description?: string;
  image: string;
  isComingSoon?: boolean;
  isAvailable?: boolean;
}

const InsuranceCategoryCard = ({
  id,
  title,
  description,
  image,
  isComingSoon,
  isAvailable = true,
}: InsuranceCategoryData) => {
  return isComingSoon || !isAvailable ? (
    <div className="shadow-sm border border-stroke-primary p-1.5 rounded-3xl w-[215px] shrink-0 overflow-hidden relative hover:cursor-not-allowed">
      <Image
        className="w-full h-full object-cover"
        alt=""
        src={image}
        width={200}
        height={200}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8  rounded-b-3xl">
        <p className="text-p2 text-txt-primary line-clamp-2 leading-tight font-semibold whitespace-pre-line">
          {title}
        </p>
      </div>
    </div>
  ) : (
    <Link
      href={`/insurance/${id}/buy`}
      className="shadow-sm border border-stroke-primary rounded-3xl p-1.5 pb-3 w-[215px] shrink-0"
    >
      <Image
        className="rounded-[18px] mb-2 w-full object-cover"
        alt=""
        src={image}
        width={200}
        height={125}
      />
      <div className="px-1.5">
        <p className="text-p2 text-txt-primary mb-1 line-clamp-2 leading-tight font-semibold">
          {title}
        </p>
        <p className="text-xs text-txt-secondary">{description}</p>
      </div>
    </Link>
  );
};

const InsuranceCategorySkeleton = () => {
  return (
    <div className="shadow-sm border border-stroke-primary rounded-3xl p-1.5 pb-3 w-[215px] shrink-0">
      <Skeleton className="rounded-[18px] mb-2 w-full h-[125px]" />
      <div className="px-1.5 space-y-2">
        <Skeleton className="h-5 w-[85%]" />
        <Skeleton className="h-4 w-[70%]" />
      </div>
    </div>
  );
};
