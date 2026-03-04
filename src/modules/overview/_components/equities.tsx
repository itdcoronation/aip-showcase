import { Button } from "@/components/ui/button";
import { Balance } from "../../../components/cards/balance";
import { CompleteOnboardingBanner } from "./complete-onboarding";
import { Services } from "./services";
import { TopRecommendedStocks } from "./top-recommended-stocks";
import { PlusCircle, Wallet2 } from "lucide-react";
import { useFetchBrokerageBalance } from "@/requests/services/equities/balance";
import { useFetchPortfolioBalance } from "@/requests/services/portfolio/balance";
import { useMemo, useState } from "react";
import { NoticeModal } from "@/components/modals/notice-modal";

const Equities = () => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  // Fetch brokerage balance data
  const { data: brokerageData, isLoading: brokerageLoading } = useFetchBrokerageBalance();

  // Fetch portfolio data for investment balance
  const { data: portfolioData, isLoading: portfolioLoading } = useFetchPortfolioBalance();

  // Format brokerage balance for display
  const brokerageAmount = useMemo(() => {
    if (brokerageLoading) return "Loading...";
    
    const balance = brokerageData?.data?.Data?.wallet?.brokerage_balance;
    if (balance !== undefined && balance !== null) {
      return `₦ ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    return "₦ 0.00";
  }, [brokerageData, brokerageLoading]);

  // Format investment balance for display
  const investmentAmount = useMemo(() => {
    if (portfolioLoading) return "Loading...";
    
    const totalCurrentValue = portfolioData?.data?.balance?.stocks?.total_current_value;
    if (totalCurrentValue !== undefined && totalCurrentValue !== null) {
      return `₦ ${totalCurrentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    return "₦ 0.00";
  }, [portfolioData, portfolioLoading]);

  // Get investment balance rate (value change percentage)
  const investmentRate = useMemo(() => {
    if (portfolioLoading) return 0;
    
    const valueChangePercentage = portfolioData?.data?.balance?.stocks?.value_change_percentage;
    return valueChangePercentage || 0;
  }, [portfolioData, portfolioLoading]);

  // TODO: Will be integrated in later sprint
  const handleFund = () => {
    // router.push(ROUTES.equities_fund);
    setShowComingSoonModal(true);
  };
  const handleWithdraw = () => {
    // router.push(ROUTES.equities_withdraw);
    setShowComingSoonModal(true);
  };

  return (
    <>
      <NoticeModal
        show={showComingSoonModal}
        close={() => setShowComingSoonModal(false)}
        type="info"
        title="Coming Soon"
        description="This feature is coming soon"
        action={{
          text: "Ok",
          action: () => setShowComingSoonModal(false),
        }}
      />
      <section className="grid gap-10">
        <div className="flex-col sm:flex-row flex gap-8 sm:gap-10">
          <Balance
            amount={brokerageAmount}
            title="Brokerage account"
            ctas={
              <>
                <div className="flex gap-2">
                  <Button onClick={handleFund} size={"sm"}>
                    Fund <PlusCircle size={16} />
                  </Button>
                  <Button
                    onClick={handleWithdraw}
                    size={"sm"}
                    variant={"outline"}
                  >
                    Withdraw <Wallet2 size={16} />
                  </Button>
                </div>
              </>
            }
          />
          <Balance 
            amount={investmentAmount} 
            title="Investment balance" 
            rate={investmentRate} 
          />
        </div>
        <CompleteOnboardingBanner />
        <div className="hidden">
          <TopRecommendedStocks />
        </div>
        <Services />
      </section>
    </>
  );
};

export { Equities };
