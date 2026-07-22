import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type StatusVariant =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "planned"
  | "experimental";

interface StatusProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: StatusVariant;
  children: ReactNode;
}

export function Badge({ variant = "neutral", className, children, ...props }: StatusProps) {
  return (
    <span className={cn("ui-badge", `ui-status-${variant}`, className)} {...props}>
      {children}
    </span>
  );
}

export function StatusIndicator({ variant = "neutral", className, children, ...props }: StatusProps) {
  return (
    <span className={cn("ui-status-indicator", `ui-status-${variant}`, className)} {...props}>
      <span className="ui-status-dot" aria-hidden="true" />
      <span>{children}</span>
    </span>
  );
}

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: StatusVariant;
  title: string;
  children: ReactNode;
}

export function Alert({
  variant = "neutral",
  title,
  children,
  className,
  ...props
}: AlertProps) {
  return (
    <div
      className={cn("ui-alert", `ui-status-${variant}`, className)}
      role="status"
      {...props}
    >
      <p className="ui-alert-title">{title}</p>

      <div className="ui-alert-description">
        {children}
      </div>
    </div>
  );
}

export function InlineMessage({ variant = "neutral", title, children, className, ...props }: AlertProps) {
  return (
    <div className={cn("ui-inline-message", `ui-status-${variant}`, className)} {...props}>
      <strong>{title}</strong>
      <span>{children}</span>
    </div>
  );
}
