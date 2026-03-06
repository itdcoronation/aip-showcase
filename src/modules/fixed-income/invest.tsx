import { Button } from "@/components/ui/button";
import { ChevronRight, XIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import CurrencyInput from "react-currency-input-field";
import { Notice } from "@/components/notice";
import { NoticeModal } from "@/components/modals/notice-modal";
import { resolveShowcaseFixedIncomeName } from "@/lib/showcase-display-names";

const FIXED_INCOME_MINIMUM_INVESTMENT = 5000000;

const InvestFixedIncomeUI = () => {
  const [show, setShow] = useState(false);
  // const [step, setStep] = useState(1);
  const router = useRouter();
  const { id } = useParams();
  const fundName = resolveShowcaseFixedIncomeName(
    typeof id === "string" ? id : undefined
  );

  return (
    <>
      <NoticeModal
        show={show}
        close={() => setShow(false)}
        type="success"
        title="Request received"
        description="A member of our fixed income team will reach out to you for further discussion "
        action={{
          text: (
            <>
              Go to portfolio <ChevronRight />{" "}
            </>
          ),
          action: console.log,
        }}
      />

      <Button onClick={router.back} variant={"ghost"} size={"sm"}>
        <XIcon /> Cancel
      </Button>
      <section className="mx-auto max-w-[940px] mt-8">
        {/* <p className="text-txt-success mb-8">Step {step} of 2</p> */}
        <section className="grid gap-8">
          <div className="">
            <h2 className="text-h4 sm:text-h3 font-semibold text-txt-primary mb-1">
              Invest {fundName}
            </h2>
            <p className="text-p4 sm:text-p3 text-txt-tertiary">
              Please enter the amount of you would like to invest
            </p>
          </div>

          <Step1Form handleNext={() => setShow(true)} />
        </section>
      </section>
    </>
  );
};

const step1FormSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => {
        // Remove commas and parse to number
        const num = Number(val.replace(/,/g, ""));
        return !isNaN(num) && num >= FIXED_INCOME_MINIMUM_INVESTMENT;
      },
      { message: "This amount doesn’t meet the minimum investment requirement" }
    ),
});

type Step1FormData = z.infer<typeof step1FormSchema>;
const Step1Form = ({ handleNext }: { handleNext: () => void }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1FormSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<Step1FormData> = (data) => {
    console.log(data);
    handleNext();
  };

  return (
    <>
      <form className="grid gap-8">
        <div>
            <div className="flex-col flex gap-4 justify-between border border-stroke-secondary bg-bg-secondary px-4 py-4 sm:py-6 rounded-[12px]">
            <div className="">
              <p className="text-txt-secondary mb-2">Amount to buy</p>
              <div className="flex gap-2">
                <p className="text-h2 text-txt-tertiary items-center">₦</p>
                <CurrencyInput
                  {...register("amount", {
                    required: true,
                  })}
                  decimalsLimit={2}
                  className="text-h2 w-full"
                  placeholder="0.00"
                />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-txt-secondary">
              Minimum investment amount:{""}
              <span className="font-semibold text-txt-primary">
                ₦ {FIXED_INCOME_MINIMUM_INVESTMENT.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </p>
          </div>
          {errors.amount?.message ? (
            <small className="block mt-1 text-txt-danger !text-l1 md:!text-p3">
              {errors.amount?.message}
            </small>
          ) : (
            ""
          )}
        </div>
        {isValid ? (
          <>
            <Breakdown />
            <Notice
              title="Important"
              description="Please note that subscription made after 12pm will be applied in the next working day"
            />
          </>
        ) : null}
        <div>
          <Button
            disabled={!isValid}
            onClick={handleSubmit(onSubmit)}
            className="w-full mb-2"
          >
            Submit request <ChevronRight />
          </Button>
          <p className="text-center text-p4 text-xs text-txt-secondary">
            By placing an order you admit that you understand the investment
            risk and the significance of seeking professional advice.{" "}
            <span className="text-txt-brand">Advisory clause</span>
          </p>
        </div>
      </form>
    </>
  );
};

export { InvestFixedIncomeUI };

const Breakdown = () => {
  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] px-4">
      <div className="text-txt-tertiary flex justify-between items-center py-5">
        <p>Fees + Charges</p> <p>11,020,084</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Total amount due</p> <p>11,020,084</p>
      </div>
    </div>
  );
};
