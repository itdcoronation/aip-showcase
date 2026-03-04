import { SelectInput } from "@/components/form/select-input";
import { Button } from "@/components/ui/button";
import { orderTypeOptions } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, PlusCircle, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { MoneyInput } from "@/components/ui/currency-input";
import CurrencyInput from "react-currency-input-field";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NoticeModal } from "@/components/modals/notice-modal";

const formSchema = z
  .object({
    order_type: z.string().min(1, "Select an order type"),
    order_limit: z.string().optional(),
    amount: z.string().min(1, "Amount is required"),
    cancel_today: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.order_type === "limit" && !data.order_limit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["order_limit"],
        message: "Price limit is required for a limit order.",
      });
    }
  });

type BuyStockFormData = z.infer<typeof formSchema>;

export const BuyStockUI = () => {
  const [breakdown, setBreakdown] = useState(false);
  const [show, setShow] = useState(false);

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    watch,
    control,
  } = useForm<BuyStockFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<BuyStockFormData> = (data) => {
    console.log(data);
    setShow(true);
  };

  useEffect(() => {
    setBreakdown(isValid);
  }, [isValid]);

  return (
    <>
      <NoticeModal
        show={show}
        close={() => setShow(false)}
        description="Please note that this message is not a confirmation of trade execution. Trade execution is dependent on prevailing market activity and is subject to a settlement timeline of T+3 working days. Kindly check your email for the details of your transaction."
        title="Successful! 🎉"
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

      <section className="mx-auto max-w-[940px] mt-4 sm:mt-8">
        <div className="mb-4">
          <h2 className="text-h4 sm:text-h3 font-semibold text-txt-primary mb-1">
            Purchase [stockName]
          </h2>
          <p className="text-p4 sm:text-p3 text-txt-tertiary">
            Please enter the amount of stock you want to buy.
          </p>
        </div>

        <form className="text-sm grid gap-4 sm:gap-8">
          <div className="flex-col sm:flex-row flex gap-4">
            <Controller
              name="order_type"
              control={control}
              rules={{ required: "Order type is required" }}
              render={({ field }) => (
                <SelectInput
                  label="Order type"
                  options={orderTypeOptions}
                  required
                  onChange={(value) => field.onChange(value)}
                  validatormessage={errors.order_type?.message}
                  value={field.value}
                  parentClassName="w-full"
                  triggerClassName="bg-white"
                />
              )}
            />
            {watch("order_type") === "limit" ? (
              <Controller
                name="order_limit"
                control={control}
                render={({ field }) => (
                  <MoneyInput
                    label="Buy when price is"
                    name="order_limit"
                    placeholder="Enter limit"
                    validatormessage={errors.order_limit?.message}
                    required
                    parentClassName="w-full"
                    className="bg-white"
                    onValueChange={(value, name, values) => {
                      console.log(value, name, values);
                      field.onChange(value);
                    }}
                    value={field.value}
                  />
                )}
              />
            ) : null}
          </div>
          <div className="mb-4">
            <div className="flex-col sm:flex-row flex gap-4 sm:items-center justify-between border border-stroke-secondary bg-bg-secondary px-4 py-4 sm:py-6 rounded-[12px]">
              <div className="">
                <p className="text-txt-secondary mb-2">Amount to buy</p>
                <div className="flex gap-2">
                  <p className="text-h2 text-txt-tertiary items-center">₦</p>
                  <div className="w-[90%]">
                    <CurrencyInput
                      {...register("amount", {
                        required: true,
                      })}
                      decimalsLimit={2}
                      className="text-h2"
                      placeholder="0.00"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end">
                <p className="text-xs sm:text-sm text-txt-secondary mb-2">
                  Brokerage balance:{" "}
                  <span className="font-semibold text-txt-primary">₦ 0.00</span>{" "}
                </p>
                <Button
                  variant={"outline"}
                  size="m"
                  className="bg-white w-full sm:w-fit"
                >
                  Fund account <PlusCircle />
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
          {watch("order_type") === "limit" ? (
            <div className="flex gap-2 items-center mb-4">
              <Controller
                name="cancel_today"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label>Cancel my order if it is not executed today</Label>
            </div>
          ) : null}
          {breakdown ? <StockBreakdown /> : null}
          <Button
            disabled={!isValid}
            onClick={handleSubmit(onSubmit)}
            className="w-full mt-8 mb-2"
          >
            Buy <ChevronRight />
          </Button>
          <p className="text-center text-p4 text-xs text-txt-secondary">
            By placing an order you admit that you understand the investment
            risk and the significance of seeking professional advice.{" "}
            <span className="text-txt-brand">Advisory clause</span>
          </p>
        </form>
      </section>
    </>
  );
};

const StockBreakdown = () => {
  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] px-4">
      <div className="text-txt-tertiary flex justify-between items-center py-5">
        <p>Price per share</p> <p>11,020,084</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Estimated shares</p> <p>11,020,084</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Fees + Charges</p> <p>11,020,084</p>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary flex justify-between items-center py-5">
        <p>Total amount due</p> <p>11,020,084</p>
      </div>
    </div>
  );
};
