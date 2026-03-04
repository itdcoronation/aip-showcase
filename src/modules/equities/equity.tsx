import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, PlusCircle/*, TrendingUp*/ } from "lucide-react";
import Image from "next/image";
import { mutualFundLogo, newsImg } from "@/assets/images";
import { MarketClosedBanner } from "./_components/market-closed";
import { ArrowElbowRightIcon } from "@/assets/vectors/icons";
import { Collapsible } from "@/components/collapsible";
import { CustomAreaChart } from "@/components/charts/area-chart";
import { BoughtEquityUI } from "./bought-equity";
import { useStockDetails } from "@/requests/services/equities/stock-details";
import { useMemo } from "react";

export const EquityUI = () => {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const bought = searchParams.get("bought");

  const { data: stockDetailsData, isLoading: stockDetailsLoading, error: stockDetailsError } = useStockDetails({
    symbol: id as string
  });

  const stockData = useMemo(() => {
    return stockDetailsData?.data?.Data?.[0] || null;
  }, [stockDetailsData]);

  // If user owns the equity, render the bought equity component
  if (bought) {
    return <BoughtEquityUI />;
  }

  if (stockDetailsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-txt-secondary">Loading stock details...</p>
      </div>
    );
  }

  if (stockDetailsError || !stockData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-txt-error">Failed to load stock details</p>
      </div>
    );
  }

  const handleBuyStock = () => {
    router.push(`/equities/${id}/buy`);
  };

  return (
    <>
      <Button onClick={router.back} variant={"ghost"} size={"sm"}>
        <ArrowLeft /> Back
      </Button>

      <section className="mx-auto max-w-[940px] mt-8 grid gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-bg-secondary w-[40px] h-[40px] sm:w-[58px] sm:h-[58px] rounded-full flex border">
            {stockData.iconUrl ? (
              <Image
                className="m-auto"
                src={stockData.iconUrl}
                width={32}
                height={34}
                alt={`${stockData.name} logo`}
              />
            ) : (
              <Image
                className="m-auto"
                src={mutualFundLogo}
                width={32}
                height={34}
                alt="logo"
              />
            )}
          </div>
          <div>
            <p className="text-txt-primary font-semibold text-sm sm:text-h4 mb-1">
              {stockData.name}
            </p>
            <p className="text-sm sm:text-p3 text-txt-secondary">{stockData.symbol}</p>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button
              onClick={handleBuyStock}
              size={"m"}
            >
              Buy Stock
              <PlusCircle />
            </Button>
          </div>
        </div>

        <MarketClosedBanner addBreak />

        <div className="grid sm:grid-cols-[2fr_1.4fr] gap-4">
          <Stats stockData={stockData} />
          <StockBreakdown stockData={stockData} />
        </div>
        <Collapsible
          title={`About ${stockData.name}`}
          body={
            <p className="text-p4 text-txt-secondary max-w-[760px]">
              Lorem ipsum dolor sit amet consectetur. Ultrices mattis
              suscipit facilisis scelerisque. Lacus donec neque lacus eget
              id cursus feugiat eget est. Aliquam consequat eu quam placerat
              consectetur elit vel faucibus bibendum. Lobortis nunc pretium
              facilisi nisl duis eu velit. Nunc dolor urna semper et
              molestie sit diam. Vitae nisi tempus eget volutpat sed lacus.
              Mollis consectetur est enim enim feugiat.
            </p>
          }
        />
        <Collapsible
          body={
            <div className="max-w-[760px] pt-5">
              <div className="flex gap-4 border-b border-stroke-primary pb-6">
                <Image
                  src={newsImg}
                  width={103}
                  height={63}
                  alt=""
                  className="min-w-[103px]"
                />
                <div>
                  <div className="flex gap-2 text-txt-tertiary text-xs mb-4">
                    <p>Businessday.com</p> <p>24 Jan, 2025</p>
                  </div>
                  <p className="text-p3 text-txt-primary">
                    Lobortis nunc pretium facilisi nisl duis eu velit. Nunc
                    dolor urna semper et molestie sit diam. Vitae nisi
                    tempus eget volutpat sed lacus. Mollis consectetur est
                    enim enim feugiat.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 py-6">
                <Image
                  src={newsImg}
                  width={103}
                  height={63}
                  alt=""
                  className="min-w-[103px]"
                />
                <div>
                  <div className="flex gap-2 text-txt-tertiary text-xs mb-4">
                    <p>Businessday.com</p> <p>24 Jan, 2025</p>
                  </div>
                  <p className="text-p3 text-txt-primary">
                    Lobortis nunc pretium facilisi nisl duis eu velit. Nunc
                    dolor urna semper et molestie sit diam. Vitae nisi
                    tempus eget volutpat sed lacus. Mollis consectetur est
                    enim enim feugiat.
                  </p>
                </div>
              </div>
            </div>
          }
          title={`${stockData.name} News`}
        />
      </section>
    </>
  );
};

const Stats = ({ stockData }: { stockData: any }) => {
  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return `₦${num.toLocaleString()}`;
  };

  const getChangeIcon = (sign: string) => {
    return sign === '+' ? (
      <span className="bg-bg-success-light text-txt-success text-xs flex gap-1.5 items-center px-1.5 py-[2px] w-fit rounded-[6px]">
        <ArrowElbowRightIcon size={14} /> {stockData.changePercent}%
      </span>
    ) : (
      <span className="bg-bg-error-light text-txt-error text-xs flex gap-1.5 items-center px-1.5 py-[2px] w-fit rounded-[6px]">
        <ArrowElbowRightIcon size={14} /> {stockData.changePercent}%
      </span>
    );
  };

  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] p-4">
      <p className="text-h3 sm:text-h2 font-semibold text-[var(--purple-700)] mb-4">
        {formatCurrency(stockData.close)}
      </p>
      <div className="flex gap-2 mb-4">
        {getChangeIcon(stockData.sign)}
        <span className="bg-bg-tertiary text-xs flex gap-1.5 items-center px-1.5 py-[2px] w-fit rounded-[6px]">
          <Minus size={14} /> {formatCurrency(stockData.change)}
        </span>
      </div>
      <div className="border-y border-stroke-primary flex gap-6 text-xs">
        <button className="py-4 border-b border-txt-primary text-txt-primary -mb-[1px]">
          1D
        </button>
        <button className="py-4 text-txt-tertiary">1W</button>
        <button className="py-4 text-txt-tertiary">1M</button>
        <button className="py-4 text-txt-tertiary">1Y</button>
        <button className="py-4 text-txt-tertiary">All time</button>
      </div>
      <div className="w-full h-[200px] mt-6" >
        <CustomAreaChart />
      </div>
    </div>
  );
};

const StockBreakdown = ({ stockData }: { stockData: any }) => {
  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return `₦${num.toLocaleString()}`;
  };

  const formatVolume = (value: string) => {
    const num = parseFloat(value);
    return num.toLocaleString();
  };

  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] p-4">
      <p className="text-p3 sm:text-p2 font-semibold text-txt-primary mb-6">
        Stock breakdown
      </p>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Volume</p> <p>{formatVolume(stockData.volume)}</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Market Segment</p> <p>{stockData.mktSegment}</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>52W High</p> <p>{formatCurrency(stockData.weekHigh52)}</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>52W Low</p> <p>{formatCurrency(stockData.weekLow52)}</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>PE Ratio</p> <p>{stockData.peRatio}</p>
      </div>
    </div>
  );
};


