"use client";
import PageLoader from "@/components/page-loader";
import { FixedIncomeCategoryUI } from "@/modules/fixed-income";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <FixedIncomeCategoryUI />
      </Suspense>
    </>
  );
}
