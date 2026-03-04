import * as React from "react";
import { cn } from "@/lib/utils";
import { ReactNode, useRef, useEffect } from "react";
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

export interface SelectInputPaginatedProps {
  label?: string | ReactNode;
  validatormessage?: string;
  hint?: string;
  parentClassName?: string;
  labelClassName?: string;
  triggerClassName?: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  query: ReturnType<typeof import("@tanstack/react-query").useInfiniteQuery>;
  getOptions: (pages: any) => { label: string; value: string }[]; // function to map API data to options
}

const SelectInputPaginated: React.FC<SelectInputPaginatedProps> = ({
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
  triggerClassName,
  query,
  getOptions,
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    query;
  const options = getOptions((data as any)?.pages ?? []);
  const listRef = useRef<HTMLDivElement>(null);

  // Infinite scroll handler
  useEffect(() => {
    if (!hasNextPage || !listRef.current) return;
    const el = listRef.current;
    const handleScroll = () => {
      if (
        el.scrollHeight - el.scrollTop - el.clientHeight < 40 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, listRef?.current]);

  const fetchMore = () => {
    fetchNextPage();
  };

  const [search, setSearch] = React.useState("");

  const filteredOptions = search
    ? options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

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
        <PopoverTrigger disabled={disabled} asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={false}
            className={cn(
              "w-full justify-between h-[40px] md:h-[44px] disabled:border-bg-disabled disabled:bg-bg-disabled disabled:opacity-[100%]",
              value ? "" : "text-muted-foreground",
              triggerClassName
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
          <Command onScroll={() => console.log("Scroll")}>
            {options.length > 5 ? (
              <CommandInput
                onValueChange={setSearch}
                value={search}
                placeholder="Search..."
              />
            ) : null}
            <CommandList
              ref={listRef}
              style={{ maxHeight: 250, overflowY: "auto" }}
            >
              <CommandEmpty>
                {isLoading ? "Loading options..." : "No options found."}
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
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
                {hasNextPage && !isFetchingNextPage ? (
                  <Button
                    onClick={fetchMore}
                    size={"sm"}
                    variant={"ghost"}
                    className="text-center w-full mt-2 text-purple-700"
                  >
                    Load more
                  </Button>
                ) : null}
                {isFetchingNextPage && (
                  <div className="text-center py-2 text-muted-foreground text-xs">
                    Loading more...
                  </div>
                )}
                {!hasNextPage && !isFetchingNextPage && options.length > 0 && (
                  <div className="text-center py-2 text-muted-foreground text-xs">
                    End of results
                  </div>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
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

export { SelectInputPaginated };
