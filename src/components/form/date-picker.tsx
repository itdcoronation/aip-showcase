"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContentNoPortal,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Matcher } from "react-day-picker";

export interface DatePickerProps {
  value: Date | undefined;
  handleChange: (val: Date | undefined) => void;
  label?: string | React.ReactNode;
  validatormessage?: string;
  hint?: string;
  parentClassName?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  labelClassName?: string;
  hideFieldIcon?: boolean;
  disabled?: boolean;
  parentContainer?: HTMLElement;
  dateFormat?: string;
  calendarDisabled?: Matcher | Matcher[] | undefined;
  startMonth?: Date;
  endMonth?: Date;
}

const DatePicker: React.FC<DatePickerProps> = (props) => {
  const {
    value,
    handleChange,
    parentClassName,
    label,
    required,
    className,
    validatormessage,
    hint,
    placeholder,
    labelClassName,
    hideFieldIcon,
    disabled,
    parentContainer,
    dateFormat,
    calendarDisabled,
    startMonth,
    endMonth,
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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal hover:border-vobb-neutral-100 focus:border-vobb-neutral-100 hover:bg-white h-[40px] md:h-[44px] disabled:border-bg-disabled disabled:bg-bg-disabled disabled:opacity-[100%]",
              !value && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            {!hideFieldIcon ? <CalendarIcon className="mr-2 h-4 w-4" /> : ""}
            {value ? (
              format(value, dateFormat ?? "dd-MM-yyyy")
            ) : (
              <span>{placeholder ?? "Pick a date"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContentNoPortal
          container={parentContainer}
          className="w-auto p-0"
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleChange}
            autoFocus
            captionLayout="dropdown"
            startMonth={startMonth}
            endMonth={endMonth}
            disabled={calendarDisabled}
          />
        </PopoverContentNoPortal>
      </Popover>
      {validatormessage && (
        <small className="block mt-1 text-txt-danger !text-p3">
          {validatormessage}
        </small>
      )}
      {hint && (
        <small className="block mt-1 text-txt-tertiary !text-p3">{hint}</small>
      )}
    </div>
  );
};

export { DatePicker };
