"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, TrendingUp } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { mutualFundLogo } from "@/assets/images";
import { Notice } from "@/components/notice";
import { ArrowElbowRightIcon } from "@/assets/vectors/icons";
import { getCurrencySymbol } from "@/lib/currency-mapping";
import { useState } from "react";
import { NoticeModal } from "@/components/modals/notice-modal";
import { checkRedeemAvailability } from "@/lib/fund-restrictions";
import {
  getShowcaseMutualFund,
  showcaseMutualFundHistoryByCode,
} from "./showcase-data";

const BoughtFundUI = () => {
  const router = useRouter();
  const { id } = useParams();
  const [redeemRestrictionMessage, setRedeemRestrictionMessage] = useState<
    string | undefined
  >();

  const fundCode = typeof id === "string" ? id : "";
  const fund = getShowcaseMutualFund(fundCode);
  const currencySymbol = getCurrencySymbol(fund.code);
  const gainLoss = fund.currentValue - fund.amountInvested;
  const gainLossPercent = Number(((gainLoss / fund.amountInvested) * 100).toFixed(2));
  const fundHistory = showcaseMutualFundHistoryByCode[fund.code] || [];

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
              {fund.name}
            </p>
            <p className="text-xs text-txt-success bg-bg-success-light p-1 w-fit rounded-[6px]">
              Estimated yield: {fund.estimatedYield.toFixed(2)}%
            </p>
          </div>
          <div className="flex gap-2 ml-auto w-full sm:w-fit">
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
                const redeemCheck = checkRedeemAvailability(id as string, fund.name);

                if (!redeemCheck.isAvailable && redeemCheck.message) {
                  setRedeemRestrictionMessage(redeemCheck.message);
                  return;
                }

                router.push(`/mutual-funds/${id}/redeem`);
              }}
              size={"m"}
            >
              Redeem
              <TrendingUp />
            </Button>
          </div>
        </div>

        <div className="flex-col sm:flex-row flex gap-2 justify-between items-start">
          <div className="grid gap-1">
            <p className="text-xs text-txt-secondary">Current value</p>
            <p className="text-h2 text-[var(--purple-700)] font-semibold">
              {currencySymbol}
              {fund.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <span className="bg-bg-tertiary text-p3 flex gap-1.5 items-center px-1.5 py-[2px] w-fit rounded-[6px]">
              <ArrowElbowRightIcon /> {gainLossPercent}%
            </span>
          </div>
          <div className="hidden sm:grid gap-1">
            <p className="text-xs text-txt-secondary">Amount invested</p>
            <p className="text-h2 text-[var(--purple-700)] font-semibold">
              {currencySymbol}
              {fund.amountInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="hidden sm:grid gap-1">
            <p className="text-xs text-txt-secondary">Total gain/loss</p>
            <p className="text-h2 text-txt-success font-semibold">
              {currencySymbol}
              {gainLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <FundHistoryTable historyData={fundHistory} fundCode={fund.code} />

        <Notice
          title="Important"
          description="Please note that subscription made after 12pm will be applied in the next working day"
        />
      </section>
    </>
  );
};

interface FundHistoryTableProps {
  historyData: Array<{
    description: string;
    valueDate: string;
    credit: number;
    debit: number;
  }>;
  fundCode: string;
}

const FundHistoryTable: React.FC<FundHistoryTableProps> = ({
  historyData,
  fundCode,
}) => {
  const currencySymbol = getCurrencySymbol(fundCode);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] p-4">
      <p className="text-p2 font-semibold text-txt-primary mb-6">Transaction History</p>
      {historyData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-txt-secondary">No transaction history available</p>
        </div>
      ) : (
        <div className="space-y-0">
          {historyData.map((transaction, index) => {
            const amount = transaction.credit + transaction.debit;
            return (
              <div
                key={index}
                className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5"
              >
                <div className="flex-1">
                  <p className="font-medium text-txt-primary mb-1">{transaction.description}</p>
                  <p className="text-xs text-txt-secondary">
                    {formatDate(transaction.valueDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-txt-primary">
                    {currencySymbol}
                    {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { BoughtFundUI };
