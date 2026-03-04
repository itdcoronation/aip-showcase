"use client";

import { ROUTES } from "@/lib/routes";
import {
  BankIcon,
  BasketIcon,
  ChartLineUpIcon,
  HeadsetIcon,
  LayoutIcon,
  NewspaperClippingIcon,
  SignoutIcon,
  UserGearIcon,
  WalletIcon,
  WrenchIcon,
} from "@/assets/vectors/icons";
import { usePathname, useRouter } from "next/navigation";
import { clearTokens } from "@/requests/token";
import { NavItem, NavItemData } from "./nav-item";

export const NavSection = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItemData[] = [
    {
      title: "Overview",
      path: ROUTES.overview,
      icon: <LayoutIcon />,
      isActive: pathname === ROUTES.overview,
    },
    {
      title: "Recommended products",
      path: ROUTES.rec_products,
      icon: <BasketIcon />,
      isActive: pathname === ROUTES.rec_products,
    },
  ];

  const navItems2: NavItemData[] = [
    {
      title: "Equities",
      path: ROUTES.equities,
      icon: <ChartLineUpIcon />,
      isActive:
        pathname === ROUTES.equities || pathname.startsWith("/equities"),
    },
    {
      title: "Mutual funds",
      path: ROUTES.mutual_funds,
      icon: <WalletIcon />,
      isActive: pathname === ROUTES.mutual_funds,
    },
    {
      title: "Fixed income",
      path: ROUTES.fixed_income,
      icon: <BankIcon />,
      isActive:
        pathname === ROUTES.fixed_income ||
        pathname.startsWith("/fixed-income"),
    },
    {
      title: "Trustees",
      path: ROUTES.trustees,
      icon: <NewspaperClippingIcon />,
      isActive:
        pathname === ROUTES.trustees || pathname.startsWith("/trustees"),
    },
  ];

  const navItems3: NavItemData[] = [
    {
      title: "Service hub",
      path: ROUTES.service_hub_statement,
      icon: <UserGearIcon />,
      isActive: pathname.startsWith("/service-hub"),
    },
    {
      title: "Account setting",
      path: ROUTES.settings_profile,
      icon: <WrenchIcon />,
      isActive: pathname.startsWith("/settings"),
    },
    {
      title: "Contact us",
      icon: <HeadsetIcon />,
      path: ROUTES.contact,
      isActive: pathname === ROUTES.contact,
    },
  ];

  const logout = () => {
    // Handle logout logic here
    console.log("Logout clicked");
    localStorage.clear();
    clearTokens();
    router.push(ROUTES.login); // Redirect to login page after logout
  };

  const navItems4: NavItemData[] = [
    {
      title: "Logout",
      icon: <SignoutIcon />,
      type: "button",
      onClick: logout,
    },
  ];
  return (
    <section className="grid gap-4">
      <div>
        {navItems.map((item) => (
          <NavItem key={item.title} {...item} />
        ))}
      </div>
      <div>
        {navItems2.map((item) => (
          <NavItem key={item.title} {...item} />
        ))}
      </div>
      <div>
        {navItems3.map((item) => (
          <NavItem key={item.title} {...item} />
        ))}
      </div>
      <div>
        {navItems4.map((item) => (
          <NavItem key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
};
