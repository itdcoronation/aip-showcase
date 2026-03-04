import { X } from "lucide-react";
import { Modal, ModalProps } from "../modal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SelectInput } from "../form/select-input";
import { bankOptions } from "@/lib/constants";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = z.object({
  bankName: z.string().min(1, "Select a reason"),
  accountNumber: z.string().min(1, "Amount is required"),
});

type AddBankAccountFormData = z.infer<typeof formSchema>;

interface AddBankAccountProps extends ModalProps {
  handleContinue: (data: AddBankAccountFormData) => void;
}
const AddBankAccountModal: React.FC<AddBankAccountProps> = ({
  handleContinue,
  ...props
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    control,
  } = useForm<AddBankAccountFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<AddBankAccountFormData> = (data) => {
    handleContinue(data);
  };

  return (
    <Modal {...props} contentClassName="px-4 py-6 md:px-10 md:pt-8 md:pb-16 max-w-[500px]">
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-h4 font-medium text-txt-primary mb-1">
            Add bank account
          </p>
          <p className="text-p3 text-txt-secondary">Descriptors</p>
        </div>
        <X role="button" onClick={props.close} />
      </div>
      <form>
        <Controller
          name="bankName"
          control={control}
          rules={{ required: "Bank name is required" }}
          render={({ field }) => (
            <SelectInput
              label="Bank name"
              options={bankOptions}
              required
              onChange={(value) => field.onChange(value)}
              validatormessage={errors.bankName?.message}
              value={field.value}
              parentClassName="w-full whitespace-nowrap mb-4"
              triggerClassName="bg-white"
              placeholder="Select your bank"
            />
          )}
        />
        <Input
          label="Account number"
          name="accountNumber"
          type="number"
          register={register}
          placeholder="Enter your account number"
          required
          validatormessage={errors.accountNumber?.message}
        />
        <Button disabled={!isValid} className="w-full mt-14" onClick={handleSubmit(onSubmit)}>
          Save
        </Button>
      </form>
    </Modal>
  );
};

export { AddBankAccountModal };
