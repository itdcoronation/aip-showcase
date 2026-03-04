import { CompleteOnboardingBanner } from "./complete-onboarding";
import { TopRecommendedStocks } from "./top-recommended-stocks";
import { Balance } from "../../../components/cards/balance";
import { Services } from "./services";
import { DoughnutChart } from "../../../components/charts/doughnut-chart";
import { useFetchPortfolioBalance } from "../../../requests/services/portfolio/balance";
import { formatCurrency } from "@/lib/utils";

const Overview = () => {
  const { data: portfolioData, isLoading } = useFetchPortfolioBalance();

  // Calculate NGN balance: stocks total_current_value + funds NGN_total_current_value
  const ngnBalance = portfolioData?.success 
    ? (portfolioData.data.balance.stocks.total_current_value || 0) + 
      (portfolioData.data.balance.funds.NGN_total_current_value || 0)
    : 0;

  // USD balance from funds USD_total_current_value
  const usdBalance = portfolioData?.success 
    ? portfolioData.data.balance.funds.USD_total_current_value || 0
    : 0;

  // Calculate rate for NGN balance (stocks value change percentage)
  //const ngnRate = portfolioData?.success 
   // ? portfolioData.data.balance.stocks.value_change_percentage || 0
   // : 0;
  // 'ngnRate' removed because it's not currently used in the UI. Reintroduce when needed.

  return (
    <section className="grid gap-10">
      <div className="flex gap-8 items-center">
        <div className="flex-col sm:flex-row flex gap-4 sm:gap-8">
          <Balance 
            title="Investment balance (NGN)" 
           // rate={ngnRate} 
            amount={isLoading ? "Loading..." : formatCurrency(ngnBalance, "NGN")}
            isLoading={isLoading} 
          />
          <Balance 
            title="Investment balance (USD)" 
            //rate={0} 
            amount={isLoading ? "Loading..." : formatCurrency(usdBalance, "USD")}
            isLoading={isLoading}
          />
        </div>
        <div className="hidden w-[98px] h-[98px] relative">
          <DoughnutChart />
          <div className="flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-[10px] text-txt-tertiary mb-1">Total</span>
            <span className="text-xs text-txt-primary">23</span>
          </div>
        </div>
        <div className="hidden grid gap-3" >
          <div className="flex gap-2 items-center">
            <div className="w-[10px] h-[10px] rounded-[2px] border border-0.5 border-[#8658F6] bg-[#EDEAFF]" />
            <p className="text-xs text-txt-primary"> Fixed income: 28%</p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-[10px] h-[10px] rounded-[2px] border border-0.5 border-[#F97316] bg-[#FFEDD5]" />
            <p className="text-xs text-txt-primary"> Equities: 40%</p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-[10px] h-[10px] rounded-[2px] border border-0.5 border-[#83CD13] bg-[#ECFCCB]" />
            <p className="text-xs text-txt-primary"> Mutual fund: 32%</p>
          </div>
        </div>
      </div>
      <CompleteOnboardingBanner />
      <div className="hidden">
        <TopRecommendedStocks />
      </div>
      <Services />
    </section>
  );
};

export { Overview };
