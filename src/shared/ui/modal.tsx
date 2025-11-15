"use client";

import { useEffect, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  contentClassName?: string;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = "md",
  className,
  contentClassName,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-[#5F5F62]/50 backdrop-blur-sm shadow-[inset_0px_4px_16.8px_0px_rgba(0,0,0,0.25)]",
        className
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-white rounded-lg w-full",
          maxWidthClasses[maxWidth],
          contentClassName
        )}
        style={{
          boxShadow: `
            0px 16px 32px 0px rgba(29, 33, 45, 0.1),
            0px 1px 4px 0px rgba(29, 33, 45, 0.15),
            0px 0px 1px 0px rgba(29, 33, 45, 0.2)
          `.trim(),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
