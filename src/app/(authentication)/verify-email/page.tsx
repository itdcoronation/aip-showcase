import PageLoader from "@/components/page-loader";
import { VerifyEmailUI } from "@/modules";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <VerifyEmailUI />
    </Suspense>
  );
}
