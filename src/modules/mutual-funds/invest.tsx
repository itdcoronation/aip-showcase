import { Button } from "@/components/ui/button";
import { ChevronRight, XIcon } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useMemo, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import CurrencyInput from "react-currency-input-field";
import { Notice } from "@/components/notice";
import { Switch } from "@/components/ui/switch";
import { PaymentMethod } from "@/components/payment-method";
//import { NoticeModal } from "@/components/modals/notice-modal";
import {
  TransferDetailsModal,
  PollingConfirmationModal,
  SuccessModal,
  InfoModal,
} from "@/components/modals/investment-modals";
import { useCountdown } from "@/hooks/useCountdown";
import { CopySimpleIcon } from "@/assets/vectors/icons";
import { SelectInput } from "@/components/form/select-input";
import { DatePicker } from "@/components/form/date-picker";
import { frequencyOptions } from "@/lib/constants";
import { useFetchFundDetails } from "@/requests/services/products";
import { useFetchPortfolioFull } from "@/requests/services/portfolio/balance";
import { getCurrencySymbol, getCurrencyCode } from "@/lib/currency-mapping";
import { getMinimumInvestment } from "@/lib/fund-minimums";
import { useFetchBankDetails } from "@/requests/services/mutual-funds/bank-details";
import { BankDetailsResponse } from "@/types/bank-info";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useInitiatePayment } from "@/requests/services/payments/initiate";
import { cleanAmount, formatDateForAPI, transformFrequency } from "@/lib/payment-utils";

const InvestMutualFundUI = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { id } = useParams();
  const [isRecurring, setIsRecurring] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  
  // Recurring payment data
  const [recurringData, setRecurringData] = useState<{
    frequency?: string;
    start_date?: Date;
    end_date?: Date;
  }>({});
  
  // Checkout URL state for card payment
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  // New state for the transfer flow
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showPollingModal, setShowPollingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState("");
  const [pollingMessage, setPollingMessage] = useState(
    "We are confirming your payment. Please wait..."
  );
 
  const {
   
    resetCountdown,formattedCountdown,
  } = useCountdown(300); // 5 minutes

  // Fetch fund details and portfolio data to get fund name
  const { data: fundDetailsData, isLoading: fundDetailsLoading } =
    useFetchFundDetails({
      params: { fund_filter: id as string },
    });

  const { data: portfolioData, isLoading: portfolioLoading } =
    useFetchPortfolioFull();

  // Fetch bank details for the specific product
  const { data: bankDetailsData, isLoading: bankDetailsLoading } =
    useFetchBankDetails({
      productId: id as string,
    });

  const fundName = useMemo(() => {
    if (fundDetailsLoading || portfolioLoading) return "Loading...";
    const fundDetailsName = fundDetailsData?.Data?.[0]?.fundName;
    if (fundDetailsName) return fundDetailsName;
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

  const currencySymbol = useMemo(() => getCurrencySymbol(id as string), [id]);
  const minimumInvestment = useMemo(
    () => getMinimumInvestment(id as string),
    [id]
  );


  const handleFinalRedirect = () => {
    setShowSuccessModal(false);
    setShowInfoModal(false);
    router.push("/mutual-funds");
  };

  const handlePreExit = () => {
    setShowPollingModal(false);
    setShowTransferModal(false);
    stopPolling();
    router.push("/mutual-funds");
  };

  const handleTransferQuery = async () => {
    if (!bankDetailsData?.success) {
      setPollingMessage("Could not retrieve account details to query.");
      return;
    }

    try {
      const response = await fetch("/api/transfer-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vnuban: bankDetailsData.data.investment_account.AccountNumber,
          amount: investmentAmount.replace(/,/g, ""),
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        stopPolling();
        setShowPollingModal(false);
        setShowSuccessModal(true);
      } else if (result.message?.includes("Duplicate request")) {
        stopPolling();
        setShowPollingModal(false);
        setShowSuccessModal(true);
      } else if (result.message?.includes("Validation failed")) {
        stopPolling();
        setShowPollingModal(false);
        setInfoModalMessage(
          "We can't confirm your request right now, but don't worry, any transfers to this account will be confirmed and added to your portfolio in 24 hrs."
        );
        setShowInfoModal(true);
      } else if (result.message?.includes("Unauthorized")) {
        stopPolling();
        setShowPollingModal(false);
        setInfoModalMessage(
          "We can't confirm your request right now, but don't worry, any transfers to this account will be confirmed and added to your portfolio in 24 hrs."
        );
        setShowInfoModal(true);
      } else if (
        result.message?.includes("Record not found") ||
        result.message?.includes("Request expired")  ||
        result.message?.includes("Unauthenticated")
      ) {
        setPollingMessage(result.message); // Update user on status
      }
    } catch (error) {
      console.error("Polling failed:", error);
      setPollingMessage("A network error occurred. Retrying...");
    }
  };

 


const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

const startPolling = () => {
  setShowTransferModal(false);
  setShowPollingModal(true);
  resetCountdown(); // starts countdown

  handleTransferQuery();

  if (!pollingIntervalRef.current) {
    pollingIntervalRef.current = setInterval(handleTransferQuery, 20000);
  }

  if (!pollingTimeoutRef.current) {
    pollingTimeoutRef.current = setTimeout(() => {
      stopPolling();
      setShowPollingModal(false);
      setInfoModalMessage(
        "We can't confirm your request right now, but don't worry. Any transfers to this account will be confirmed and added to your portfolio in 24 hrs."
      );
      setShowInfoModal(true);
    }, 300000);
  }
};

const stopPolling = () => {
  if (pollingIntervalRef.current) {
    clearInterval(pollingIntervalRef.current);
    pollingIntervalRef.current = null;
  }
  if (pollingTimeoutRef.current) {
    clearTimeout(pollingTimeoutRef.current);
    pollingTimeoutRef.current = null;
  }
};


  const initiateTransferFlow = () => {
    if (bankDetailsData?.success) {
      setShowTransferModal(true);
    } else {
      setInfoModalMessage("Unable to retrieve investment account details.");
      setShowInfoModal(true);
    }
  };

  // Card payment mutation
  const { mutate: initiatePayment, isPending: isPaymentPending } = useInitiatePayment({
    onSuccess: (data) => {
      console.log("Payment initiated successfully:", data);
      // Check for checkout URL in response
      if (data.data?.checkoutUrl) {
        setCheckoutUrl(data.data.checkoutUrl);
      } else if (data.data?.authorization_url || data.data?.payment_url) {
        const paymentUrl = data.data.authorization_url || data.data.payment_url;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        }
      } else {
        setShowSuccessModal(true);
      }
    },
    onError: (error: any) => {
      console.error("Payment initiation failed:", error);
      setInfoModalMessage(
        "Payment initialization failed. Please try again or use a different payment method."
      );
      setShowInfoModal(true);
    },
  });

  const initiateCardPayment = () => {
    const amount = cleanAmount(investmentAmount);
    const currency = getCurrencyCode(id as string);
    
    const payloadBase = {
      amount,
      currency,
      callback_url: process.env.NEXT_PUBLIC_PAYMENT_CALLBACK_URL || "https://wealth.coronation.ng/overview",
      product_id: id as string,
      is_recurring: isRecurring,
    };

    if (isRecurring && recurringData.frequency && recurringData.start_date && recurringData.end_date) {
      initiatePayment({
        ...payloadBase,
        schedule: {
          frequency: transformFrequency(recurringData.frequency),
          start_date: formatDateForAPI(recurringData.start_date),
          end_date: formatDateForAPI(recurringData.end_date),
        },
      });
    } else {
      initiatePayment(payloadBase);
    }
  };

  return (
    <>
      {bankDetailsData?.success && (
        <TransferDetailsModal
          show={showTransferModal}
          close={handlePreExit}
          amount={`${currencySymbol} ${investmentAmount}`}
          bankName={bankDetailsData.data.investment_account.BankName}
          accountNumber={bankDetailsData.data.investment_account.AccountNumber}
          onConfirm={startPolling}
        />
      )}
      <PollingConfirmationModal
        show={showPollingModal}
        close={handlePreExit}
        countdown={formattedCountdown}
        message={pollingMessage}
      />
      <SuccessModal show={showSuccessModal} onClose={handleFinalRedirect} />
      <InfoModal
        show={showInfoModal}
        onClose={handleFinalRedirect}
        message={infoModalMessage}
      />

      <Button onClick={router.back} variant={"ghost"} size={"sm"}>
        <XIcon /> Cancel
      </Button>

      <section className="mx-auto max-w-[940px] mt-8">
        <p className="text-txt-success mb-8">Step {step} of 2</p>
        <section className="grid gap-8">
          <div className="">
            <h2 className="text-h4 sm:text-h3 font-semibold text-txt-primary mb-1">
              {step === 1 ? `Invest ${fundName}` : "Select payment method"}
            </h2>
            <p className="text-p4 sm:text-p3 text-txt-tertiary">
              {step === 1
                ? "Please enter the amount of you would like to invest"
                : isRecurring
                ? "For recurring transaction, you can only use a debit card"
                : "Choose either bank account or debit card to pay for this transaction"}
            </p>
          </div>

          {step === 1 ? (
            <Step1Form
              handleNext={(isRecurring, amount, frequency, start_date, end_date) => {
                setStep(2);
                setIsRecurring(isRecurring);
                setInvestmentAmount(amount);
                setRecurringData({ frequency, start_date, end_date });
              }}
              currencySymbol={currencySymbol}
              minimumInvestment={minimumInvestment}
            />
          ) : (
            <Step2Form
              onBankInvestClick={initiateTransferFlow}
              onCardInvestClick={initiateCardPayment}
              isRecurring={isRecurring}
              amount={investmentAmount}
              currencySymbol={currencySymbol}
              bankDetails={bankDetailsData}
              bankDetailsLoading={bankDetailsLoading}
              isPaymentPending={isPaymentPending}
              checkoutUrl={checkoutUrl}
              onResetCheckout={() => setCheckoutUrl(null)}
            />
          )}
        </section>
      </section>
    </>
  );
};

// Step1FormSchema will be created dynamically in Step1Form to use minimumInvestment

type Step1FormData = {
  amount: string;
  recurring?: boolean;
  frequency?: string;
  start_date?: Date;
  end_date?: Date;
};

const Step1Form = ({
  handleNext,
  currencySymbol,
  minimumInvestment,
}: {
  handleNext: (
    isRecurring: boolean, 
    amount: string, 
    frequency?: string, 
    start_date?: Date, 
    end_date?: Date
  ) => void;
  currencySymbol: string;
  minimumInvestment: number;
}) => {
  // Create schema with dynamic minimum investment
  const step1FormSchema = z.object({
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
          message: `This amount doesn’t meet the minimum investment requirement (${currencySymbol}${minimumInvestment.toLocaleString()})`,
        }
      ),    recurring: z.boolean().optional(),
    frequency: z.string().optional(),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
  }).superRefine((data, ctx) => {
    if (data.recurring) {
      if (!data.frequency) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["frequency"],
          message: "Frequency is required for recurring investments",
        });
      }
      if (!data.start_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["start_date"],
          message: "Start date is required for recurring investments",
        });
      } else {
        // Validate start date is at least 1 day in the future (Lagos timezone)
        const lagosTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
        const tomorrow = new Date(lagosTime);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const selectedDate = new Date(data.start_date);
        selectedDate.setHours(0, 0, 0, 0);
        
        if (selectedDate < tomorrow) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["start_date"],
            message: "Start date must be at least 1 day in the future",
          });
        }
      }
    }
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    watch,
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1FormSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<Step1FormData> = (data) => {
    // If recurring is selected and no end date, default to 50 years from now
    if (data.recurring && !data.end_date) {
      const fiftyYearsFromNow = new Date();
      fiftyYearsFromNow.setFullYear(fiftyYearsFromNow.getFullYear() + 50);
      data.end_date = fiftyYearsFromNow;
    }
    handleNext(
      data.recurring || false, 
      data.amount, 
      data.frequency, 
      data.start_date, 
      data.end_date
    );
  };

  return (
    <>
      <form className="grid gap-8">
        <div>
          <div className="mb-4">
            <div className="flex-col flex gap-4 justify-between border border-stroke-secondary bg-bg-secondary px-4 py-4 sm:py-6 rounded-[12px]">
              <div className="">
                <p className="text-txt-secondary mb-2">Amount to buy</p>
                <div className="flex gap-2">
                  <p className="text-h2 text-txt-tertiary items-center">
                    {currencySymbol}
                  </p>
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
                Minimum investment amount:{" "}
                <span className="font-semibold text-txt-primary">
                  {currencySymbol} {minimumInvestment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </p>
            </div>
            {errors.amount?.message ? (
              <small className="block mt-1 text-txt-danger !text-l1 md:!text-p3">
                {errors.amount?.message}
              </small>
            ) : null}
          </div>
          <div className="flex gap-2 items-center">
            <Controller
              name="recurring"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label>Make this a recurring transaction</Label>
          </div>
          {watch("recurring") ? (
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <Controller
                name="frequency"
                control={control}
                rules={{ required: "Frequency is required" }}
                render={({ field }) => (
                  <SelectInput
                    label="Frequency"
                    options={frequencyOptions}
                    required
                    onChange={(value) => field.onChange(value)}
                    validatormessage={errors.frequency?.message}
                    value={field.value ?? ""}
                    parentClassName="w-full"
                    triggerClassName="bg-white"
                    placeholder="Select frequency"
                  />
                )}
              />
              <Controller
                name="start_date"
                control={control}
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <DatePicker
                    label="Start date"
                    value={field.value}
                    handleChange={(value) => field.onChange(value!)}
                    validatormessage={errors.start_date?.message}
                    required
                    parentClassName="w-full"
                    placeholder="DD/MM/YYYY"
                    dateFormat="dd/MM/yy"
                    className="bg-white"
                    startMonth={new Date()}
                    endMonth={new Date(new Date().getFullYear() + 20, 11)}
                  />
                )}
              />
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="End date (Optional)"
                    value={field.value}
                    handleChange={(value) => field.onChange(value!)}
                    validatormessage={errors.end_date?.message}
                    required
                    parentClassName="w-full"
                    placeholder="DD/MM/YYYY"
                    dateFormat="dd/MM/yy"
                    className="bg-white"
                    startMonth={new Date()}
                    endMonth={new Date(new Date().getFullYear() + 20, 11)}
                  />
                )}
              />
            </div>
          ) : null}
        </div>
        {isValid ? (
          <>
            <Breakdown
              recurring={watch("recurring") || false}
              amount={watch("amount")}
              currencySymbol={currencySymbol}
            />
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
            Continue to payment <ChevronRight />
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

const Step2Form = ({
  onBankInvestClick,
  onCardInvestClick,
  isRecurring,
  amount,
  currencySymbol,
  bankDetails,
  isPaymentPending,
  checkoutUrl,
  onResetCheckout,
}: {
  onBankInvestClick: () => void;
  onCardInvestClick: () => void;
  isRecurring: boolean;
  amount: string;
  currencySymbol: string;
  bankDetails: BankDetailsResponse | undefined;
  bankDetailsLoading: boolean;
  isPaymentPending: boolean;
  checkoutUrl: string | null;
  onResetCheckout: () => void;
}) => {
  const [method, setMethod] = useState<string | undefined>();
  const [card, setCard] = useState<string | undefined>();

  const allPaymentMethods = [
    {
      value: "bank",
      icon: "bank",
      title: "Pay with vNUBAN",
      description:
        "Make payment to details shown below to complete this transaction.",
    },
    {
      value: "card",
      icon: "card",
      title: "Pay with debit card",
      description:
        "Add a new card or select an existing one to complete this transaction",
    },
  ];

  const cardOnlyMethod = [
    {
      value: "card",
      icon: "card",
      title: "Pay with debit card",
      description:
        "Add a new card or select an existing one to complete this transaction",
    },
  ];

  useEffect(() => {
    if (isRecurring) {
      setMethod("card");
      setCard(undefined);
    } else {
      setMethod("bank");
      setCard(undefined);
    }
  }, [isRecurring]);

  // Reset checkout URL when method changes
  const handleMethodChange = (newMethod: string) => {
    if (checkoutUrl) {
      onResetCheckout();
    }
    setMethod(newMethod);
  };

  const { copy } = useCopyToClipboard();

  return (
    <>
      <section className="grid gap-8">
        <div>
          <p className="text-xs mb-2 text-black">Amount to pay</p>
          <div className="flex items-center gap-4">
            <p className="text-h2 text-txt-primary font-semibold">
              {currencySymbol}{" "}
              {Number(amount.replace(/,/g, "")).toLocaleString()}.00
            </p>
            <CopySimpleIcon onClick={() => copy(amount.replace(/,/g, ""))} />
          </div>
        </div>

        <PaymentMethod
          method={method ?? ""}
          onSelectMethod={handleMethodChange}
          card={card ?? ""}
          onSelectCard={setCard}
          methods={isRecurring ? cardOnlyMethod : allPaymentMethods}
          hideCardSelection={method === "card"}
          bankInfo={
            bankDetails?.success
              ? {
                  accountName: bankDetails.data.investment_account.AccountName,
                  accountNumber:
                    bankDetails.data.investment_account.AccountNumber,
                  bankName: bankDetails.data.investment_account.BankName,
                  reference: bankDetails.data.user_id || "",
                }
              : undefined
          }
        />
        <div>
          <Button
            disabled={
              (method === "bank" && !bankDetails?.success) ||
              (method === "card" && !checkoutUrl && isPaymentPending) ||
              (!method && !checkoutUrl)
            }
            loading={isPaymentPending && !checkoutUrl}
            onClick={() => {
              if (checkoutUrl) {
                // Redirect to checkout
                window.location.href = checkoutUrl;
              } else if (method === "bank") {
                onBankInvestClick();
              } else if (method === "card") {
                onCardInvestClick();
              }
            }}
            className="w-full mb-2"
          >
            {checkoutUrl ? (
              <>
                Proceed to checkout <ChevronRight />
              </>
            ) : (
              <>
                Invest <ChevronRight />
              </>
            )}
          </Button>
          <p className="text-center text-p4 text-xs text-txt-secondary">
            By placing an order you admit that you understand the investment
            risk and the significance of seeking professional advice.{" "}
            <span className="text-txt-brand">Advisory clause</span>
          </p>
        </div>
      </section>
    </>
  );
};

export { InvestMutualFundUI };

const Breakdown = ({
  amount,
  currencySymbol,
  recurring,
}: {
  recurring: boolean;
  amount?: string;
  currencySymbol: string;
}) => {
  // Format the amount for display
  const displayAmount = amount
    ? `${currencySymbol} ${Number(
        amount.replace(/,/g, "")
      ).toLocaleString()}.00`
    : `${currencySymbol} 0.00`;

  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] px-4">
      <div className="text-txt-tertiary flex justify-between items-center py-5">
        <p>Transaction type</p> <p>{recurring ? "Recurring" : "One-off"}</p>
      </div>
      {/* FEES AND CHARGES - COMMENTED OUT FOR CURRENT VERSION */}
      {/* <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Fees + Charges</p> <p>{currencySymbol} 0.00</p>
      </div> */}
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Total amount due</p> <p>{displayAmount}</p>
      </div>
   </div>
  );
};
