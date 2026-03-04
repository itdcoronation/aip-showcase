"use client";
import { SelectInput } from "@/components/form/select-input";
import { Button } from "@/components/ui/button";
import { investmentTypeOptions } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { NoticeModal } from "@/components/modals/notice-modal";
import { ROUTES } from "@/lib/routes";
import { DatePicker } from "@/components/form/date-picker";
import { isAfter } from "date-fns";
import { useFetchFactSheetInfinite } from "@/requests/services/products/fact-sheet";
import { SelectInputPaginated } from "@/components/form/select-input-paginated";
import { useGenerateStatement } from "@/requests/services/user/generate-statement";
import { toast } from "sonner";
import { format } from "date-fns";

const formSchema = z
  .object({
    investment_type: z.string().min(1, "Select an investment type"),
    fund_type: z.string(),
    from: z.date(),
    to: z.date(),
  })
  .refine((data) => isAfter(data.to, data.from), {
    message: '"End" date must be after "Start" date',
    path: ["to"],
  })
  .refine(
    (data) =>
      data.investment_type !== "mutual_fund" ||
      (data.fund_type && data.fund_type.trim().length > 0),
    {
      message: "Fund type is required for Mutual Fund",
      path: ["fund_type"],
    }
  );

type RequestAccountStatementFormData = z.infer<typeof formSchema>;

export const RequestAccountStatementUI = () => {
  const [show, setShow] = useState(false);

  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
  } = useForm<RequestAccountStatementFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      investment_type: "Mutual Fund",
    },
  });

  const { mutate, isPending } = useGenerateStatement({
    onSuccess: (data) => {
      console.log(data, "statement data");
      setShow(true);
      toast.success(data.message ?? "Statement generated successfully");
    },
    onError: (error) => {
      console.error("Error generating statement:", error);
      toast.error(
        error.response?.data?.message ??
          "An error occurred while generating the statement"
      );
    },
  });

  const onSubmit: SubmitHandler<RequestAccountStatementFormData> = (data) => {
    console.log(data);

    mutate({
      fundcode: data.fund_type,
      start_date: format(data.from, "yyyy-MM-dd"),
      end_date: format(data.to, "yyyy-MM-dd"),
    });
  };

  const query = useFetchFactSheetInfinite({
    params: { per_page: 10 },
  });

  console.log(watch(), "watch");

  return (
    <>
      <NoticeModal
        show={show}
        close={() => setShow(false)}
        description="Your request has been received; you will receive an account statement within 24 hours"
        title="Request received"
        action={{
          text: (
            <>
              Go to service hub
              <ChevronRight className="min-w-[20px] !h-[20px]" />
            </>
          ),
          action: () => router.push(ROUTES.service_hub_statement),
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
              Request account statement
            </h2>
            <p className="text-p4 sm:text-p3 text-txt-tertiary">
              Generate a  summary of your account activity for the
              selected period
            </p>
          </div>

          <form className="text-sm grid gap-4 sm:gap-8">
            <div className="flex-col sm:flex-row flex gap-4">
              <Controller
                name="investment_type"
                control={control}
                rules={{ required: "Investment type is required" }}
                render={({ field }) => (
                  <SelectInput
                    label="Investment type"
                    options={[investmentTypeOptions[0]]}
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

              {watch("investment_type") === "Mutual Fund" ? (
                <Controller
                  name="fund_type"
                  control={control}
                  rules={{ required: "Fund type is required" }}
                  render={({ field }) => (
                    <SelectInputPaginated
                      label="Fund type"
                      // options={investmentTypeOptions}
                      required
                      onChange={(value) => field.onChange(value)}
                      validatormessage={errors.fund_type?.message}
                      value={field.value}
                      parentClassName="w-full"
                      triggerClassName="bg-white"
                      placeholder="Select type of mutual fund"
                      query={query}
                      getOptions={(pages) =>
                        pages
                          .flatMap((page) => page.Data)
                          .map((fund) => ({
                            label: fund.fundName,
                            value: fund.fundCode,
                          }))
                      }
                    />
                  )}
                />
              ) : null}
            </div>

            <div className="flex-col sm:flex-row flex gap-4">
              <Controller
                name="from"
                control={control}
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <DatePicker
                    label="From"
                    value={field.value}
                    handleChange={(value) => field.onChange(value!)}
                    validatormessage={errors.from?.message}
                    required
                    parentClassName="w-full"
                    placeholder="Select a start date"
                    dateFormat="dd/MM/yy"
                    className="bg-white"
                  />
                )}
              />
              <Controller
                name="to"
                control={control}
                rules={{ required: "End date is required" }}
                render={({ field }) => (
                  <DatePicker
                    label="To"
                    value={field.value}
                    handleChange={(value) => field.onChange(value!)}
                    validatormessage={errors.to?.message}
                    required
                    parentClassName="w-full"
                    placeholder="Select an end date"
                    dateFormat="dd/MM/yy"
                    className="bg-white"
                    calendarDisabled={(date) => date > new Date()}
                    endMonth={new Date()}
                  />
                )}
              />
            </div>

            <Button
              disabled={!isValid || isPending}
              loading={isPending}
              onClick={handleSubmit(onSubmit)}
              className="w-full mt-8 mb-2"
            >
              Send request <ChevronRight />
            </Button>
          </form>
        </section>
      </section>
    </>
  );
};
