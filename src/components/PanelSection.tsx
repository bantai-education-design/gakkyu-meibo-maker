import type { ReactNode } from "react";

interface PanelSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function PanelSection({ title, children, defaultOpen = false }: PanelSectionProps) {
  return (
    <details className="panel-section" open={defaultOpen}>
      <summary className="panel-section-summary">
        <span>{title}</span>
      </summary>
      <div className="panel-section-body">{children}</div>
    </details>
  );
}
