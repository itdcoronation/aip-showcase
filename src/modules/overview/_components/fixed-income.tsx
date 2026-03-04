import { Balance } from "../../../components/cards/balance";
import { CompleteOnboardingBanner } from "./complete-onboarding";
import { Services } from "./services";
import { TopRecommendedStocks } from "./top-recommended-stocks";

const FixedIncome = () => {
  return (
    <section className="grid gap-10">
      <div className="flex-col sm:flex-row flex gap-8 sm:gap-10">
        <Balance amount="₦ 0.00" title="Investment balance" rate={0} />
        <Balance amount="$ 0.00" title="Investment balance" rate={0} />
      </div>
      <CompleteOnboardingBanner />
      <TopRecommendedStocks />
      <Services />
    </section>
  );
};

export { FixedIncome };
