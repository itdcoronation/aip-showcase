"use client"
import { useDeviceSize } from "@/hooks/useDeviceSize";
import Sidebar from "./sidebar";
import { cn } from "@/lib/utils";
import isAuth from "@/lib/auth-guard";

const DashboardLayout = ({ children }) => {
  const { isMobile } = useDeviceSize(900);

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "bg-[#FCFCFD] text-sm",
          isMobile ? "ml-0" : "ml-[270px]"
        )}
      >
        {children}
      </main>
    </>
  );
};

export default isAuth(DashboardLayout);
