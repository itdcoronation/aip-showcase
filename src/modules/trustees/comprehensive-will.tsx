"use client";
import { CheckCircleIcon } from "@/assets/vectors/icons";
import { NoticeModal } from "@/components/modals/notice-modal";
import { Button } from "@/components/ui/button";
import { ChevronRight, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ComprehensiveWillUI = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  const steps = [
    {
      title: "Click the “Request Form” button below",
      description:
        "A form will be sent as an attachment to your registered email",
    },
    {
      title: "Download the form",
    },
    {
      title: "Complete the form",
    },
    {
      title: "Submit the completed form using the URL specified in the email",
    },
  ];

  return (
    <>
      <NoticeModal
        show={show}
        close={() => setShow(false)}
        description="Your form has been successfully submitted. A correspondent will reach out to you soon."
        title="Successful"
        action={{
          text: (
            <>
              Go to portfolio{" "}
              <ChevronRight className="min-w-[20px] !h-[20px]" />
            </>
          ),
          action: console.log,
        }}
      />

      <Button onClick={router.back} variant={"ghost"} size={"sm"}>
        <XIcon /> Cancel
      </Button>

      <section className="mx-auto max-w-[940px] mt-8 grid gap-8">
        <div className="">
          <h2 className="text-h4 sm:text-h3 font-semibold text-txt-primary mb-1">
            Purchase Comprehensive Will
          </h2>
          <p className="text-p4 sm:text-p3 text-txt-tertiary">
            To purchase this product follow the prompt
          </p>
        </div>

        <div className="grid gap-5">
          {steps.map((step) => (
            <div key={`step-${step.title}`} className="flex gap-2">
              <CheckCircleIcon className="mt-0.5" />
              <div className="grid gap-1">
                <p className="font-medium text-txt-primary">{step.title}</p>
                {step.description ? (
                  <p className="text-txt-secondary text-xs">
                    {step.description}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <Button onClick={() => setShow(true)} className="w-full">
          Request form <ChevronRight />
        </Button>
      </section>
    </>
  );
};

export { ComprehensiveWillUI };
