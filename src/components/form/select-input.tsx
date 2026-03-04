"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

import { Check, ChevronDown, Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface SelectInputProps extends ComboboxProps {
  label?: string | ReactNode;
  validatormessage?: string;
  hint?: string;
  parentClassName?: string;
  labelClassName?: string;
  triggerClassName?: string;
  required?: boolean;
  isLoading?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = (props) => {
  const {
    label,
    required,
    validatormessage,
    parentClassName,
    hint,
    labelClassName,
    value,
    disabled,
    placeholder,
    onChange,
    options,
    triggerClassName,
    isLoading,
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
      <Combobox
        placeholder={placeholder}
        value={value}
        options={options}
        disabled={disabled}
        onChange={onChange}
        className={triggerClassName}
        isLoading={isLoading}
      />
      {validatormessage && (
        <small className="block mt-1 text-txt-danger !text-l1 md:!text-p3">
          {validatormessage}
        </small>
      )}
      {hint && (
        <small className="block mt-1 text-txt-tertiary !text-l1 md:!text-p3">
          {hint}
        </small>
      )}
    </div>
  );
};

export { SelectInput };

interface optionType {
  label: string;
  value: string;
}

interface ComboboxProps {
  options: optionType[];
  onChange: (val: string) => void;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
}

const Combobox = (props: ComboboxProps) => {
  const { options, placeholder, value, onChange, disabled, isLoading } = props;
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredOptions = search
    ? options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={disabled} asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-[40px] md:h-[44px] disabled:border-bg-disabled disabled:bg-bg-disabled disabled:opacity-[100%]",
            value ? "" : "text-muted-foreground",
            props.className
          )}
          disabled={disabled}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : isLoading
            ? "Loading..."
            : placeholder ?? "Select..."}

          {isLoading ? <Loader className="animate-spin" /> : <ChevronDown />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[200px] max-w-[400px] p-0 !z-[9999]">
        <Command>
          {options.length > 5 ? (
            <CommandInput
              onValueChange={setSearch}
              value={search}
              placeholder="Search..."
            />
          ) : null}
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
