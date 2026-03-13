import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, XIcon } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { NoticeModal } from "@/components/modals/notice-modal";
import { ROUTES } from "@/lib/routes";
import CurrencyInput from "react-currency-input-field";
import { useState } from "react";
import { OtpModal } from "@/components/modals/otp-modal";
import { Label } from "@/components/ui/label";
import { BankAccount, BankAccountData } from "@/components/cards/bank-account";
import { AddBankAccountModal } from "@/components/modals/add-bank-account";

const banks: BankAccountData[] = [
  {
    id: "1",
    accountName: "Mercy Nweke",
    accountNumber: "1234567890",
    bankName: "Coronation bank",
  },
  {
    id: "2",
    accountName: "Mercy Nweke",
    accountNumber: "1234567890",
    bankName: "Access bank",
  },
];

const schema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => {
        // Remove commas and parse to number
        const num = Number(val.replace(/,/g, ""));
        return !isNaN(num) && num >= 100000;
      },
      { message: "Minimum amount is ₦100,000" }
    ),
  bank: z.string().min(1, "Bank account is required"),
});

type EquitiesWithdrawData = z.infer<typeof schema>;

const EquitiesWithdrawUI = () => {
  const [show, setShow] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [addBank, setAddBank] = useState(false);

  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors, isValid },
    watch,
    control,
    setValue,
  } = useForm<EquitiesWithdrawData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<EquitiesWithdrawData> = (data) => {
    console.log(data);
    setShowOtp(true);
  };
  const bank = watch("bank");

  const setBank = (card: string) => {
    setValue("bank", card, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
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
        type="success"
        title="Successful! 🎉"
        description="Your withdrawal request is being processed. Expect your funds shortly"
        action={{
          text: (
            <>
              Go to portfolio <ChevronRight />{" "}
            </>
          ),
          action: () => router.push(ROUTES.overview),
        }}
      />

      <Button onClick={router.back} variant={"ghost"} size={"sm"}>
        <XIcon /> Cancel
      </Button>

      <section className="mx-auto max-w-[940px] mt-8">
        <section className="grid gap-8">
          <div className="">
            <h2 className="text-h4 sm:text-h3 font-semibold text-txt-primary mb-1">
              Withdraw funds
            </h2>
            <p className="text-p4 sm:text-p3 text-txt-tertiary">
              Choose either bank account or debit card to complete this
              transaction
            </p>
          </div>
          <form className="grid gap-8">
            <div>
              <div className="border border-stroke-secondary bg-bg-secondary px-4 py-4 rounded-[12px]">
                <div className="">
                  <p className="text-txt-secondary mb-2">
                    Enter amount to withdraw
                  </p>
                  <div className="flex gap-2">
                    <p className="text-h2 text-txt-tertiary items-center">₦</p>
                    <Controller
                      name="amount"
                      control={control}
                      render={({ field }) => (
                        <CurrencyInput
                          decimalsLimit={2}
                          className="text-h2 w-full"
                          placeholder="0.00"
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        />
                      )}
                    />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-txt-secondary mt-2">
                  Brokerage balance:{" "}
                  <span className="font-semibold text-txt-primary">
                    ₦ 100,000.00
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
            <div className="">
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

            <Button
              disabled={!isValid}
              onClick={handleSubmit(onSubmit)}
              className="w-full mb-2"
            >
              Withdraw <ChevronRight />
            </Button>
          </form>
        </section>
      </section>
    </>
  );
};

export { EquitiesWithdrawUI };
