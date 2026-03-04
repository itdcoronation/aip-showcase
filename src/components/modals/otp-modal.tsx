import { infoImg } from "@/assets/images";
import { Modal, ModalProps } from "../modal";
import Image from "next/image";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { CustomInputOTP } from "../form/input-otp";
import { useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";

interface OtpModalProps extends ModalProps {
  handleContinue: () => void;
  continueText?: string;
  title?: string;
}
const OtpModal: React.FC<OtpModalProps> = ({
  handleContinue,
  continueText = "Confirm sale",
  title = "Confirm transaction",
  ...props
}) => {
  const [otp, setOtp] = useState("");

  const { formattedCountdown, canResend } = useCountdown(120);

  return (
    <Modal
      {...props}
      dialogClassName="bg-[#3F2D491F]"
      contentClassName="bg-white w-full max-w-[480px] rounded-[12px] px-4 md:px-8 py-8 text-center flex flex-col items-center justify-center gap-10"
    >
      <XIcon role="button" className="ml-auto" onClick={props.close} />
      <Image
        className="w-[70%] max-w-[229px]"
        width={229}
        height={232}
        src={infoImg}
        alt="check mark"
      />
      <div>
        <h1 className="text-p1 sm:text-h3 font-semibold text-txt-primary mb-2">
          {title}
        </h1>
        <p className="text-p4 sm:text-p3 text-txt-secondary mb-2">
          Enter the code that was sent to the email
        </p>
        <p className="font-medium mb-8">janedoe@user.com</p>
        <CustomInputOTP value={otp} onChange={setOtp} />
        {canResend ? (
          <p className="text-p3 text-txt-secondary">
            Didn’t receive the code?{" "}
            <span
              // onClick={handleResend}
              role="button"
              className="font-medium text-txt-primary"
            >
              Resend
            </span>
          </p>
        ) : (
          <p className="font-semibold mt-6">{formattedCountdown}</p>
        )}
      </div>
      <div className="grid gap-2 w-full">
        <Button
          className="w-full max-w-[336px] mx-auto"
          onClick={handleContinue}
        >
          {continueText}
        </Button>
      </div>
    </Modal>
  );
};

export { OtpModal };
