import type { TemplateType } from "../types";
import { rosterTemplates } from "../utils/templates";

interface TemplatePanelProps {
  selectedTemplate: TemplateType;
  onApplyTemplate: (templateType: TemplateType) => void;
}

export function TemplatePanel({ selectedTemplate, onApplyTemplate }: TemplatePanelProps) {
  const current = rosterTemplates.find((template) => template.type === selectedTemplate);

  return (
    <section className="panel-section">
      <h2>用途テンプレート</h2>
      <label className="field">
        <span>用途を選ぶ</span>
        <select
          value={selectedTemplate}
          onChange={(event) => onApplyTemplate(event.target.value as TemplateType)}
        >
          {rosterTemplates.map((template) => (
            <option value={template.type} key={template.type}>
              {template.name}
            </option>
          ))}
        </select>
      </label>
      {current ? <p className="template-description">{current.description}</p> : null}
    </section>
  );
}
