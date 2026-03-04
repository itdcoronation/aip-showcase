import * as React from "react";
import { ReactNode } from "react";
import { UseFormRegister } from "react-hook-form";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string | React.ReactNode;
  validatormessage?: string;
  hint?: string | ReactNode;
  parentClassName?: string;
  labelClassName?: string;
  className?: string;
  register?: UseFormRegister<any>;
  defaultValue?: string;
  ref?: React.ForwardedRef<HTMLTextAreaElement>;
  hintClassName?: string;
}

function Textarea(props: TextareaProps) {
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
    ref,
    hintClassName,
    ...rest
  } = props;

  const inputClasses = cn(
    "flex min-h-16 w-full rounded-[10px] border border-stroke-primary bg-transparent py-2 px-3 text-p3 md:text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-txt-tertiary focus-visible:bg-white focus-visible:outline-none focus-visible:border-primary-base disabled:cursor-not-allowed disabled:border-bg-disabled disabled:bg-bg-disabled",
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

      {register && name ? (
        <textarea
          data-slot="textarea"
          {...rest}
          {...register(name, {
            required: required,
            minLength: props.minLength,
            onChange: props.onChange,
          })}
          defaultValue={defaultValue}
          className={inputClasses}
        />
      ) : (
        <textarea
          data-slot="textarea"
          {...rest}
          className={inputClasses}
          ref={ref}
        />
      )}

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
}

export { Textarea };
