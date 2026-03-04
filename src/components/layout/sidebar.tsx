"use client";

import { Logo } from "@/assets/vectors";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon, X } from "lucide-react";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import useUserStore from "@/store/user";
import { ProfileCard } from "./_components/profile-card";
import { Widget } from "./_components/widget";
import { NavSection } from "./_components/nav-section";

const Sidebar = () => {
  const { basic_info, risk_profile } = useUserStore();

  const { isMobile } = useDeviceSize(900);
  const pathname = usePathname();

  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    if (showNav) setShowNav(false);
  }, [pathname]);

  return (
    <>
      <aside
        className={cn(
          "bg-white min-h-dvh top-0 left-0 w-[270px] py-6 px-4 flex flex-col gap-8 border-r border-stroke-primary h-full overflow-auto hide-scrollbar",
          isMobile
            ? "min-h-0 w-dvw shadow-sm py-4 border-b border-stroke-parimary"
            : "fixed"
        )}
      >
        <section className="flex items-center justify-between">
          <Link href={ROUTES.overview} aria-label="Logo">
            <p className="sr-only">Logo</p>
            <Logo />
          </Link>

          {isMobile ? (
            <button onClick={() => setShowNav((prev) => !prev)}>
              <MenuIcon />
            </button>
          ) : null}
        </section>
        {!isMobile || (isMobile && showNav) ? (
          <div
            className={
              isMobile
                ? "fixed top-0 right-0 bg-white min-h-dvh p-4 w-[70%] max-w-[400px] flex flex-col gap-8 border-l border-stroke-primary z-[999999] overflow-auto h-full hide-scrollbar"
                : "flex flex-col gap-8"
            }
          >
            {isMobile ? (
              <button
                className="ml-auto"
                onClick={() => setShowNav((prev) => !prev)}
              >
                <X />
              </button>
            ) : null}
            <div>
              <ProfileCard
                name={
                  `${basic_info?.first_name ?? ""} ${
                    basic_info?.last_name ?? ""
                  }`.trim() || "User Name"
                }
                risk_category={risk_profile?.risk_category || ""}
              />
              {/* {accounts.length > 1 ? (
                <SwitchAccount
                  account={account}
                  setAccount={setAccount}
                  accounts={accounts}
                />
              ) : null} */}
            </div>

            <NavSection />
            <Widget />
          </div>
        ) : null}
      </aside>
    </>
  );
};

export default Sidebar;
