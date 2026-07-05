"use client";

import { Button as ShadButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "./Button.css";
import { variantClasses, sizeClasses } from "./ButtonStyles";
import type { BaseButtonProps } from "./ButtonTypes";

export function Button({
  variant = "primary",
  size = "md",
  isActive = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: BaseButtonProps) {
  return (
    <ShadButton
      className={cn(
        "btn-base",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      data-active={isActive ? "true" : undefined}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner animate-spin" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </ShadButton>
  );
}
