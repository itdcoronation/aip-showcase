"use client";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";

const EmbassyLetterUI = () => {
  const router = useRouter();
  return (
    <div className="py-4 px-3 border border-[#EEEFF1] rounded-md bg-white shadow-sm w-fit max-w-md">
      <p className="text-txt-primary mb-2 font-semibold text-sm">
        Request embassy letter
      </p>
      <p className="text-txt-tertiary mb-4 text-xs">
        A signed document reflecting your investment, suitable for submission to
        any embassy
      </p>
      <Button
        onClick={() => router.push(ROUTES.service_hub_embassy_request)}
        size={"xs"}
      >
        Send request
      </Button>
    </div>
  );
};

export { EmbassyLetterUI };
