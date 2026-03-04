"use client";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Layout = ({ children }) => {
  const params = useSearchParams();
  const type = params.get("type");

  const pathname = usePathname();
  const router = useRouter();
  const tabs = [
    { label: "Basic profile", path: ROUTES.settings_profile },
    {
      label: type === "corporate" ? "KYB" : "KYC",
      path: type === "corporate" ? ROUTES.settings_kyb : ROUTES.settings_kyc,
    },
    // { label: "Bank information", path: ROUTES.settings_bank_info },
    ...[
      type === "corporate"
        ? { label: "Signatories", path: ROUTES.settings_reset_signatories }
        : { label: "Next of kin", path: ROUTES.settings_next_of_kin },
    ],
    { label: "Risk profile", path: ROUTES.settings_risk_profile },
    { label: "Reset password", path: ROUTES.settings_reset_password },
  ];
  return (
    <>
      <section className="px-6 py-4">
        <header className="mb-8">
          <h1 className="text-p1 font-semibold">Account settings</h1>
        </header>
        <section className="flex border-y border-stroke-primary gap-6 whitespace-nowrap overflow-auto mb-8">
          {tabs.map((tab) => (
            <button
              onClick={() => router.push(tab.path)}
              key={tab.path}
              className={cn(
                "py-4 cursor-pointer",
                tab.path === pathname
                  ? "text-txt-primary border-b border-txt-primary font-medium"
                  : "text-txt-tertiary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </section>
        {children}
      </section>
    </>
  );
};

export default Layout;
