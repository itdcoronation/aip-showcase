"use client";

import { ROUTES } from "@/lib/routes";
import { usePathname } from "next/navigation";

const headerConfig: Record<string, { title: string; description?: string }> = {
  [ROUTES.insurance]: {
    title: "Insurance",
  },
  [ROUTES.insurance_policy]: {
    title: "Insurance Policy",
    description: "View and manage your insurance policies",
  },
};

const getHeader = (pathname: string) => {
  return (
    headerConfig[pathname as keyof typeof headerConfig] ?? {
      title: "Insurance",
      description: "",
    }
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const header = getHeader(pathname);

  return (
    <section className="px-4 sm:px-6 py-4">
      <header className="mb-4 sm:mb-8">
        <h1 className="text-p2 sm:text-p1 font-semibold">{header.title}</h1>
        {header.description ? (
          <p className="mt-1 text-p4 text-txt-secondary">
            {header.description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
};

export default Layout;
