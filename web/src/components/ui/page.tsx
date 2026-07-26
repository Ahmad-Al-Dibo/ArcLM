import type { ReactNode } from "react";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <header className="ui-page-header">
      <div className="ui-row">
        <h1 className="ui-page-title">{title}</h1>
        {actions}
      </div>
      {description ? <p className="ui-section-description">{description}</p> : null}
    </header>
  );
}

export function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="ui-section-header">
      <h2 className="ui-section-title">{title}</h2>
      {description ? <p className="ui-section-description">{description}</p> : null}
    </div>
  );
}

export function Breadcrumb({ items }: { items: string[] }) {
  return (
    <nav className="ui-breadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={item}>
          {index > 0 ? " / " : null}
          {item}
        </span>
      ))}
    </nav>
  );
}

export function DescriptionBlock({ children }: { children: ReactNode }) {
  return <p className="ui-section-description">{children}</p>;
}

export function KeyValueList({ items }: { items: Array<{ label: string; value: ReactNode }> }) {
  return (
    <dl className="ui-key-value-list">
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt className="ui-key-value-key">{item.label}</dt>
          <dd className="ui-key-value-value">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Metric({ label, value, hint }: { label: string; value?: ReactNode; hint?: string }) {
  return (
    <div className="ui-metric">
      <span className="ui-metric-label">{label}</span>
      <span className="ui-metric-value">{value ?? "Not available"}</span>
      {hint ? <span className="ui-caption">{hint}</span> : null}
    </div>
  );
}
