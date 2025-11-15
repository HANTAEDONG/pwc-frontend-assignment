"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "fill" | "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        fill: "bg-primary text-primary-foreground hover:bg-primary-dark focus-visible:ring-primary",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-dark focus-visible:ring-primary",
        secondary:
          "bg-black text-white hover:bg-gray-700 focus-visible:ring-gray-400",
        outline:
          "border border-gray-border bg-white text-gray-600 hover:bg-gray-50 focus-visible:ring-primary",
        ghost:
          "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-200",
        danger:
          "bg-danger text-white hover:bg-red-600 focus-visible:ring-danger",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
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
        {leftIcon && (
          <span className="inline-flex items-center">{leftIcon}</span>
        )}
        {children}
        {rightIcon && (
          <span className="inline-flex items-center">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
