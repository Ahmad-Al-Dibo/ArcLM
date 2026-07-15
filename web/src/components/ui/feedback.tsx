import type { ReactNode } from "react";
import { Button } from "./button";

interface FeedbackStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  details?: string;
}

export function Skeleton({ label = "Loading" }: { label?: string }) {
  return <div className="ui-skeleton" aria-label={label} />;
}

export function FeedbackState({ title, description, actionLabel, onAction, details }: FeedbackStateProps) {
  return (
    <section className="ui-feedback-state">
      <h2 className="ui-feedback-title">{title}</h2>
      <p className="ui-feedback-description">{description}</p>
      {details ? <code className="ui-code">{details}</code> : null}
      {actionLabel ? (
        <div>
          <Button variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </section>
  );
}

export function EmptyState(props: FeedbackStateProps) {
  return <FeedbackState {...props} />;
}

export function ErrorState(props: FeedbackStateProps) {
  return <FeedbackState {...props} />;
}

export function DisconnectedState(props: FeedbackStateProps) {
  return <FeedbackState {...props} />;
}

export function NotAvailableState(props: FeedbackStateProps) {
  return <FeedbackState {...props} />;
}

export function FeedbackGroup({ children }: { children: ReactNode }) {
  return <div className="ui-stack">{children}</div>;
}
