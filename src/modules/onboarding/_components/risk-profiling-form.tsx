import React, { useEffect } from "react";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/form/select-input";
import {
  employmentStatusOptions,
  incomeRangeOptions,
  investmentExperienceOptions,
  investmentGoalOptions,
  investmentPercentageOptions,
  investmentPortfolioOptions,
  withdrawalTimelineOptions,
} from "@/lib/constants";

const formSchema = z.object({
  employment_status: z.string().min(1, "Required"),
  income_range: z.string().min(1, "Required"),
  investment_percent: z.string().min(1, "Required"),
  investment_experience: z.string().min(1, "Required"),
  withdrawal: z.string().min(1, "Required"),
  goal: z.string().min(1, "Required"),
  portfolio: z.string().min(1, "Required"),
});

export type RiskProfilingFormData = z.infer<typeof formSchema>;

interface RiskProfilingFormProps {
  submit: (data: RiskProfilingFormData) => void;
  initData?: RiskProfilingFormData;
  handleBack?: () => void;
  key?: string;
  isPending?: boolean;
}

const RiskProfilingForm: React.FC<RiskProfilingFormProps> = ({
  submit,
  handleBack,
  initData,
  isPending,
  key,
}) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    reset,
    control,
  } = useForm<RiskProfilingFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (initData) {
      reset(initData);
    }
  }, [initData]);

  const onSubmit: SubmitHandler<RiskProfilingFormData> = (
    data: RiskProfilingFormData
  ) => {
    console.log("Form submitted:", data);
    submit(data);
  };

  return (
    <>
      <form key={key} className="space-y-4">
        <Controller
          name="employment_status"
          control={control}
          rules={{ required: "Required" }}
          render={({ field }) => (
            <SelectInput
              label="What is your current employment status?"
              options={employmentStatusOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.employment_status?.message}
              value={field.value}
              placeholder="Select from the list"
            />
          )}
        />
        <Controller
          name="income_range"
          control={control}
          rules={{ required: "Required" }}
          render={({ field }) => (
            <SelectInput
              label="What is your annual Income range?"
              options={incomeRangeOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.income_range?.message}
              value={field.value}
              placeholder="Select from the list"
            />
          )}
        />
        <Controller
          name="investment_percent"
          control={control}
          rules={{ required: "Required" }}
          render={({ field }) => (
            <SelectInput
              label="What percentage of your income are you willing to invest?  "
              options={investmentPercentageOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.investment_percent?.message}
              value={field.value}
              placeholder="Select from the list"
            />
          )}
        />
        <Controller
          name="investment_experience"
          control={control}
          rules={{ required: "Required" }}
          render={({ field }) => (
            <SelectInput
              label="What is your experience with investing?  "
              options={investmentExperienceOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.investment_experience?.message}
              value={field.value}
              placeholder="Select from the list"
            />
          )}
        />
        <Controller
          name="withdrawal"
          control={control}
          rules={{ required: "Required" }}
          render={({ field }) => (
            <SelectInput
              label="When would you consider withdrawing from your investment?"
              options={withdrawalTimelineOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.withdrawal?.message}
              value={field.value}
              placeholder="Select from the list"
            />
          )}
        />
        <Controller
          name="goal"
          control={control}
          rules={{ required: "Required" }}
          render={({ field }) => (
            <SelectInput
              label="What is your primary investment goal?"
              options={investmentGoalOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.goal?.message}
              value={field.value}
              placeholder="Select from the list"
            />
          )}
        />
        <Controller
          name="portfolio"
          control={control}
          rules={{ required: "Required" }}
          render={({ field }) => (
            <SelectInput
              label="Which investment portfolio would you choose?"
              options={investmentPortfolioOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.portfolio?.message}
              value={field.value}
              placeholder="Select from the list"
            />
          )}
        />

        <div className="mt-8 space-y-2 w-full">
          <Button
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isPending}
            loading={isPending}
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

export { RiskProfilingForm };
