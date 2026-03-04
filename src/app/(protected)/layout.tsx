import DashboardLayout from "@/components/layout";
import PageLoader from "@/components/page-loader";
import { Suspense } from "react";

const Layout = ({ children }) => {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <DashboardLayout>{children}</DashboardLayout>
      </Suspense>
    </>
  );
};

export default Layout;
