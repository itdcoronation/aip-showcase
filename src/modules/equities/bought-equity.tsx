"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, PlusCircle, TrendingUp } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { mutualFundLogo, newsImg } from "@/assets/images";
import { ArrowElbowRightIcon } from "@/assets/vectors/icons";
import { Collapsible } from "@/components/collapsible";
import { CustomAreaChart } from "@/components/charts/area-chart";
import { getShowcaseOwnedStock, getShowcaseStockDetail } from "./showcase-data";

const BoughtEquityUI = () => {
  const router = useRouter();
  const { id } = useParams();
  const stockData = getShowcaseStockDetail(typeof id === "string" ? id : "");
  const userStockData = getShowcaseOwnedStock(typeof id === "string" ? id : "");

  const handleBuyMore = () => {
    router.push(`/equities/${id}/buy`);
  };
  
  const handleSell = () => {
    router.push(`/equities/${id}/sell`);
  };

  return (
    <>
      <Button onClick={router.back} variant={"ghost"} size={"sm"}>
        <ArrowLeft /> Back
      </Button>

      <section className="mx-auto max-w-[940px] mt-8 grid gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-bg-secondary w-[40px] h-[40px] sm:w-[58px] sm:h-[58px] rounded-full flex border">
            {userStockData.icon_url || stockData.iconUrl ? (
              <Image
                className="m-auto"
                src={userStockData.icon_url || stockData.iconUrl}
                width={32}
                height={34}
                alt={`${userStockData.name || stockData.name} logo`}
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
              {userStockData.name || stockData.name}
            </p>
            <p className="text-sm sm:text-p3 text-txt-secondary">{userStockData.symbol || stockData.symbol}</p>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button
              onClick={handleBuyMore}
              size={"m"}
              variant={"secondary"}
            >
              <span className="hidden sm:inline-block">Buy more</span>
              <PlusCircle />
            </Button>
            <Button
              onClick={handleSell}
              size={"m"}
            >
              Sell
              <TrendingUp />
            </Button>
          </div>
        </div>

        {/* Portfolio Stats Section */}
        <div className="flex-col sm:flex-row flex gap-2 justify-between items-start">
          <div className="grid gap-1">
            <p className="text-xs text-txt-secondary">Current value</p>
            <p className="text-h2 text-[var(--purple-700)] font-semibold">
              ₦{userStockData.currentValue.toLocaleString()}
            </p>
            <span className={`text-p3 flex gap-1.5 items-center px-1.5 py-[2px] w-fit rounded-[6px] ${
              userStockData.valueChangePercent >= 0 
                ? 'bg-bg-success-light text-txt-success' 
                : 'bg-bg-error-light text-txt-error'
            }`}>
              <ArrowElbowRightIcon /> {userStockData.valueChangePercent.toFixed(2)}%
            </span>
          </div>
          <div className="hidden sm:grid gap-1">
            <p className="text-xs text-txt-secondary">Amount invested</p>
            <p className="text-h2 text-[var(--purple-700)] font-semibold">
              ₦{userStockData.startValue.toLocaleString()}
            </p>
          </div>
          <div className="hidden sm:grid gap-1">
            <p className="text-xs text-txt-secondary">Total gain/loss</p>
            <p className={`text-h2 font-semibold ${
              userStockData.valueChange >= 0 ? 'text-txt-success' : 'text-txt-error'
            }`}>
              ₦{userStockData.valueChange.toLocaleString()}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:hidden border-t border-t-stroke-primary w-full pt-6 mt-4">
            <div className="grid gap-1">
              <p className="text-xs text-txt-secondary">Amount invested</p>
              <p className="text-p1 sm:text-h2 text-[var(--purple-700)] font-semibold">
                ₦{userStockData.startValue.toLocaleString()}
              </p>
            </div>
            <div className="grid gap-1">
              <p className="text-xs text-txt-secondary">Total gain/loss</p>
              <p className={`text-p1 sm:text-h2 font-semibold ${
                userStockData.valueChange >= 0 ? 'text-txt-success' : 'text-txt-error'
              }`}>
                ₦{userStockData.valueChange.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Details Table */}
        <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] px-4">
          <div className="text-txt-tertiary flex justify-between items-center py-5">
            <p>Units held</p> <p>{userStockData.restQuantity.toLocaleString()}</p>
          </div>
          <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
            <p>Purchase price</p> <p>₦{userStockData.buyPrice.toLocaleString()}</p>
          </div>
          <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
            <p>Current price</p> <p>₦{userStockData.currentPrice.toLocaleString()}</p>
          </div>
          <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
            <p>Market cap</p> <p>{stockData.mktSegment}</p>
          </div>
          <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
            <p>Sector</p> <p>{userStockData.sector}</p>
          </div>
          <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
            <p>Volume</p> <p>{parseFloat(stockData.volume).toLocaleString()}</p>
          </div>
        </div>

        {/* Stats and Stock Breakdown Section */}
        <div className="grid sm:grid-cols-[2fr_1.4fr] gap-4">
          <Stats stockData={stockData} userStockData={userStockData} />
          <StockBreakdown stockData={stockData} />
        </div>

        {/* About Company Section */}
        <Collapsible
          title={`About ${userStockData.name || stockData.name}`}
          body={
            <p className="text-p4 text-txt-secondary max-w-[760px]">
              {stockData.about}
            </p>
          }
        />

        {/* News Section */}
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
          title={`${userStockData.name || stockData.name} News`}
        />
      </section>
    </>
  );
};

const Stats = ({ stockData, userStockData }: { stockData: any; userStockData: any }) => {
  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `₦${num.toLocaleString()}`;
  };

  const getChangeIcon = (sign: string, changePercent: string) => {
    return sign === '+' ? (
      <span className="bg-bg-success-light text-txt-success text-xs flex gap-1.5 items-center px-1.5 py-[2px] w-fit rounded-[6px]">
        <ArrowElbowRightIcon size={14} /> {changePercent}%
      </span>
    ) : (
      <span className="bg-bg-error-light text-txt-error text-xs flex gap-1.5 items-center px-1.5 py-[2px] w-fit rounded-[6px]">
        <ArrowElbowRightIcon size={14} /> {changePercent}%
      </span>
    );
  };

  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] p-4">
      <p className="text-h3 sm:text-h2 font-semibold text-[var(--purple-700)] mb-4">
        {formatCurrency(userStockData.currentPrice)}
      </p>
      <div className="flex gap-2 mb-4">
        {getChangeIcon(stockData.sign, stockData.changePercent)}
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

export { BoughtEquityUI };