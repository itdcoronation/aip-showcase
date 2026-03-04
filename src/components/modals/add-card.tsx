import { X } from "lucide-react";
import { Modal, ModalProps } from "../modal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DatePicker } from "../form/date-picker";

const formSchema = z.object({
  cardNumber: z.string().min(1, "Amount is required"),
  name: z.string().min(1, "Amount is required"),
  cvv: z
    .string()
    .min(1, "Amount is required")
    .length(3, "CVV must have 3 digits"),
  expiry: z.date(),
});

type AddCardFormData = z.infer<typeof formSchema>;

interface AddCardProps extends ModalProps {
  handleContinue: (data: AddCardFormData) => void;
}
const AddCardModal: React.FC<AddCardProps> = ({ handleContinue, ...props }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    control,
  } = useForm<AddCardFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<AddCardFormData> = (data) => {
    handleContinue(data);
  };

  return (
    <Modal {...props} contentClassName="px-4 py-6 md:px-10 md:pt-8 md:pb-16 max-w-[500px]">
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-h4 font-medium text-txt-primary mb-1">
            Add new card
          </p>
          <p className="text-p3 text-txt-secondary">Descriptors</p>
        </div>
        <X role="button" onClick={props.close} />
      </div>
      <form className="grid gap-4" >
        <Input
          label="Card number"
          name="cardNumber"
          type="number"
          register={register}
          placeholder="0000 0000 0000 0000"
          required
          validatormessage={errors.cardNumber?.message}
        />
        <Input
          label="Name"
          name="name"
          type="text"
          register={register}
          placeholder="Enter the name on this card"
          required
          validatormessage={errors.name?.message}
        />
        <Controller
          name="expiry"
          control={control}
          rules={{ required: "Expiry is required" }}
          render={({ field }) => (
            <DatePicker
              label="Expiry date"
              value={field.value}
              handleChange={(value) => field.onChange(value!)}
              validatormessage={errors.expiry?.message}
              required
              parentClassName="w-full"
              placeholder="MM/YY"
              dateFormat="MM/yy"
            />
          )}
        />
        <Input
          label="CVV"
          name="cvv"
          type="number"
          register={register}
          placeholder="•••"
          required
          validatormessage={errors.cvv?.message}
          hint="This is the 3 digits behind your card"
        />
        <Button disabled={!isValid} className="w-full mt-14" onClick={handleSubmit(onSubmit)}>
          Save
        </Button>
      </form>
    </Modal>
  );
};

export { AddCardModal };
