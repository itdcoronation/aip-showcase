import { Button } from "@/components/ui/button";
import { ChevronRight, XIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CurrencyInput from "react-currency-input-field";
import { Notice } from "@/components/notice";
import { NoticeModal } from "@/components/modals/notice-modal";
import { resolveShowcaseFixedIncomeName } from "@/lib/showcase-display-names";
import { isShowcaseMode } from "@/lib/showcase";
import {
  fixedIncomeCategoryProducts,
  fixedIncomeTradesData,
} from "./showcase-data";

const BONDS_MINIMUM_INVESTMENT = 1000000;
const CP_TBILLS_MINIMUM_INVESTMENT = 100000;
const FIXED_INCOME_FEE_RATE = 0.005;

const roundDownToNearestThousand = (value?: string | null) => {
  if (!value) return "";

  const parsed = Number(value.replace(/,/g, ""));
  if (!Number.isFinite(parsed)) return "";

  const rounded = Math.floor(parsed / 1000) * 1000;
  return rounded > 0 ? String(rounded) : "";
};

const InvestFixedIncomeUI = () => {
  const [show, setShow] = useState(false);
  // const [step, setStep] = useState(1);
  const router = useRouter();
  const { id } = useParams();
  const productId = typeof id === "string" ? id : undefined;
  const fundName = resolveShowcaseFixedIncomeName(productId);

  const categoryProduct = fixedIncomeCategoryProducts.find(
    (item) => item.id === productId
  );
  const tradeProduct = fixedIncomeTradesData.find((item) => item.id === productId);

  const displayType = categoryProduct?.type || tradeProduct?.fund_type || "Bonds";
  const displayRate = categoryProduct?.rate ?? tradeProduct?.rate ?? 0;
  const isFaceValueInstrument =
    displayType === "Treasury bills" || displayType === "Commercial Papers";
  const isBondInstrument = displayType === "Bonds";
  const minimumInvestment = isFaceValueInstrument
    ? CP_TBILLS_MINIMUM_INVESTMENT
    : BONDS_MINIMUM_INVESTMENT;

  return (
    <>
      <NoticeModal
        show={show}
        close={() => {
          setShow(false);
          if (isShowcaseMode) {
            router.push("/fixed-income");
          }
        }}
        type="success"
        title="Request received"
        description="A member of our fixed income team will reach out to you for further discussion "
        action={{
          text: (
            <>
              Go to portfolio <ChevronRight />{" "}
            </>
          ),
          action: () => router.push("/fixed-income"),
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
              {isFaceValueInstrument
                ? "Please enter the face value you would like to invest"
                : "Please enter the amount you would like to invest"}
            </p>
          </div>

          <Step1Form
            handleNext={() => setShow(true)}
            isFaceValueInstrument={isFaceValueInstrument}
            isBondInstrument={isBondInstrument}
            rate={displayRate}
            minimumInvestment={minimumInvestment}
          />
        </section>
      </section>
    </>
  );
};

const createStep1FormSchema = (
  enforceThousandRule: boolean,
  minimumInvestment: number
) =>
  z.object({
    amount: z
      .string()
      .min(1, "Amount is required")
      .refine(
        (val) => {
          // Remove commas and parse to number
          const num = Number(val.replace(/,/g, ""));
          return !isNaN(num) && num >= minimumInvestment;
        },
        {
          message: `This amount doesn’t meet the minimum investment requirement (₦${minimumInvestment.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })})`,
        }
      )
      .refine(
        (val) => {
          if (!enforceThousandRule) return true;
          const num = Number(val.replace(/,/g, ""));
          return Number.isInteger(num) && num % 1000 === 0;
        },
        { message: "Amount must be in whole thousands (e.g. 5,001,000)" }
      ),
  });

type Step1FormData = {
  amount: string;
};
const Step1Form = ({
  handleNext,
  isFaceValueInstrument,
  isBondInstrument,
  rate,
  minimumInvestment,
}: {
  handleNext: () => void;
  isFaceValueInstrument: boolean;
  isBondInstrument: boolean;
  rate: number;
  minimumInvestment: number;
}) => {
  const enforceThousandRule = isShowcaseMode;
  const step1FormSchema = createStep1FormSchema(
    enforceThousandRule,
    minimumInvestment
  );

  const {
    handleSubmit,
    formState: { errors, isValid },
    watch,
    control,
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
              <p className="text-txt-secondary mb-2">
                {isFaceValueInstrument ? "Face value" : "Amount to buy"}
              </p>
              <div className="flex gap-2">
                <p className="text-h2 text-txt-tertiary items-center">₦</p>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      value={field.value}
                      onValueChange={(value) => field.onChange(value ?? "")}
                      onBlur={() => {
                        if (!enforceThousandRule) return;
                        field.onChange(roundDownToNearestThousand(field.value));
                      }}
                      allowDecimals={!enforceThousandRule}
                      decimalsLimit={enforceThousandRule ? 0 : 2}
                      className="text-h2 w-full"
                      placeholder={enforceThousandRule ? "0" : "0.00"}
                    />
                  )}
                />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-txt-secondary">
              Minimum investment amount:{""}
              <span className="font-semibold text-txt-primary">
                ₦ {minimumInvestment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
            <Breakdown
              amount={watch("amount")}
              rate={rate}
              isFaceValueInstrument={isFaceValueInstrument}
              isBondInstrument={isBondInstrument}
            />
            <Notice
              title="Important"
              description="Please note that subscription made after 4pm will be applied in the next working day"
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

const Breakdown = ({
  amount,
  rate,
  isFaceValueInstrument,
  isBondInstrument,
}: {
  amount?: string;
  rate: number;
  isFaceValueInstrument: boolean;
  isBondInstrument: boolean;
}) => {
  const inputAmount = amount ? Number(amount.replace(/,/g, "")) : 0;
  const safeAmount = Number.isFinite(inputAmount) ? inputAmount : 0;
  const feesAndCharges = safeAmount * FIXED_INCOME_FEE_RATE;
  const discountValue = safeAmount - (safeAmount * rate) / 100;
  const totalAmountDue = isFaceValueInstrument
    ? discountValue + feesAndCharges
    : isBondInstrument
    ? safeAmount + feesAndCharges
    : safeAmount + feesAndCharges;

  const formatCurrency = (value: number) =>
    `₦${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] px-4">
      <div className="text-txt-tertiary flex justify-between items-center py-5">
        <p>Fees + Charges</p> <p>{formatCurrency(feesAndCharges)}</p>
      </div>
      {isFaceValueInstrument ? (
        <>
          <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
            <p>Discount value</p> <p>{formatCurrency(discountValue)}</p>
          </div>
        </>
      ) : null}
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Total amount due</p>
        <p>{formatCurrency(totalAmountDue)}</p>
      </div>
    </div>
  );
};
