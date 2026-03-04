"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, PlusCircle, TrendingUp } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { mutualFundLogo } from "@/assets/images";
import { Collapsible } from "@/components/collapsible";
import { Notice } from "@/components/notice";
import { ArrowElbowRightIcon } from "@/assets/vectors/icons";
import { useFetchFundDetails } from "@/requests/services/products";
import { FundDetailsData } from "@/types/fund-details";
import { BoughtFundUI } from "./bought-fund";
import { useState } from "react";
import { NoticeModal } from "@/components/modals/notice-modal";
import { checkRedeemAvailability } from "@/lib/fund-restrictions";

const FundUI = () => {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const bought = searchParams.get("bought");
  const [redeemRestrictionMessage, setRedeemRestrictionMessage] = useState<string | undefined>();

  const {
    data: fundDetailsData,
    isLoading,
    error,
  } = useFetchFundDetails({
    params: { fund_filter: id as string },
  });

  // If bought parameter exists, render the BoughtFundUI instead
  if (bought) {
    return <BoughtFundUI />;
  }

  const fundData = fundDetailsData?.Data?.[0];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-txt-secondary">
          Error loading fund details. Please try again.
        </p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <>
      <NoticeModal
        show={!!redeemRestrictionMessage}
        close={() => setRedeemRestrictionMessage(undefined)}
        type="info"
        title="Redeem Not Available"
        description={redeemRestrictionMessage || "This fund has redeem restrictions"}
        action={{
          text: "Ok",
          action: () => setRedeemRestrictionMessage(undefined),
        }}
      />
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
              {isLoading ? "Loading..." : fundData?.fundName || "Fund Name"}
            </p>
            <p className="text-xs text-txt-success bg-bg-success-light p-1 w-fit rounded-[6px]">
              Estimated yield:{" "}
              {isLoading
                ? "Loading..."
                : fundData?.yield
                ? `${fundData.yield.toFixed(2)}%`
                : "N/A"}
            </p>
          </div>
          <div className="flex gap-2 ml-auto w-full sm:w-fit">
            {bought ? (
              <>
                <Button
                  onClick={() => router.push(`/mutual-funds/${id}/invest`)}
                  size={"m"}
                  variant={"secondary"}
                >
                  Top up
                  <PlusCircle />
                </Button>
                <Button
                  onClick={() => {
                    // Check if redeem is restricted for this fund
                    const redeemCheck = checkRedeemAvailability(id as string, fundData?.fundName);
                    
                    if (!redeemCheck.isAvailable && redeemCheck.message) {
                      // Show restriction notice modal
                      setRedeemRestrictionMessage(redeemCheck.message);
                      return;
                    }
                    
                    // Navigate to redeem page if not restricted
                    router.push(`/mutual-funds/${id}/redeem`);
                  }}
                  size={"m"}
                >
                  Redeem
                  <TrendingUp />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => router.push(`/mutual-funds/${id}/invest`)}
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
                ₦400,000,000.00
              </p>
              <span className="bg-bg-tertiary text-p3 flex gap-1.5 items-center px-1.5 py-[2px] w-fit rounded-[6px]">
                <ArrowElbowRightIcon /> 0%
              </span>
            </div>
            {/* <div className="hidden sm:grid gap-1">
              <p className="text-xs text-txt-secondary">Amount invested</p>
              <p className="text-h2 text-[var(--purple-700)] font-semibold">
                ₦400,000,000.00
              </p>
            </div>
            <div className="hidden sm:grid gap-1">
              <p className="text-xs text-txt-secondary">Total gain/loss</p>
              <p className="text-h2 text-txt-success font-semibold">
                ₦400,000,000.00
              </p>
            </div> */}
            {/* <div className="grid grid-cols-2 gap-4 sm:hidden border-t border-t-stroke-primary w-full pt-6 mt-4">
              <div className="grid gap-1">
                <p className="text-xs text-txt-secondary">Amount invested</p>
                <p className="text-p1 sm:text-h2 text-[var(--purple-700)] font-semibold">
                  ₦400,000,000.00
                </p>
              </div>
              <div className="grid gap-1">
                <p className="text-xs text-txt-secondary">Total gain/loss</p>
                <p className="text-p1 sm:text-h2 text-txt-success font-semibold">
                  ₦400,000,000.00
                </p>
              </div>
            </div> */}
          </div>
        ) : (
          ""
        )}
        <Collapsible
          title="About the fund"
          body={
            <p className="text-p4 text-txt-secondary max-w-[760px]">
              {isLoading
                ? "Loading..."
                : fundData?.aboutFund || "Fund description not available."}
            </p>
          }
        />
        <Details fundData={fundData} isLoading={isLoading} />
        {bought ? (
          <Notice
            title="Important"
            description="Please note that subscription made after 12pm will be applied in the next working day"
          />
        ) : (
          <Button
            className="font-semibold"
            variant={"outline"}
            onClick={() => {
              if (fundData?.prospectus) {
                window.open(fundData.prospectus, "_blank");
              }
            }}
            disabled={isLoading || !fundData?.prospectus}
          >
            <Download /> Fact sheet
          </Button>
        )}
      </section>
    </>
  );
};

interface DetailsProps {
  fundData?: FundDetailsData;
  isLoading: boolean;
}

const Details: React.FC<DetailsProps> = ({ fundData, isLoading }) => {
  const formatLabel = (key: string): string => {
    const labelMap: { [key: string]: string } = {
      fundType: "Fund type",
      yield: "Estimated yield",
      yieldType: "Yield type",
      riskProfile: "Risk level",
      minimumInitialTransaction: "Minimum investment amount",
      benchmark: "Benchmark",
      managementFees: "Management fee",
      earlyRedemptionCharge: "Penalty of early withdrawal",
      assetClass: "Asset class",
      currency: "Currency",
      accounting: "Accounting",
      incomeDistribution: "Income distribution",
      minimumHoldingPeriod: "Minimum holding period",
      minimumAdditionalTransaction: "Minimum additional transaction",
      entryCharge: "Entry charge",
      exitCharge: "Exit charge",
      fundLaunchDate: "Fund launch date",
      quarter: "Quarter",
      benchmarkReturn: "Benchmark return",
      ytdAtQuarterEnd: "YTD at quarter end",
      outperformance: "Outperformance",
      expenseRatio: "Expense ratio",
    };
    return labelMap[key] || key;
  };

  const formatValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return "N/A";

    switch (key) {
      case "yield":
      case "benchmarkReturn":
      case "ytdAtQuarterEnd":
      case "outperformance":
        return `${Number(value).toFixed(2)}%`;
      case "managementFees":
        return `${value}%`;
      case "earlyRedemptionCharge":
        return value === "0.02" ? "2%" : `${Number(value)}%`;
      case "fundLaunchDate":
        return new Date(value).toLocaleDateString();
      case "minimumInitialTransaction":
      case "minimumAdditionalTransaction":
        return `₦${Number(value).toLocaleString()}`;
      default:
        return String(value);
    }
  };

  const detailFields = [
    "fundType",
    "yield",
    "yieldType",
    "riskProfile",
    "minimumInitialTransaction",
    "benchmark",
    "managementFees",
    "earlyRedemptionCharge",
    "assetClass",
    "currency",
    "accounting",
    "incomeDistribution",
    "minimumHoldingPeriod",
    "minimumAdditionalTransaction",
    "entryCharge",
    "exitCharge",
    "fundLaunchDate",
    "quarter",
    "benchmarkReturn",
    "ytdAtQuarterEnd",
    "outperformance",
    "expenseRatio",
  ];

  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] p-4">
      <p className="text-p2 font-semibold text-txt-primary mb-6">Details</p>
      {detailFields.map((field) => (
        <div
          key={field}
          className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5"
        >
          <p>{formatLabel(field)}</p>
          <p className="text-right max-w-[60%]">
            {isLoading
              ? "Loading..."
              : fundData
              ? formatValue(field, fundData[field as keyof FundDetailsData])
              : "N/A"}
          </p>
        </div>
      ))}
    </div>
  );
};

export { FundUI };
