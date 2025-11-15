"use client";

import { useEffect, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "1000px";
  className?: string;
  contentClassName?: string;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "1000px": "max-w-[1000px]",
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
        "fixed inset-0 z-50 flex items-center justify-center bg-gray-overlay/60 backdrop-blur-sm",
        className
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full rounded-lg bg-white shadow-dialog",
          maxWidthClasses[maxWidth],
          contentClassName
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
