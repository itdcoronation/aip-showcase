import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        brand:
          "bg-bg-brand hover:bg-bg-brand-active disabled:bg-bg-disabled !text-txt-primary-inv disabled:!text-txt-disabled",
        secondary:
          "bg-bg-secondary hover:bg-bg-quartermary disabled:bg-bg-disabled text-txt-primary disabled:text-txt-disabled",
        outline:
          "border border-stroke-primary bg-transparent hover:bg-bg-quartermary disabled:bg-bg-disabled text-txt-primary disabled:text-txt-disabled",
        ghost:
          "bg-transparent hover:bg-bg-quartermary disabled:bg-bg-disabled text-txt-primary disabled:text-txt-disabled",
        success:
          "bg-bg-success hover:bg-bg-success-active disabled:bg-bg-disabled !text-txt-primary-inv disabled:!text-txt-disabled",
        destructive:
          "bg-bg-danger hover:bg-bg-danger-active disabled:bg-bg-disabled !text-txt-primary-inv disabled:!text-txt-disabled",
        neutral:
          "bg-bg-secondary-inv hover:bg-bg-tertiary-inv disabled:bg-bg-disabled !text-txt-primary-inv disabled:!text-txt-disabled",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        lg: "h-[44px] px-4 py-2 has-[>svg]:px-3 rounded-[10px] text-p2",
        m: "h-[36px] rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        sm: "h-[28px] rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs sm:text-sm",
        xs: "h-[24px] rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        // lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "lg",
    },
  }
);


export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className }),
        loading && "opacity-60 cursor-not-allowed pointer-events-none"
      )}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <LoaderCircle className="animate-spin size-4" />
      ) : (
        props.children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
