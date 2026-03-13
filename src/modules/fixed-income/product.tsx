"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, TrendingUp } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { mutualFundLogo } from "@/assets/images";
import { Collapsible } from "@/components/collapsible";
import { Notice } from "@/components/notice";
import { ArrowElbowRightIcon } from "@/assets/vectors/icons";
import { resolveShowcaseFixedIncomeName } from "@/lib/showcase-display-names";
import {
  fixedIncomeCategoryProducts,
  fixedIncomeTradesData,
} from "./showcase-data";

const FixedIncomeProductUI = () => {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const bought = searchParams.get("bought");
  const productId = typeof id === "string" ? id : undefined;
  const fallbackFundName = resolveShowcaseFixedIncomeName(productId);

  const categoryProduct = fixedIncomeCategoryProducts.find(
    (item) => item.id === productId
  );
  const tradeProduct = fixedIncomeTradesData.find((item) => item.id === productId);

  const fundName = categoryProduct?.name || tradeProduct?.name || fallbackFundName;
  const displayRate = categoryProduct?.rate ?? tradeProduct?.rate ?? 15.0;
  const displayType = categoryProduct?.type || tradeProduct?.fund_type || "Treasury bills";
  const displayTenure = categoryProduct?.tenure || "180 days";
  const displayIssuer =
    categoryProduct?.issuer || "Top-rated issuer in the Nigerian fixed income market";
  const aboutDescription =
    categoryProduct?.shortDescription ||
    "A fixed-income instrument designed to provide stable returns with predictable cashflows.";

  const amountInvested = tradeProduct?.amount_invested ?? 0;
  const currentValue = tradeProduct?.current_value ?? 0;
  const gainLoss = currentValue - amountInvested;
  const gainLossPercent =
    amountInvested > 0 ? Number(((gainLoss / amountInvested) * 100).toFixed(2)) : 0;
  const estimatedCouponAmount = amountInvested
    ? Math.round((amountInvested * displayRate) / 100)
    : 0;

  return (
    <>
      <Button onClick={router.back} variant={"ghost"} size={"sm"}>
        <ArrowLeft /> Back
      </Button>

      <section className="mx-auto max-w-[940px] mt-8 grid gap-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-bg-[#FFEBCC] w-[44px] h-[44px] sm:w-[58px] sm:h-[58px] rounded-full flex">
            <Image
              className="m-auto w-[44px] h-[44px] sm:w-[58px] sm:h-[58px]"
              src={mutualFundLogo}
              width={32}
              height={34}
              alt="logo"
            />
          </div>
          <div>
            <p className="text-txt-primary font-semibold text-sm sm:text-h4 mb-1">
              {fundName}
            </p>
            <p className="text-xs text-txt-success bg-bg-success-light p-1 w-fit rounded-[6px]">
              Rate: {displayRate.toFixed(2)}%
            </p>
          </div>
          <div className="flex gap-2 ml-auto w-full sm:w-fit">
            {bought ? (
              <>
                <Button
                  onClick={() => router.push(`/fixed-income/${id}/invest`)}
                  size={"m"}
                  variant={"secondary"}
                >
                  Top up
                  <PlusCircle />
                </Button>
                <Button
                  onClick={() => router.push(`/fixed-income/${id}/withdraw`)}
                  size={"m"}
                >
                  Sell
                  <TrendingUp />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => router.push(`/fixed-income/${id}/invest`)}
                size={"m"}
              >
                Invest
                <TrendingUp />
              </Button>
            )}
          </div>
        </div>
        {bought ? (
          <div className="flex-col sm:flex-row flex gap-2 justify-between items-start">
            <div className="grid gap-1">
              <p className="text-xs text-txt-secondary">Current value</p>
              <p className="text-h2 text-[var(--purple-700)] font-semibold">
                ₦{currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <span className="bg-bg-tertiary text-p3 flex gap-1.5 items-center px-1.5 py-[2px] w-fit rounded-[6px]">
                <ArrowElbowRightIcon /> {gainLossPercent}%
              </span>
            </div>
            <div className="hidden sm:grid gap-1">
              <p className="text-xs text-txt-secondary">Amount invested</p>
              <p className="text-h2 text-[var(--purple-700)] font-semibold">
                ₦{amountInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="hidden sm:grid gap-1">
              <p className="text-xs text-txt-secondary">Total gain/loss</p>
              <p className="text-h2 text-txt-success font-semibold">
                ₦{gainLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:hidden border-t border-t-stroke-primary w-full pt-6 mt-4">
              <div className="grid gap-1">
                <p className="text-xs text-txt-secondary">Amount invested</p>
                <p className="text-p1 sm:text-h2 text-[var(--purple-700)] font-semibold">
                  ₦{amountInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="grid gap-1">
                <p className="text-xs text-txt-secondary">Total gain/loss</p>
                <p className="text-p1 sm:text-h2 text-txt-success font-semibold">
                  ₦{gainLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Collapsible
            title={`About ${displayType}`}
            body={
              <p className="text-p4 text-txt-secondary max-w-[760px]">
                {aboutDescription} Issuer: {displayIssuer}.
              </p>
            }
          />
        )}

        {bought ? (
          <>
            <PurchasedDetails txnDate={tradeProduct?.txn_date} tenure={displayTenure} />
            <Notice
              title="Important"
              description="Please note that subscription made after 4pm will be applied in the next working day"
            />
          </>
        ) : (
          <Details
            type={displayType}
            rate={displayRate}
            tenure={displayTenure}
            issuer={displayIssuer}
            estimatedCouponAmount={estimatedCouponAmount}
            prospectusLink={categoryProduct?.prospectusLink}
          />
        )}
      </section>
    </>
  );
};

const Details = ({
  type,
  rate,
  tenure,
  issuer,
  estimatedCouponAmount,
  prospectusLink,
}: {
  type: string;
  rate: number;
  tenure: string;
  issuer: string;
  estimatedCouponAmount: number;
  prospectusLink?: string;
}) => {
  const riskLevel =
    type === "Treasury bills" ? "Low" : "Moderate";

  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] p-4">
      <p className="text-p2 font-semibold text-txt-primary mb-6">Details</p>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Type</p> <p>{type}</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Risk level</p> <p>{riskLevel}</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Issuer</p> <p>{issuer}</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Rate</p> <p>{rate.toFixed(2)}%</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Tenure</p> <p>{tenure}</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Estimated coupon amount</p>
        <p>₦{estimatedCouponAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      </div>
      {prospectusLink && (
        <div className="border-t border-stroke-primary pt-4 mt-2">
          <Button
            asChild
            variant="outline"
            size="m"
            className="w-full"
          >
            <a
              href={prospectusLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Bond Prospectus
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

const PurchasedDetails = ({ txnDate, tenure }: { txnDate?: string; tenure: string }) => {
  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] px-4">
      <div className="text-txt-tertiary flex justify-between items-center py-5">
        <p>Date purchased</p> <p>{txnDate || "-"}</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Maturity / Tenure</p> <p>{tenure}</p>
      </div>
    </div>
  );
};

export { FixedIncomeProductUI };
