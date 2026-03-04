import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

import { ReactNode, useState } from "react";

const Collapsible = ({ body, title }: { body: ReactNode; title: string }) => {
  const [show, setShow] = useState(true);
  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] p-4">
      <div className="flex items-center justify-between">
        <p className="text-p3 text-txt-primary font-semibold">{title}</p>

        <Button
          onClick={() => setShow((prev) => !prev)}
          className="h-7 w-7"
          variant={"outline"}
          size={"icon"}
        >
          <ChevronUp />
        </Button>
      </div>
      {show ? <div className="mt-1">{body}</div> : null}
    </div>
  );
};

export { Collapsible };
