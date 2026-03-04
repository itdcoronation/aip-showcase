import { InputOTP, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import * as React from "react";

interface CustomInputOTPProps {
  value: string;
  onChange: (value: string) => void;
}
const CustomInputOTP: React.FC<CustomInputOTPProps> = ({ value, onChange }) => {

  const otpSlotClassName = "border border-stroke-primary w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] text-p3 rounded-md !bg-transparent outline-none !ring-none"
  return (
    <>
      <InputOTP autoFocus value={value} onChange={onChange} maxLength={6}>
        <InputOTPSlot className={otpSlotClassName} index={0} />
        <InputOTPSlot className={otpSlotClassName} index={1} />
        <InputOTPSlot className={otpSlotClassName} index={2} />
        <InputOTPSeparator className="text-stroke-primary" />
        <InputOTPSlot className={otpSlotClassName} index={3} />
        <InputOTPSlot className={otpSlotClassName} index={4} />
        <InputOTPSlot className={otpSlotClassName} index={5} />
      </InputOTP>
    </>
  );
};

export { CustomInputOTP };
