"use client";
import { Header } from "./_components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "./_components/overview";
import { Equities } from "./_components/equities";
import { MutualFund } from "./_components/mutual-fund";
import { FixedIncome } from "./_components/fixed-income";

const Dashboard = () => {
  return (
    <>
      <section className="min-h-dvh px-4 sm:px-6 py-4">
        <Header />
        <section>
          <Tabs defaultValue="overview">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="equities">Equities</TabsTrigger>
              <TabsTrigger value="mutual_fund">Mutual fund</TabsTrigger>
              {/* <TabsTrigger value="fixed_income">Fixed income</TabsTrigger> */}
            </TabsList>
            <TabsContent value="overview">
              <Overview />
            </TabsContent>
            <TabsContent value="equities">
              <Equities />
            </TabsContent>
             <TabsContent value="mutual_fund">
              <MutualFund />
            </TabsContent>
             <TabsContent value="fixed_income">
              <FixedIncome />
            </TabsContent>
          </Tabs>
        </section>
      </section>
    </>
  );
};
export { Dashboard };
