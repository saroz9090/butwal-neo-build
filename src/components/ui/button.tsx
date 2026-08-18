import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg hover:shadow-primary/25 border border-primary/40",
        destructive: "bg-destructive text-white hover:bg-destructive/90 shadow-sm",
        outline: "border border-border/80 bg-card/80 text-foreground hover:bg-primary hover:text-white hover:border-primary shadow-sm",
        secondary: "bg-secondary text-foreground hover:bg-secondary/90 hover:text-white border border-border/60 shadow-sm",
        ghost: "text-foreground hover:bg-white/10 hover:text-white",
        link: "text-primary underline-offset-4 hover:underline hover:text-rose-400",
      },
      size: {
        default: "min-h-[42px] px-4 py-2 text-sm",
        sm: "min-h-[38px] px-3.5 py-1.5 text-xs sm:text-sm rounded-lg",
        lg: "min-h-[48px] px-6 sm:px-8 py-3 text-base rounded-2xl",
        icon: "h-10 w-10 min-h-[40px] min-w-[40px] rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
