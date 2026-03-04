import { Input } from "@/components/ui/input";
import React from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export type AccountEmailFormData = z.infer<typeof formSchema>;

const AccountEmailForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<AccountEmailFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<AccountEmailFormData> = (
    data: AccountEmailFormData
  ) => {
    console.log("Form submitted:", data);
  };

  return (
    <>
      <div className="mb-8 md:mb-10">
        <h2 className="font-semibold text-p2 md:text-h3 text-txt-primary mb-2">Email</h2>
        <p className="text-xs md:text-sm text-txt-tertiary">Update your email address </p>
      </div>
      <form className="space-y-6 flex-row flex-wrap flex justify-between">
        <Input
          label="Current email"
          placeholder="Current email"
          required
          type="email"
          parentClassName="w-full"
          disabled
          value={"philipofei@coronation.com"}
        />
        <Input
          label="Enter new email address"
          name="email"
          type="email"
          register={register}
          placeholder="E.g. janedoe@company.com"
          required
          validatormessage={errors.email?.message}
          parentClassName="w-full"
        />

        <div className="mt-8 space-y-2 w-full">
          <Button
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
          >
            Send request <ChevronRight />
          </Button>
        </div>
      </form>
    </>
  );
};

export { AccountEmailForm };
