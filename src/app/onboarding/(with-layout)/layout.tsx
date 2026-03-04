import PageLoader from "@/components/page-loader";
import OnboardingLayout from "@/modules/onboarding/_components/layout";
import { ReactNode, Suspense } from "react";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <OnboardingLayout>{children}</OnboardingLayout>
    </Suspense>
  );
};

export default Layout;
