import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/form/select-input";
import { CheckIcon, Loader, PlusIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFetchBanks } from "@/requests/services/utils/banks";
import { useNameInquiry } from "@/requests/services/utils/bank-name-inquiry";
import { toast } from "sonner";

const formSchema = z.object({
  account_number: z
    .string()
    .min(10, "Account number must be at least 10 characters long"),
  bank: z.string({ required_error: "Bank name is required" }),
});

export interface BankInfoData {
  account_number: string;
  account_name: string;
  bank: string;
  bank_name: string;
}

export type BankInfoFormData = z.infer<typeof formSchema>;

interface BankInfoFormProps {
  submit: (data: BankInfoData[]) => void;
  key?: string;
  initData?: BankInfoData[];
  handleBack?: () => void;
  isPending?: boolean;
}

const BankInfoForm: React.FC<BankInfoFormProps> = ({
  submit,
  key,
  initData,
  handleBack,
  isPending,
}) => {
  const [accountName, setAccountName] = useState("");
  const [accounts, setAccounts] = useState<BankInfoData[]>([]);

  const { data: banksData, isLoading } = useFetchBanks();
  const { mutate, isPending: isPendingInquiry } = useNameInquiry({
    onSuccess: (data) => {
      setAccountName(data.Data.accountName);
    },
    onError: (error) => {
      console.error("Bank name inquiry error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch account name. Please check the account number and bank."
      );
      setAccountName("");
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    control,
    watch,
    reset,
  } = useForm<BankInfoFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (initData) setAccounts(initData);
  }, [initData]);

  const handleSaveBank: SubmitHandler<BankInfoFormData> = (
    data: BankInfoFormData
  ) => {
    setAccounts((prev) => [
      ...prev,
      {
        account_name: accountName,
        bank_name:
          bankOptions.find((b) => b.value === data.bank)?.label || data.bank,
        ...data,
      },
    ]);
    reset({});
    setAccountName("");
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (accounts.length === 0) {
      const account = {
        bank: watch("bank"),
        account_name: accountName,
        account_number: watch("account_number"),
        bank_name:
          bankOptions.find((b) => b.value === watch("bank"))?.label ||
          watch("bank"),
      };
      submit([account]);
      return;
    }

    submit(accounts);
  };

  // const handleRemoveBank = (index: number) => {
  //   setAccounts((prev) => prev.filter((_, i) => i !== index));
  // };

  const bankOptions = banksData
    ? banksData.map((bank) => ({
        label: bank.name,
        value: bank.cbn_code,
      }))
    : [];

  return (
    <>
      <form key={key} className="space-y-4">
        <Controller
          name="bank"
          control={control}
          rules={{ required: "Bank is required" }}
          render={({ field }) => (
            <SelectInput
              label="Bank Name"
              options={bankOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.bank?.message}
              value={field.value}
              parentClassName="w-full"
              isLoading={isLoading}
            />
          )}
        />
        <Input
          label="Account number"
          name="account_number"
          placeholder="Enter your account number"
          validatormessage={errors.account_number?.message}
          required
          register={register}
          parentClassName="w-full"
          onChange={(e) => {
            if (e.target.value.length === 10) {
              if (process.env.NODE_ENV === "development") {
                // Auto-fill account name in development for easier testing
                setAccountName("Mercy Nweke");
              } else {
                mutate({
                  accountNumber: e.target.value,
                  cbnCode: watch("bank"),
                });
              }
            }
          }}
          hint={
            isPendingInquiry ? (
              <div className="flex gap-2 items-center">
                <Loader size={16} className="animate-spin" /> Validating account
                information...
              </div>
            ) : watch("account_number")?.length === 10 ? (
              !!accountName ? (
                <>
                  <CheckIcon color="var(--green-300)" size={20} /> {accountName}
                </>
              ) : (
                <>
                  <X color="var(--red-300)" size={20} />
                  Account not found
                </>
              )
            ) : undefined
          }
          hintClassName={cn(
            "text-p4 flex items-center gap-1",
            isPendingInquiry
              ? "text-txt-brand"
              : !!accountName
              ? "text-txt-success"
              : "text-txt-danger"
          )}
        />
        <Button
          variant={"ghost"}
          className="h-[32px]"
          onClick={handleSubmit(handleSaveBank)}
          disabled={!isValid || !accountName || accounts.length === 2}
        >
          <PlusIcon />
          Add another bank account
        </Button>
        {accounts.map(({ bank, account_name, account_number }, index) => (
          <div
            key={`bank-info-${index}`}
            className="relative space-y-3 border border-dashed border-stroke-brand p-4 rounded-[8px] bg-bg-brand-light"
          >
            {/* <Button
              variant={"brand"}
              size={"icon"}
              className="absolute right-4 top-2 h-[28px] w-[28px]"
              onClick={() => handleRemoveBank(index)}
            >
              <Trash2Icon />
            </Button> */}
            <div className="space-y-1">
              <p className="text-txt-secondary text-l3">Bank name</p>
              <p className="text-txt-primary text-p3">{bank}</p>
            </div>
            <div className="space-y-1">
              <p className="text-txt-secondary text-l3">Account number</p>
              <p className="text-txt-primary text-p3">{account_number}</p>
            </div>
            <div className="space-y-1">
              <p className="text-txt-secondary text-l3">Account name</p>
              <p className="text-txt-primary text-p3">{account_name}</p>
            </div>
          </div>
        ))}

        <div className="mt-8 space-y-2 w-full">
          <Button
            className="w-full"
            onClick={onSubmit}
            loading={isPending}
            disabled={(!isValid && accounts.length === 0) || isPending}
          >
            Save and Continue
          </Button>
          {handleBack ? (
            <Button variant="secondary" className="w-full" onClick={handleBack}>
              Go back
            </Button>
          ) : null}
        </div>
      </form>
    </>
  );
};

export { BankInfoForm };
