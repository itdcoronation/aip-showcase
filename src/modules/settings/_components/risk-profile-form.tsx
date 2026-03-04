import React, { useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectInput } from "@/components/form/select-input";
import { employmentStatusOptions, incomeRangeOptions, investmentExperienceOptions, investmentGoalOptions, investmentPercentageOptions, investmentPortfolioOptions, withdrawalTimelineOptions } from "@/lib/constants";

const formSchema = z.object({
  employment_status: z.string({ required_error: "Required" }),
  income_range: z.string({ required_error: "Required" }),
  investment_percent: z.string({ required_error: "Required" }),
  investment_experience: z.string({ required_error: "Required" }),
  withdrawal: z.string({ required_error: "Required" }),
  goal: z.string({ required_error: "Required" }),
  portfolio: z.string({ required_error: "Required" }),
});

export type RiskProfileFormData = z.infer<typeof formSchema>;

interface RiskProfileFormProps {
  initData?: RiskProfileFormData;
}

const RiskProfileForm: React.FC<RiskProfileFormProps> = ({ initData }) => {
  const {
    formState: { errors },
    reset,
    control,
  } = useForm<RiskProfileFormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (initData) {
      reset(initData);
    }
  }, [initData]);

  return (
    <>
      <form className="space-y-4 flex-col flex-wrap flex justify-between">
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              disabled
            />
          )}
        />
      </form>
    </>
  );
};

export { RiskProfileForm };
