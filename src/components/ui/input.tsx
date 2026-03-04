"use client";

import * as React from "react";
import { useState } from "react";
import { ReactNode } from "react";
import { UseFormRegister } from "react-hook-form";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeSlashIcon } from "@/assets/vectors/icons";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | ReactNode;
  startElement?: ReactNode;
  startOffset?: string;
  endElement?: ReactNode;
  endOffset?: string;
  validatormessage?: string;
  hint?: string | ReactNode;
  parentClassName?: string;
  labelClassName?: string;
  className?: string;
  register?: UseFormRegister<any>;
  defaultValue?: string;
  ref?: React.ForwardedRef<HTMLInputElement>;
  hintClassName?: string ;
}

const Input: React.FC<InputProps> = (props) => {
  const {
    label,
    required,
    validatormessage,
    parentClassName,
    className,
    hint,
    name,
    register,
    defaultValue,
    labelClassName,
    type,
    ref,
    startElement,
    endElement,
    startOffset,
    endOffset,
    hintClassName,
    ...rest
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const inputClasses = cn(
    "flex h-[40px] md:h-[44px] w-full rounded-[10px] border border-stroke-primary bg-transparent px-3 text-p3 md:text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-txt-tertiary focus-visible:bg-white focus-visible:outline-none focus-visible:border-primary-base disabled:cursor-not-allowed disabled:border-bg-disabled disabled:bg-bg-disabled disabled:text-txt-disabled",
    `${
      validatormessage
        ? "border-stroke-danger focus-visible:ring-stroke-danger"
        : ""
    }`,
    className
  );

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
      <div className={cn("relative", startElement && "flex items-center")}>
        {startElement && (
          <span className="absolute top-[10px] md:top-[12px] left-3">{startElement}</span>
        )}

        {register && name ? (
          <input
            data-slot="input"
            type={inputType}
            {...rest}
            {...register(name, {
              required: required,
              minLength: props.minLength,
              onChange: props.onChange,
              min: props.min,
              max: props.max,
            })}
            defaultValue={defaultValue}
            className={inputClasses}
            style={{
              paddingLeft: startElement ? startOffset : "12px",
              paddingRight: endElement ? endOffset : "12px",
            }}
          />
        ) : (
          <input
            data-slot="textarea"
            {...rest}
            type={inputType}
            className={inputClasses}
            ref={ref}
             style={{
              paddingLeft: startElement ? startOffset : "12px",
              paddingRight: endElement ? endOffset : "12px",
            }}
          />
        )}
        {endElement && (
          <span className="absolute top-[12px] right-3">{endElement}</span>
        )}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-[12px] text-gray-500 focus:outline-none"
          >
            {showPassword ? (
              <EyeSlashIcon width={20} height={20} />
            ) : (
              <EyeIcon width={20} height={20} />
            )}
          </button>
        )}
      </div>
      {validatormessage && (
        <small className="block mt-1 text-txt-danger !text-l1 md:!text-p3">
          {validatormessage}
        </small>
      )}
      {hint && (
        <small
          className={cn("block mt-1 text-txt-tertiary !text-l1 md:!text-p3", hintClassName)}
        >
          {hint}
        </small>
      )}
    </div>
  );
};

export { Input };
