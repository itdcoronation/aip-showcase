"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, PlusCircle, TrendingUp } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { mutualFundLogo } from "@/assets/images";
import { Collapsible } from "@/components/collapsible";
import { Notice } from "@/components/notice";
import { BoughtFundUI } from "./bought-fund";
import { useState } from "react";
import { NoticeModal } from "@/components/modals/notice-modal";
import { checkRedeemAvailability } from "@/lib/fund-restrictions";
import { getCurrencySymbol } from "@/lib/currency-mapping";
import { getShowcaseMutualFund } from "./showcase-data";

const FundUI = () => {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const bought = searchParams.get("bought");
  const [redeemRestrictionMessage, setRedeemRestrictionMessage] = useState<
    string | undefined
  >();

  if (bought) {
    return <BoughtFundUI />;
  }

  const fundCode = typeof id === "string" ? id : "";
  const fundData = getShowcaseMutualFund(fundCode);
  const currencySymbol = getCurrencySymbol(fundData.code);

  return (
    <>
      <NoticeModal
        show={!!redeemRestrictionMessage}
        close={() => setRedeemRestrictionMessage(undefined)}
        type="info"
        title="Redeem Not Available"
        description={
          redeemRestrictionMessage || "This fund has redeem restrictions"
        }
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
              {fundData.name}
            </p>
            <p className="text-xs text-txt-success bg-bg-success-light p-1 w-fit rounded-[6px]">
              Estimated yield: {fundData.estimatedYield.toFixed(2)}%
            </p>
          </div>
          <div className="flex gap-2 ml-auto w-full sm:w-fit">
            <Button
              onClick={() => router.push(`/mutual-funds/${id}/invest`)}
              size={"m"}
            >
              Invest
              <TrendingUp />
            </Button>
            <Button
              onClick={() => {
                const redeemCheck = checkRedeemAvailability(id as string, fundData.name);

                if (!redeemCheck.isAvailable && redeemCheck.message) {
                  setRedeemRestrictionMessage(redeemCheck.message);
                  return;
                }

                router.push(`/mutual-funds/${id}/redeem`);
              }}
              size={"m"}
              variant={"secondary"}
            >
              Redeem
              <PlusCircle />
            </Button>
          </div>
        </div>

        <Collapsible
          title="About the fund"
          body={<p className="text-p4 text-txt-secondary max-w-[760px]">{fundData.about}</p>}
        />

        <Details
          details={[
            ["Fund type", fundData.fundType],
            ["Asset class", fundData.assetClass],
            ["Risk level", fundData.riskProfile],
            ["Estimated yield", `${fundData.estimatedYield.toFixed(2)}%`],
            [
              "Minimum investment amount",
              `${currencySymbol}${fundData.minimumInitialTransaction.toLocaleString()}`,
            ],
            [
              "Minimum additional transaction",
              `${currencySymbol}${fundData.minimumAdditionalTransaction.toLocaleString()}`,
            ],
            ["Minimum holding period", fundData.minimumHoldingPeriod],
            ["Benchmark", fundData.benchmark],
            ["Management fee", `${fundData.managementFee}%`],
            ["Fund launch date", new Date(fundData.launchDate).toLocaleDateString()],
          ]}
        />

        <Notice
          title="Important"
          description="Please note that subscription made after 12pm will be applied in the next working day"
        />

        <Button className="font-semibold" variant={"outline"}>
          <Download /> Fact sheet
        </Button>
      </section>
    </>
  );
};

const Details = ({ details }: { details: Array<[string, string]> }) => {
  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] p-4">
      <p className="text-p2 font-semibold text-txt-primary mb-6">Details</p>
      {details.map(([label, value]) => (
        <div
          key={label}
          className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5"
        >
          <p>{label}</p>
          <p className="text-right max-w-[60%]">{value}</p>
        </div>
      ))}
    </div>
  );
};

export { FundUI };
