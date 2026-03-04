"use client";
import { BankAccount, BankAccountData } from "@/components/cards/bank-account";
import { SelectInput } from "@/components/form/select-input";
import { AddBankAccountModal } from "@/components/modals/add-bank-account";
import { NoticeModal } from "@/components/modals/notice-modal";
import { OtpModal } from "@/components/modals/otp-modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fundWithdrawalReasonOptions } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Plus, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";

const banks: BankAccountData[] = [
  {
    id: "1",
    accountName: "Philip Ofei",
    accountNumber: "1234567890",
    bankName: "Coronation bank",
  },
  {
    id: "2",
    accountName: "Philip Ofei",
    accountNumber: "1234567890",
    bankName: "Access bank",
  },
];

const formSchema = z.object({
  reason: z.string().min(1, "Select a reason"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => {
        // Remove commas and parse to number
        const num = Number(val.replace(/,/g, ""));
        return !isNaN(num) && num <= 500000;
      },
      { message: "Maximum amount is 500,000" }
    ),
});

type WithdrawFormData = z.infer<typeof formSchema>;

const WithdrawFixedIncomeUI = () => {
  const [addBank, setAddBank] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [show, setShow] = useState(false);
  const [bank, setBank] = useState("");
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    control,
  } = useForm<WithdrawFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<WithdrawFormData> = (data) => {
    console.log(data);
    setShowOtp(true);
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
        continueText="Confirm withdrawal"
      />
      <NoticeModal
        show={show}
        close={() => setShow(false)}
        description="Your request is received. A member of our fixed income team will reach out to you"
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

      <section className="mx-auto max-w-[940px] mt-8">
        <div className="mb-4">
          <h2 className="text-h4 sm:text-h3 font-semibold text-txt-primary mb-1">
            Withdraw [fundName]
          </h2>
          <p className="text-p4 sm:text-p3 text-txt-tertiary">
            Please enter the amount of you would like to Withdraw
          </p>
        </div>
        <form className="text-sm">
          <div className="mb-4">
            <div className="flex-col sm:flex-row flex gap-4 sm:items-center justify-between border border-stroke-secondary bg-bg-secondary px-4 py-4 sm:py-6 rounded-[12px]">
              <div className="">
                <p className="text-txt-secondary mb-2">Amount to Withdraw</p>
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
              <div className="flex flex-col items-start sm:items-end">
                <p className="text-xs sm:text-sm text-txt-secondary mb-2">
                  Maximum redemption:{" "}
                  <span className="font-semibold text-txt-primary">
                    500,000.00
                  </span>
                </p>
                <Button variant={"outline"} size="m" className="bg-white w-fit">
                  Withdraw everything
                </Button>
              </div>
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

          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
            className="w-full mt-8 mb-2"
          >
            Withdraw <ChevronRight />
          </Button>
        </form>
      </section>
    </>
  );
};
export { WithdrawFixedIncomeUI };

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
