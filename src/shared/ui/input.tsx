"use client";

import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  errorId?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, errorId, id, className = "", ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorMessageId = errorId || `${inputId}-error`;

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="block">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={className}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorMessageId : undefined}
          {...props}
        />
        {error && (
          <div id={errorMessageId} role="alert" className="text-red-600">
            {error}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
