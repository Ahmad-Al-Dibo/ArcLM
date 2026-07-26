import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("ui-card", className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ui-card-header", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("ui-card-title", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("ui-card-description", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ui-card-content", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ui-card-footer", className)} {...props} />;
}

export function SectionContainer({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("ui-section-container", className)} {...props} />;
}

export function Divider() {
  return <hr className="ui-divider" />;
}

export function CardExample({ children }: { children: ReactNode }) {
  return <div className="ui-stack">{children}</div>;
}
