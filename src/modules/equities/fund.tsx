import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, XIcon } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { NoticeModal } from "@/components/modals/notice-modal";
import { ROUTES } from "@/lib/routes";
import CurrencyInput from "react-currency-input-field";
import { PaymentMethod } from "@/components/payment-method";
import { useState } from "react";

const schema = z
  .object({
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
    method: z.string().min(1, "Amount is required"),
    card: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.method === "card") {
        return !!data.card && data.card.length > 0;
      }
      return true;
    },
    { message: "Card is required when payment method is card", path: ["card"] }
  );

type EquitiesFundData = z.infer<typeof schema>;

const EquitiesFundUI = () => {
  const [show, setShow] = useState(false);

  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors, isValid },
    watch,
    control,
    setValue,
  } = useForm<EquitiesFundData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<EquitiesFundData> = (data) => {
    console.log(data);
    setShow(true);
  };
  const card = watch("card");
  const method = watch("method");

  const setMethod = (method: string) => {
    setValue("method", method, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const setCard = (card: string) => {
    setValue("card", card, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <>
      <NoticeModal
        show={show}
        close={() => setShow(false)}
        type="info"
        title="Fund request received."
        description="Your account would automatically be updated as soon as we confirm the transaction"
        action={{
          text: (
            <>
              Go to home <ChevronRight />{" "}
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
              Fund account
            </h2>
            <p className="text-p4 sm:text-p3 text-txt-tertiary">
              Choose either bank account or debit card to complete this
              transaction{" "}
            </p>
          </div>
          <form className="grid gap-8">
            <div>
              <div className="border border-stroke-secondary bg-bg-secondary px-4 py-4 rounded-[12px]">
                <div className="">
                  <p className="text-txt-secondary mb-2">Enter fund amount</p>
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
                  Minimum deposit amount:{" "}
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
            <PaymentMethod
              method={method ?? ""}
              onSelectMethod={setMethod}
              card={card ?? ""}
              onSelectCard={setCard}
            />

            <Button
              disabled={!isValid}
              onClick={handleSubmit(onSubmit)}
              className="w-full mb-2"
            >
              Fund brokerage account <ChevronRight />
            </Button>
          </form>
        </section>
      </section>
    </>
  );
};

export { EquitiesFundUI };
