import type { RosterSettings, Student } from "../types";
import { createPreviewStyle, getPageRule } from "../utils/layoutUtils";
import { AppLogo } from "./AppLogo";
import { RosterTable } from "./RosterTable";

interface PreviewAreaProps {
  students: Student[];
  settings: RosterSettings;
}

function createDisplayTitle(settings: RosterSettings): string {
  const classLabel = settings.classLabel.trim();
  return classLabel ? `${classLabel} ${settings.title}` : settings.title;
}

export function PreviewArea({ students, settings }: PreviewAreaProps) {
  const displayTitle = createDisplayTitle(settings);

  return (
    <main className="preview-wrap">
      <style>{getPageRule(settings.layout)}</style>
      <div className="preview-toolbar">
        <span>{settings.layout.paperSize}・{settings.layout.orientation === "portrait" ? "縦" : "横"}</span>
        <span>{students.length}人を表示</span>
      </div>
      <section className="paper preview-paper" style={createPreviewStyle(settings.layout)}>
        <header className="paper-header">
          <div>
            <h2>{displayTitle}</h2>
            {settings.showTeacherName ? <p>{settings.teacherName}</p> : null}
          </div>
          <span className="paper-date">　年　月　日</span>
        </header>
        <RosterTable students={students} settings={settings} />
        <div className="paper-brand">
          <AppLogo variant="paper" showTagline={false} />
        </div>
      </section>
    </main>
  );
}
