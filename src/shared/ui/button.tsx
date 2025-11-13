"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ variant = "primary", size = "md", className = "", ...props }, ref) => {
    return (
      <button ref={ref} className={`${className}`} {...props}>
        {props.children}
      </button>
    );
  }
);

Button.displayName = "Button";
