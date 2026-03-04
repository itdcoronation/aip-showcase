import { Modal, ModalProps } from "../modal";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import { useSubmitFeedback } from "@/requests/services/utils/feedback";
import useUserStore from "@/store/user";
import { toast } from "sonner";

const formSchema = z.object({
  message: z.string().optional(),
  rating: z.number().min(1, "Please provide a rating").max(5),
});
type FeedbackFormData = z.infer<typeof formSchema>;

interface FeedbackModalProps extends ModalProps {
  description?: string;
}

const FeedbackModal = ({ ...props }: FeedbackModalProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: { rating: 0, message: "" },
  });
  const { basic_info } = useUserStore();
  const { mutate, isPending } = useSubmitFeedback({
    onSuccess: (data) => {
      console.log(data, "success");
      toast.success(data.message ?? "Feedback submitted successfully");
      props.close();
    },
    onError: (error) => {
      console.log(error, "error");
      toast.error(
        error?.response?.data?.message || "An error occurred during feedback"
      );
    },
  });

  const onSubmit: SubmitHandler<FeedbackFormData> = (data) => {
    console.log(data, "data");

    mutate({ email: basic_info?.email as string, ...data });
  };
  const isMobile = useDeviceSize(800);

  return (
    <Modal
      {...props}
      dialogClassName="bg-[#3F2D491F]"
      contentClassName="bg-white w-full max-w-[500px] rounded-[12px] px-4 md:px-8 py-8 text-center gap-10 text-left"
    >
      <div className="mb-8">
        <div className="flex items-center mb-2 justify-between gap-4">
          <h1 className="text-p1 sm:text-h4 font-medium text-txt-primary ">
            We would appreciate your feedback
          </h1>
          <XIcon
            role="button"
            className="ml-auto min-h-[24px]"
            onClick={props.close}
          />
        </div>
        <p className="text-p4 sm:text-p3 text-txt-secondary">
          {props.description ?? "How would you rate your onboarding"}
        </p>
      </div>
      <form>
        <Rating
          value={watch("rating")}
          onValueChange={(rating) => setValue("rating", rating)}
          className="justify-between w-full mb-8"
          defaultValue={5}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingButton key={index} size={isMobile ? 32 : 48} />
          ))}
        </Rating>
        <Textarea
          label="Additional message (Optional)"
          name="message"
          register={register}
          placeholder="Share your feedback"
          validatormessage={errors.message?.message}
          className="min-h-[100px] mb-16"
        />

        <Button
          loading={isPending}
          disabled={watch("rating") === 0 || isPending}
          className={cn("w-full")}
          onClick={handleSubmit(onSubmit)}
        >
          Share your feedback
        </Button>
      </form>
    </Modal>
  );
};

export { FeedbackModal };
