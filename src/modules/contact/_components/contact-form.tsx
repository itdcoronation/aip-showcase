import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { CustomPhoneInput } from "@/components/form/phone-input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import useUserStore from "@/store/user";
import { useEffect } from "react";
import { useContactUs } from "@/requests/services/utils/contact-us";
import { toast } from "sonner";
import { SelectInput } from "@/components/form/select-input";
import { investmentTypeOptions } from "@/lib/constants";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters long"),
  first_name: z.string({ required_error: "First name is required" }),
  last_name: z.string({ required_error: "Last name is required" }),
  investment: z.string({ required_error: "Gender is required" }),
  message: z.string().min(1, "Message is required"),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type ContactFormData = z.infer<typeof formSchema>;

const ContactForm = () => {
  const {
    register,
    formState: { errors, isValid },
    watch,
    setValue,
    handleSubmit,
    reset,
    control,
  } = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const { basic_info } = useUserStore();

  useEffect(() => {
    reset({
      first_name: basic_info?.first_name || "",
      last_name: basic_info?.last_name || "",
      email: basic_info?.email || "",
      phone: basic_info?.phone || "",
    });
  }, [basic_info]);

  const { mutate, isPending } = useContactUs({
    onSuccess: (data) => {
      console.log("Contact us successful:", data);
      toast.success("Message sent successfully");
      reset({
        first_name: basic_info?.first_name || "",
        last_name: basic_info?.last_name || "",
        email: basic_info?.email || "",
        phone: basic_info?.phone || "",
        message: "",
        investment: "",
        terms_accepted: false,
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? "Failed to send message");
      console.error("Contact us error:", error);
    },
  });

  const onSubmit: SubmitHandler<ContactFormData> = (data) => {
    mutate({
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      mobilePhone: data.phone,
      enquiryRelatedTo: data.investment,
      message: data.message,
    });
  };


  return (
    <>
      <section className="py-4 px-3 border border-[#EEEFF1] rounded-md bg-white shadow-sm w-fit max-w-md">
        <div className="mb-2">
          <h2 className="font-semibold text-p2 md:text-h3 text-txt-primary mb-2">
            Get in touch
          </h2>
          <p className="text-xs md:text-sm text-txt-tertiary">
            Our friendly team would love to hear from you{" "}
          </p>
        </div>
        <form className="grid gap-4">
          <Input
            label="First name"
            name="first_name"
            placeholder="Enter your first name"
            validatormessage={errors.first_name?.message}
            required
            register={register}
          />
          <Input
            label="Last name"
            name="last_name"
            placeholder="Enter your last name"
            validatormessage={errors.last_name?.message}
            required
            register={register}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            register={register}
            placeholder="Enter your email address"
            required
            validatormessage={errors.email?.message}
            parentClassName="w-full"
          />
          <CustomPhoneInput
            label="Phone number"
            name="phone"
            placeholder="+1 (555) 000-0000"
            validatormessage={errors.phone?.message}
            required
            onChange={(phone) => {
              setValue("phone", phone);
            }}
            value={watch("phone")}
            parentClassName="w-full"
          />
          <Controller
            name="investment"
            control={control}
            render={({ field }) => (
              <SelectInput
                label="Interested investment"
                options={investmentTypeOptions}
                required
                onChange={(value) => field.onChange(value)}
                validatormessage={errors.investment?.message}
                value={field.value}
                placeholder="Investment interested in"
              />
            )}
          />
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <Textarea
                label="Message"
                name="message"
                placeholder="Type your message"
                validatormessage={errors.message?.message}
                required
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <div>
            <div className="grid grid-cols-[20px_1fr] gap-2">
              <Controller
                name="terms_accepted"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    className="w-[20px] h-[20px] rounded-[6px]"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    id="terms_accepted"
                    name="terms_accepted"
                  />
                )}
              />
              <p className="text-p4 md:text-p3 font-medium text-txt-secondary">
                Clicking on the checkbox, you confirm that you agree to{" "}
                <Link className="text-txt-brand-dark font-semibold" href="">
                  Terms of service
                </Link>{" "}
                and{" "}
                <Link className="text-txt-brand-dark font-semibold" href="">
                  Privacy policy
                </Link>
              </p>
            </div>
            {errors.terms_accepted && (
              <small className="text-txt-danger !text-p3 mt-1">
                {errors.terms_accepted.message}
              </small>
            )}
          </div>

          <Button
            className="w-full mt-8"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isPending}
            loading={isPending}
          >
            Send message
          </Button>
        </form>
      </section>
    </>
  );
};

export { ContactForm };
