import PageLoader from "@/components/page-loader";
import { OverviewUI } from "@/modules";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <OverviewUI />
      </Suspense>
    </>
  );
}
