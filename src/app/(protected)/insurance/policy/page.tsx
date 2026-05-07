"use client";
import PageLoader from "@/components/page-loader";
import { InsurancePolicyList } from "@/modules/insurance/policy-list";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <InsurancePolicyList />
      </Suspense>
    </>
  );
}
