import { ThemeControl } from "./theme-control";

const plannedFeatures = [
  "Data Pipeline Studio",
  "Training dashboard",
  "Model registry",
  "Project templates",
  "Plugins"
];

export function FoundationScreen() {
  return (
    <main className="foundation-shell">
      <section className="foundation-panel" aria-labelledby="foundation-title">
        <p className="eyebrow">ArcLM</p>
        <div className="foundation-heading">
          <div>
            <h1 id="foundation-title">Web Interface Foundation</h1>
            <p className="summary">
              A separate frontend workspace for the local ArcLM Web Experience.
            </p>
          </div>
          <span className="status-pill">Build ready</span>
        </div>

        <div className="foundation-grid">
          <section className="foundation-section" aria-labelledby="status-heading">
            <h2 id="status-heading">Frontend build status</h2>
            <p>
              Next.js, React, strict TypeScript, Tailwind CSS, ESLint, and unit
              tests are wired for Feature 1.
            </p>
          </section>

          <section className="foundation-section" aria-labelledby="theme-heading">
            <h2 id="theme-heading">Theme foundation</h2>
            <p>
              Light, dark, and system themes use reusable CSS tokens for later
              interface features.
            </p>
            <ThemeControl />
          </section>
        </div>

        <section className="planned-note" aria-labelledby="planned-heading">
          <h2 id="planned-heading">Dashboard features are planned</h2>
          <p>
            This page does not show fake datasets, training runs, model metrics,
            GPU values, charts, or backend connection status.
          </p>
          <ul>
            {plannedFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
