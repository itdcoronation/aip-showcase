"use client";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Layout = ({ children }) => {
  const pathname = usePathname();

  const showTitle = pathname === ROUTES.equities;
  return (
    <section className="px-4 sm:px-6 py-4">
      <header className={cn("mb-4 sm:mb-8", !showTitle ? "hidden sm:block" : "")}>
        <h1 className="text-p2 sm:text-p1 font-semibold">Equities</h1>
      </header>
      {children}
    </section>
  );
};

export default Layout;
