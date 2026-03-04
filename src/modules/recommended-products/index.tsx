// import { FixedIncome } from "./_components/fixed-income";
// import { MutualFunds } from "./_components/mutual-funds";
import { TopRecommendedStocks } from "./_components/top-recommended-stocks";
// import { Trustees } from "./_components/trustees";

const RecommendedProductsUI = () => {
  return (
    <>
      <section className="px-4 sm:px-6 py-4">
        <header className="mb-8">
          <h1 className="text-p1 font-semibold">Recommended products</h1>
        </header>
        <section className="grid gap-8">
          <TopRecommendedStocks />
          {/* <MutualFunds />
          <FixedIncome />
          <Trustees /> */}
        </section>
      </section>
    </>
  );
};

export { RecommendedProductsUI };
