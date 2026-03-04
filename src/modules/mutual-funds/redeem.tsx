"use client";
import { SelectInput } from "@/components/form/select-input";
import { AddBankAccountModal } from "@/components/modals/add-bank-account";
import { NoticeModal } from "@/components/modals/notice-modal";
import { OtpModal } from "@/components/modals/otp-modal";
import { Button } from "@/components/ui/button";
import { fundWithdrawalReasonOptions } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, XIcon } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { useFetchFundDetails } from "@/requests/services/products";
import { useFetchPortfolioFull } from "@/requests/services/portfolio/balance";
import {
  useRedeemFund,
  generateRedeemReference,
} from "@/requests/services/mutual-funds/redeem";
import { sanitizeError, generateErrorId } from "@/lib/error-sanitization";
import { checkRedeemAvailability } from "@/lib/fund-restrictions";
import { useModalContext } from "@/context/modal-context";

const formSchema = z.object({
  reason: z.string().min(1, "Select a reason"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => {
        // Remove commas and parse to number
        const num = Number(val.replace(/,/g, ""));
        return !isNaN(num) && num <= 3000000;
      },
      { message: "Maximum amount is 3,000,000" }
    )
    .refine(
      (val) => {
        // Remove commas and parse to number
        const num = Number(val.replace(/,/g, ""));
        return !isNaN(num) && num >= 5000;
      },
      { message: "Minimum amount is 5,000" }
    ),
});

type RedeemFormData = z.infer<typeof formSchema>;

const RedeemMutualFundsUI = () => {
  const [addBank, setAddBank] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [show, setShow] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("Successful! 🎉");
  const [noticeDescription, setNoticeDescription] = useState("");
  const [noticeType, setNoticeType] = useState<"success" | "failure" | "info">(
    "success"
  );
  const [isRestricted, setIsRestricted] = useState(false);
  const { handleFeedbackState } = useModalContext();

  const router = useRouter();
  const { id } = useParams();

  // Fetch fund details and portfolio data to get fund name
  const { data: fundDetailsData, isLoading: fundDetailsLoading } =
    useFetchFundDetails({
      params: { fund_filter: id as string },
    });

  const { data: portfolioData, isLoading: portfolioLoading } =
    useFetchPortfolioFull();

  // Get fund name from fund details or portfolio data
  const fundName = useMemo(() => {
    if (fundDetailsLoading || portfolioLoading) return "Loading...";

    // Try to get from fund details first
    const fundDetailsName = fundDetailsData?.Data?.[0]?.fundName;
    if (fundDetailsName) return fundDetailsName;

    // Fallback to portfolio data
    const portfolioFund = portfolioData?.data?.Data?.userFunds?.find(
      (fund) => fund.productCode === id
    );
    if (portfolioFund) return portfolioFund.productName;

    return "Fund";
  }, [
    fundDetailsData,
    portfolioData,
    id,
    fundDetailsLoading,
    portfolioLoading,
  ]);

  // Check fund restrictions
  useEffect(() => {
    if (id && fundName && fundName !== "Loading...") {
      const availability = checkRedeemAvailability(id as string, fundName);

      if (!availability.isAvailable) {
        setIsRestricted(true);
        setNoticeTitle("Feature Not Available");
        setNoticeDescription(
          availability.message || "This feature is not available for this fund"
        );
        setNoticeType("info");
        setShow(true);
      } else {
        setIsRestricted(false);
      }
    }
  }, [id, fundName]);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    control,
  } = useForm<RedeemFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  // Initialize redeem mutation
  const redeemMutation = useRedeemFund({
    onSuccess: (data) => {
      console.log("Redeem mutation success:", data);
    },
    onError: (error) => {
      console.error("Redeem mutation error:", error);
    },
  });

  const onSubmit: SubmitHandler<RedeemFormData> = async (data) => {
    // Check if redeem is restricted for this fund
    if (isRestricted) {
      return;
    }

    try {
      // Parse the amount to ensure it's a number
      const amount = Number(data.amount.replace(/,/g, ""));

      const response = await redeemMutation.mutateAsync({
        fundCode: id as string,
        narration: data.reason,
        amount: amount,
        reference: generateRedeemReference(),
      });

      console.log("Redeem success:", response);

      // Success - use NoticeModal with default success message
      setNoticeTitle("Successful! 🎉");
      setNoticeDescription(
        "Dear Customer, your redemption will be processed to your selected bank account. Please note that redemption made after 2pm will be processed in the next working day"
      );
      setNoticeType("success");
      setShow(true);
    } catch (error: any) {
      const errorId = generateErrorId();
      console.error(`Redeem error [${errorId}]:`, error);

      const sanitizedError = sanitizeError(error);

      // Failure - use NoticeModal with error message
      setNoticeTitle("Redemption Failed");
      setNoticeDescription(sanitizedError.message);
      setNoticeType("failure");
      setShow(true);
    }
  };

  return (
    <>
      <AddBankAccountModal
        show={addBank}
        close={() => setAddBank(false)}
        handleContinue={console.log}
      />
      <OtpModal
        show={showOtp}
        close={() => setShowOtp(false)}
        handleContinue={() => {
          setShowOtp(false);
          setShow(true);
        }}
      />
      <NoticeModal
        show={show}
        close={() => setShow(false)}
        description={noticeDescription}
        title={noticeTitle}
        type={noticeType}
        action={
          // Show "Go to portfolio" only for successful redemptions, not for restrictions or errors
          noticeTitle === "Successful! 🎉"
            ? {
                text: (
                  <>
                    Go to portfolio{" "}
                    <ChevronRight className="min-w-[20px] !h-[20px]" />
                  </>
                ),
                action: () => {
                  setShow(false);
                  router.push("/overview");
                  handleFeedbackState({
                    showFeedback: true,
                    description: "How was your experience redeeming mutual funds?",
                  });
                },
              }
            : undefined
        }
      />

      <Button onClick={router.back} variant={"ghost"} size={"sm"}>
        <XIcon /> Cancel
      </Button>

      <section className="mx-auto max-w-[940px] mt-8">
        <div className="mb-4">
          <h2 className="text-h4 sm:text-h3 font-semibold text-txt-primary mb-1">
            Redeem {fundName}
          </h2>
          <p className="text-p4 sm:text-p3 text-txt-tertiary">
            Please enter the amount of you would like to redeem
          </p>
        </div>
        <form className="text-sm">
          <div className="mb-4">
            <div className="flex-col sm:flex-row flex gap-4 sm:items-center justify-between border border-stroke-secondary bg-bg-secondary px-4 py-4 sm:py-6 rounded-[12px]">
              <div className="">
                <p className="text-txt-secondary mb-2">Amount to redeem</p>
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
              {/* <div className="flex flex-col items-start sm:items-end">
                <p className="text-xs sm:text-sm text-txt-secondary mb-2">
                  Maximum redemption:{" "}
                  <span className="font-semibold text-txt-primary">
                    500,000.00
                  </span>
                </p>
                <Button
                  variant={"outline"}
                  size="m"
                  className="bg-white w-full sm:w-fit"
                >
                  Redeem everything
                </Button>
              </div> */}
            </div>
            {errors.amount?.message ? (
              <small className="block mt-1 text-txt-danger !text-l1 md:!text-p3">
                {errors.amount?.message}
              </small>
            ) : (
              ""
            )}
          </div>
          <Controller
            name="reason"
            control={control}
            rules={{ required: "Reason is required" }}
            render={({ field }) => (
              <SelectInput
                label="Reason for withdrawal"
                options={fundWithdrawalReasonOptions}
                required
                onChange={(value) => field.onChange(value)}
                validatormessage={errors.reason?.message}
                value={field.value}
                parentClassName="w-full whitespace-nowrap mb-8"
                triggerClassName="bg-white"
                placeholder="Select from list"
              />
            )}
          />

          {/* BANK SELECTION HIDDEN: Bank account selection commented out as requested
          {isValid ? (
            <>
              <Breakdown />
              <div className="mt-8">
                <Label className="mb-4">Select bank account</Label>
                <div className="grid gap-4 sm:grid-cols-2 mb-4">
                  {banks.map((item) => (
                    <BankAccount
                      key={item.id}
                      onSelect={setBank}
                      selected={bank === item.id}
                      {...item}
                      value={item.id}
                    />
                  ))}
                </div>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setAddBank(true);
                  }}
                  variant={"ghost"}
                  size={"sm"}
                >
                  <Plus /> Add new bank account
                </Button>
              </div>
            </>
          ) : null}
          */}

          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || redeemMutation.isPending || isRestricted}
            className="w-full mt-8 mb-2"
          >
            {redeemMutation.isPending
              ? "Processing..."
              : isRestricted
              ? "Feature Not Available"
              : "Redeem"}{" "}
            <ChevronRight />
          </Button>
        </form>
      </section>
    </>
  );
};
export { RedeemMutualFundsUI };

// FEES HIDDEN: Fee popup and calculations commented out as requested
// const Breakdown = () => {
//   return (
//     <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] px-4">
//       <div className="text-txt-tertiary flex justify-between items-center py-5">
//         <p>Fees + Charges</p> <p>0</p>
//       </div>
//       <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
//         <p>Total amount due</p> <p>11,020,084</p>
//       </div>
//     </div>
//   );
// };
