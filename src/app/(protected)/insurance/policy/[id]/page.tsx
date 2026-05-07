"use client";
import PageLoader from "@/components/page-loader";
import InsurancePolicyPreview from "@/modules/insurance/policy-preview";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <InsurancePolicyPreview />
      </Suspense>
    </>
  );
}
