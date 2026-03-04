import { Balance } from "../../../components/cards/balance";
import { CompleteOnboardingBanner } from "./complete-onboarding";
import { Services } from "./services";
import { TopRecommendedStocks } from "./top-recommended-stocks";
import { useFetchPortfolioBalance } from "@/requests/services/portfolio/balance";
import { formatCurrency } from "@/lib/utils";

const MutualFund = () => {
  const { data: portfolioData, isLoading } = useFetchPortfolioBalance();

  const ngnBalance =
    portfolioData?.data?.balance?.funds?.NGN_total_current_value || 0;
  const usdBalance =
    portfolioData?.data?.balance?.funds?.USD_total_current_value || 0;

  return (
    <section className="grid gap-10">
      <div className="flex-col sm:flex-row flex gap-8 sm:gap-10">
        <Balance
          amount={
            isLoading ? "Loading..." : formatCurrency(ngnBalance, "NGN")
          }
          title="Investment balance (NGN)"
          //rate={0}
          isLoading={isLoading}
        />
        <Balance
          amount={
            isLoading ? "Loading..." : formatCurrency(usdBalance, "USD")
          }
          title="Investment balance (USD)"
          //rate={0}
          isLoading={isLoading}
        />
      </div>
      <CompleteOnboardingBanner />
      <div>
        <TopRecommendedStocks />
      </div>
      <Services />
    </section>
  );
};

export { MutualFund };
