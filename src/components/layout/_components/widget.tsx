"use client";

import { ROUTES } from "@/lib/routes";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";

export const Widget = () => {
  const router = useRouter();
  return (
    <section className="mt-auto bg-bg-brand bg-[url('/sidebar-widget-bg.png')] p-3 rounded-[12px] text-white bg-cover">
      <p className="text-[20px] mb-1 w-[60%] font-semibold">
        Build financial freedom for your wards
      </p>
      <p className="text-xs mb-4 max-w-[180px]">
        Create and manage an investment profile for your children
      </p>

      <Button
        disabled
        onClick={() => router.push(ROUTES.onboarding_minor_account_personal)}
        className="bg-white hover:bg-black hover:!text-white !text-black px-8 disabled:opacity-85"
        size={"m"}
      >
        Coming soon <PlusCircleIcon />
      </Button>
    </section>
  );
};
