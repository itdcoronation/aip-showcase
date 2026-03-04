"use client";

import * as React from "react";
import { ReactNode } from "react";
import { UseFormRegister } from "react-hook-form";
import { cn } from "@/lib/utils";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";

export interface MoneyInputProps extends CurrencyInputProps {
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
  hintClassName?: string;
}

const MoneyInput: React.FC<MoneyInputProps> = (props) => {
  const {
    label,
    required,
    validatormessage,
    parentClassName,
    className,
    hint,
    name,
    register,
    labelClassName,
    startElement,
    endElement,
    startOffset,
    endOffset,
    hintClassName,
    ...rest
  } = props;

  const inputClasses = cn(
    "flex h-[40px] md:h-[44px] w-full rounded-[10px] border border-stroke-primary bg-transparent px-3 text-p3 md:text-p2 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-txt-tertiary focus-visible:bg-white focus-visible:outline-none focus-visible:border-primary-base disabled:cursor-not-allowed disabled:border-bg-disabled disabled:bg-bg-disabled",
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
          <span className="absolute top-[10px] md:top-[12px] left-3">
            {startElement}
          </span>
        )}

        {register && name ? (
          <CurrencyInput
            data-slot="input"
            {...rest}
            {...register(name, {
              required: required,
              minLength: props.minLength,
              onChange: props.onChange,
              min: props.min,
              max: props.max,
            })}
            className={inputClasses}
            style={{
              paddingLeft: startElement ? startOffset : "12px",
              paddingRight: endElement ? endOffset : "12px",
            }}
            decimalsLimit={2}
          />
        ) : (
          <CurrencyInput
            data-slot="input"
            {...rest}
            className={inputClasses}
            style={{
              paddingLeft: startElement ? startOffset : "12px",
              paddingRight: endElement ? endOffset : "12px",
            }}
            decimalsLimit={2}
          />
        )}
        {endElement && (
          <span className="absolute top-[12px] right-3">{endElement}</span>
        )}
      </div>
      {validatormessage && (
        <small className="block mt-1 text-txt-danger !text-l1 md:!text-p3">
          {validatormessage}
        </small>
      )}
      {hint && (
        <small
          className={cn(
            "block mt-1 text-txt-tertiary !text-l1 md:!text-p3",
            hintClassName
          )}
        >
          {hint}
        </small>
      )}
    </div>
  );
};

export { MoneyInput };
