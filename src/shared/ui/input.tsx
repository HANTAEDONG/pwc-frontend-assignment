"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  errorId?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, errorId, id, className = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorMessageId = errorId || `${inputId}-error`;

    return (
      <div>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            error ? "border-red-300" : ""
          } ${className}`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorMessageId : undefined}
          {...props}
        />
        {error && (
          <div
            id={errorMessageId}
            role="alert"
            className="mt-1 text-sm text-red-600"
          >
            {error}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
