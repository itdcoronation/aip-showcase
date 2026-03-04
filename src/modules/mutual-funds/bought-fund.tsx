"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, TrendingUp } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { mutualFundLogo } from "@/assets/images";
import { Notice } from "@/components/notice";
import { ArrowElbowRightIcon } from "@/assets/vectors/icons";
import { useFetchFundDetails } from "@/requests/services/products";
import { useFetchFundHistory } from "@/requests/services/fund-history";
import { useFetchPortfolioFull } from "@/requests/services/portfolio/balance";
import { FundHistoryData } from "@/types/fund-history";
import { getCurrencySymbol, formatCurrencyByFundCode } from "@/lib/currency-mapping";
import { useMemo, useState } from "react";
import { NoticeModal } from "@/components/modals/notice-modal";
import { checkRedeemAvailability } from "@/lib/fund-restrictions";

const BoughtFundUI = () => {
  const router = useRouter();
  const { id } = useParams();
  const [redeemRestrictionMessage, setRedeemRestrictionMessage] = useState<string | undefined>();

  console.log('=== BoughtFundUI Initialization ===');
  console.log('Raw ID from params:', id);
  console.log('ID as string:', id as string);
  console.log('Type of ID:', typeof id);

  const { data: fundDetailsData, isLoading: fundDetailsLoading, error: fundDetailsError } = useFetchFundDetails({
    params: { fund_filter: id as string },
  });

  const { data: fundHistoryData, isLoading: historyLoading, error: historyError } = useFetchFundHistory({
    params: { fundId: id as string },
  });

  const { data: portfolioData, isLoading: portfolioLoading, error: portfolioError } = useFetchPortfolioFull();

  const fundData = fundDetailsData?.Data?.[0];

  // Find the current fund from portfolio data
  const currentFundData = useMemo(() => {
    if (!portfolioData?.data?.Data?.userFunds || !id) return null;
    return portfolioData.data.Data.userFunds.find(fund => fund.productCode === id);
  }, [portfolioData, id]);

  const isLoading = fundDetailsLoading || historyLoading || portfolioLoading;
  const hasError = fundDetailsError || historyError || portfolioError;

  // Debug logging
  console.log('=== BoughtFundUI Debug Info ===');
  console.log('Fund ID:', id);
  console.log('Fund Details - Loading:', fundDetailsLoading, 'Data:', fundDetailsData, 'Error:', fundDetailsError);
  console.log('Fund History - Loading:', historyLoading, 'Data:', fundHistoryData, 'Error:', historyError);
  console.log('Portfolio - Loading:', portfolioLoading, 'Data:', portfolioData, 'Error:', portfolioError);
  console.log('Fund Data from Details:', fundData);
  console.log('Current Fund Data from Portfolio:', currentFundData);
  console.log('Has Error:', hasError);
  console.log('Is Loading:', isLoading);

  if (hasError) {
    const errorMessage = 
      fundDetailsError ? "Error loading fund details" :
      historyError ? "Error loading fund history" :
      portfolioError ? "Error loading portfolio data" :
      "Error loading fund information";
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-txt-secondary">{errorMessage}. Please try again.</p>
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
              {isLoading ? "Loading..." : currentFundData?.productName || fundData?.fundName || "Fund Name"}
            </p>
            <p className="text-xs text-txt-success bg-bg-success-light p-1 w-fit rounded-[6px]">
              Estimated yield: {isLoading ? "Loading..." : fundData?.yield ? `${fundData.yield.toFixed(2)}%` : "N/A"}
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
          </div>
        </div>
        
        <div className="flex-col sm:flex-row flex gap-2 justify-between items-start">
          <div className="grid gap-1">
            <p className="text-xs text-txt-secondary">Current value</p>
            <p className="text-h2 text-[var(--purple-700)] font-semibold">
              {isLoading 
                ? "Loading..." 
                : currentFundData 
                  ? formatCurrencyByFundCode(currentFundData.totalAssetValue, currentFundData.productCode)
                  : "N/A"
              }
            </p>
            <span className="bg-bg-tertiary text-p3 flex gap-1.5 items-center px-1.5 py-[2px] w-fit rounded-[6px]">
              <ArrowElbowRightIcon /> 0%
            </span>
          </div>
        </div>

        <FundHistoryTable historyData={fundHistoryData?.Data || []} isLoading={historyLoading} fundCode={id as string} />
        
        <Notice
          title="Important"
          description="Please note that subscription made after 12pm will be applied in the next working day"
        />
      </section>
    </>
  );
};

interface FundHistoryTableProps {
  historyData: FundHistoryData[];
  isLoading: boolean;
  fundCode: string;
}

const FundHistoryTable: React.FC<FundHistoryTableProps> = ({ historyData, isLoading, fundCode }) => {
  const formatAmount = (credit: number, debit: number): string => {
    const amount = credit + debit;
    const currencySymbol = getCurrencySymbol(fundCode);
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] p-4">
      <p className="text-p2 font-semibold text-txt-primary mb-6">Transaction History</p>
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-txt-secondary">Loading transaction history...</p>
        </div>
      ) : historyData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-txt-secondary">No transaction history available</p>
        </div>
      ) : (
        <div className="space-y-0">
          {historyData.map((transaction, index) => (
            <div 
              key={index} 
              className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5"
            >
              <div className="flex-1">
                <p className="font-medium text-txt-primary mb-1">{transaction.description}</p>
                <p className="text-xs text-txt-secondary">{formatDate(transaction.valueDate)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-txt-primary">
                  {formatAmount(transaction.credit, transaction.debit)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { BoughtFundUI };