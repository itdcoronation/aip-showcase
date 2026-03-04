import * as React from "react";
import {
  PhoneInput,
  ParsedCountry,
} from "react-international-phone";
import "react-international-phone/style.css";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface CustomPhoneInputProps {
  label?: string | ReactNode;
  validatormessage?: string;
  hint?: string;
  parentClassName?: string;
  labelClassName?: string;
  className?: string;
  inputClassName?: string;
  value?: string;
  onChange?: (
    phone: string,
    meta: { country: ParsedCountry; inputValue: string }
  ) => void;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  name?: string;
}

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = (props) => {
  const {
    label,
    required,
    validatormessage,
    parentClassName,
    className,
    hint,
    name,
    labelClassName,
    value,
    disabled,
    placeholder,
    inputClassName,
    onChange,
  } = props;

  return (
    <div className={cn(parentClassName)}>
      {label && (
        <label
          htmlFor={`${label}`}
          className={cn(
            "block font-medium mb-1 text-txt-primary !text-p3",
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-txt-brand ml-[2px]">*</span>}
        </label>
      )}
      <PhoneInput
        defaultCountry="ng"
        className={cn(
          "w-full h-[40px] md:h-[44px] rounded-[10px] border border-stroke-primary bg-transparent px-3 ring-offset-white",
          disabled ? "border-bg-disabled bg-bg-disabled text-txt-disabled" : "",
          className
        )}
        inputClassName={cn(
          "w-full border-none bg-transparent !pl-3 !pr-0 ring-offset-white placeholder:text-txt-tertiary disabled:cursor-not-allowed !text-p3 md:!text-p2 !h-full disabled:!border-bg-disabled disabled:!bg-bg-disabled disabled:!text-txt-disabled",
          inputClassName
        )}
        countrySelectorStyleProps={{
          className: "my-auto",
          buttonClassName: "!bg-transparent",
        }}
        value={value}
        inputProps={{ placeholder, disabled, name }}
        onChange={onChange}
      />
      {validatormessage && (
        <small className="block mt-1 text-txt-danger !text-l1 md:!text-p3">
          {validatormessage}
        </small>
      )}
      {hint && (
        <small className="block mt-1 text-txt-tertiary !text-l1 md:!text-p3">{hint}</small>
      )}
    </div>
  );
};

export { CustomPhoneInput };
