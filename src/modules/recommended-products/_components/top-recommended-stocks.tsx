"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchRecommendations } from "@/requests/services/products/recommendations";
import { ROUTES } from "@/lib/routes";
import { ProductRecCard } from "@/components/cards/recommended-product-card";
import { EmptyStateSvg } from "@/assets/vectors";

export const TopRecommendedStocks = () => {
  const { data, isPending } = useFetchRecommendations();

  enum ProductRouteMap {
    "Coronation Money Market Fund" = ROUTES.mutual_funds,
    "Coronation Balanced Fund" = ROUTES.mutual_funds,
    "Coronation Fixed Income Dollar Fund" = ROUTES.contact,
    "Coronation Premium Fixed Income Fund" = ROUTES.mutual_funds,
    "Execution Only" = ROUTES.contact,
    "Coronation Dollar Fund" = ROUTES.contact,
    "NGX Equities" = ROUTES.equities,
  }

  const getLink = (name: string) => {
    return (
      ProductRouteMap[name as keyof typeof ProductRouteMap] || ROUTES.contact
    );
  };

  return (
    <section className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div>
          <p className="text-p2 text-txt-primary font-semibold mb-1">
            Top recommended products
          </p>
          <p className="text-p4 text-txt-secondary">
            Based on your risk profile, here are some products we recommend
          </p>
        </div>
        {/* <Button size={"sm"} variant={"ghost"} className="text-xs">
          See all
        </Button> */}
      </div>

      <div className="flex gap-4 flex-wrap w-full pb-2">
        {isPending ? (
          <>
            <Skeleton className="h-[144px] min-w-[250px] rounded-xl" />
            <Skeleton className="h-[144px] min-w-[250px] rounded-xl" />
            <Skeleton className="h-[144px] min-w-[250px] rounded-xl" />
            <Skeleton className="h-[144px] min-w-[250px] rounded-xl" />
          </>
        ) : data && data?.length > 0 ? (
          data?.map((item) => (
            <ProductRecCard
              className="w-[250px]"
              key={item.code}
              name={item.name}
              code={item.code}
              status={item.status}
              link={getLink(item.name)}
            />
          ))
        ) : (
          <EmptyAssets />
        )}
      </div>
    </section>
  );
};

const EmptyAssets = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-2 w-full py-6 px-4">
      <EmptyStateSvg />
      <p className="text-p2 text-txt-primary font-semibold">
        You have no recommended products
      </p>
      <p className="text-l3 text-txt-secondary max-w-[280px] text-center">
        Complete your risk profiling to get product recommendations
      </p>
    </div>
  );
};
