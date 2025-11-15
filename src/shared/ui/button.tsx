"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "fill" | "outline";
  size?: "sm" | "md" | "lg";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        fill: "bg-black text-white hover:bg-black",
        outline:
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-[38px] px-4 text-sm",
        lg: "h-11 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "fill",
      size: "md",
    },
  }
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "fill",
      size = "md",
      className = "",
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
