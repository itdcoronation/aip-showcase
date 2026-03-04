"use client";
import { SelectInput } from "@/components/form/select-input";
import { Button } from "@/components/ui/button";
import {
  embassyOptions,
  investmentTypeOptions,
  locationOptions,
} from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { NoticeModal } from "@/components/modals/notice-modal";
import { ROUTES } from "@/lib/routes";
import { PaymentMethod } from "@/components/payment-method";
import { CopySimpleIcon } from "@/assets/vectors/icons";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

const formSchema = z.object({
  investment_type: z.string().min(1, "Select an investment type"),
  embassy: z.string().min(1, "Select an investment type"),
  location: z.string().min(1, "Select an investment type"),
});

type RequestEmbassyLetterFormData = z.infer<typeof formSchema>;

export const RequestEmbassyLetterUI = () => {
  const [show, setShow] = useState(false);
  const [payment, setPayment] = useState(false);

  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors, isValid },
    watch,
    control,
    reset,
  } = useForm<RequestEmbassyLetterFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<RequestEmbassyLetterFormData> = (data) => {
    console.log(data);

    if (data.investment_type === "equities") {
      setPayment(true);
      return;
    }
    setShow(true);
  };

  return (
    <>
      <NoticeModal
        show={show}
        close={() => setShow(false)}
        description="Your request has been received; you will receive a signed embassy letter within 24 hours"
        title="Request received"
        action={{
          text: (
            <>
              Send another request
              <ChevronRight className="min-w-[20px] !h-[20px]" />
            </>
          ),
          action: () => {
            setShow(false);
            setPayment(false);
            reset();
          },
        }}
        secondaryAction={{
          text: <>Go to service hub</>,
          action: () => router.push(ROUTES.service_hub_embassy),
        }}
      />
      <section className="px-4 sm:px-6 py-4">
        <header className="mb-8 hidden sm:block">
          <h1 className="text-p1 font-semibold">Service hub</h1>
        </header>
        <Button onClick={router.back} variant={"ghost"} size={"sm"}>
          <XIcon /> Cancel
        </Button>

        <section className="mx-auto max-w-[940px] mt-4 sm:mt-8">
          <div className="mb-8">
            <h2 className="text-h4 sm:text-h3 font-semibold text-txt-primary mb-1">
              Request embassy letter
            </h2>
            <p className="text-p4 sm:text-p3 text-txt-tertiary">
              Get a signed document reflecting your investment, suitable for
              submission to any embassy
            </p>
          </div>

          {!payment ? (
            <form className="text-sm grid gap-4 sm:gap-8">
              <Controller
                name="investment_type"
                control={control}
                rules={{ required: "Investment type is required" }}
                render={({ field }) => (
                  <SelectInput
                    label="Investment type"
                    options={investmentTypeOptions}
                    required
                    onChange={(value) => field.onChange(value)}
                    validatormessage={errors.investment_type?.message}
                    value={field.value}
                    parentClassName="w-full"
                    triggerClassName="bg-white"
                    placeholder="Select type of investment"
                  />
                )}
              />
              <div className="flex-col sm:flex-row flex gap-4">
                <Controller
                  name="embassy"
                  control={control}
                  rules={{ required: "Embassy is required" }}
                  render={({ field }) => (
                    <SelectInput
                      label="Embassy"
                      options={embassyOptions}
                      required
                      onChange={(value) => field.onChange(value)}
                      validatormessage={errors.embassy?.message}
                      value={field.value}
                      parentClassName="w-full"
                      triggerClassName="bg-white"
                      placeholder="Select corresponding embassy"
                    />
                  )}
                />
                {!!watch("embassy") ? (
                  <Controller
                    name="location"
                    control={control}
                    rules={{ required: "Location is required" }}
                    render={({ field }) => (
                      <SelectInput
                        label="Location"
                        options={locationOptions}
                        required
                        onChange={(value) => field.onChange(value)}
                        validatormessage={errors.location?.message}
                        value={field.value}
                        parentClassName="w-full"
                        triggerClassName="bg-white"
                        placeholder="Select location"
                      />
                    )}
                  />
                ) : null}
              </div>

              <Button
                disabled={!isValid}
                onClick={handleSubmit(onSubmit)}
                className="w-full mt-8 mb-2"
              >
                Send request <ChevronRight />
              </Button>
            </form>
          ) : (
            <PaymentStep
              handleContinue={() => {
                setShow(true);
              }}
            />
          )}
        </section>
      </section>
    </>
  );
};

const PaymentStep = ({ handleContinue }: { handleContinue: () => void }) => {
  const [method, setMethod] = useState<string | undefined>();
  const [card, setCard] = useState<string | undefined>();
  const { copy } = useCopyToClipboard();
  return (
    <>
      <section className="grid gap-8">
        <div>
          <p className="text-xs mb-2 text-black">
            Make a payment to get your letter
          </p>
          <div className="flex items-center gap-4">
            <p className="text-h2 text-txt-primary font-semibold">₦ 2,500.00</p>
            <CopySimpleIcon onClick={() => copy("2500")} />
          </div>
        </div>
        <PaymentMethod
          method={method ?? ""}
          onSelectMethod={setMethod}
          card={card ?? ""}
          onSelectCard={setCard}
        />
        <div>
          <Button
            disabled={!method || (method === "card" && !card)}
            onClick={handleContinue}
            className="w-full mb-2"
          >
            Send request <ChevronRight />
          </Button>
        </div>
      </section>
    </>
  );
};
