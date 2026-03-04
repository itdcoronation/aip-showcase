"use client";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

const Layout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const tabs = [
    // { label: "Account update", path: ROUTES.service_hub_account },
    // { label: "Embassy letter", path: ROUTES.service_hub_embassy },
    { label: "Account statement", path: ROUTES.service_hub_statement },
    // { label: "Minor account", path: ROUTES.service_hub_minor_account },
    // { label: "Referral", path: ROUTES.service_hub_referral },
    { label: "Recurring Payments", path: ROUTES.service_hub_recurring_payments },
    { label: "FAQs", path: ROUTES.service_hub_faqs },
  ];
  return (
    <>
      <section className="px-4 sm:px-6 py-4">
        <header className="mb-8">
          <h1 className="text-p1 font-semibold">Service hub</h1>
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
