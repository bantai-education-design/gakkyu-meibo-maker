import { useMemo, useState } from "react";
import { ControlPanel } from "./components/ControlPanel";
import type { CsvImportStatus } from "./components/CsvImportPanel";
import { PreviewArea } from "./components/PreviewArea";
import { sampleStudents } from "./data/sampleStudents";
import type { RosterSettings, Student } from "./types";
import { sortStudents } from "./utils/sortStudents";
import { APP_VERSION } from "./version";

const initialSettings: RosterSettings = {
  title: "提出物チェック表",
  teacherName: "担任　山田",
  showTeacherName: true,
  sortMode: "number",
  layout: {
    columns: 1,
    checkColumnCount: 5,
    showKana: true,
    fontMode: "gothic",
    rowGap: 10,
    marginMm: 12,
    paperSize: "A4",
    orientation: "portrait",
    splitGenderColumns: true
  }
};

export default function App() {
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [settings, setSettings] = useState<RosterSettings>(initialSettings);
  const [csvStatus, setCsvStatus] = useState<CsvImportStatus>({
    kind: "idle",
    message: "サンプル名簿を表示しています。"
  });

  const sortedStudents = useMemo(
    () => sortStudents(students, settings.sortMode),
    [students, settings.sortMode]
  );

  const toggleStudent = (id: string) => {
    setStudents((current) =>
      current.map((student) =>
        student.id === id ? { ...student, visible: !student.visible } : student
      )
    );
  };

  const importStudents = (nextStudents: Student[], message: string) => {
    setStudents(nextStudents);
    setCsvStatus({ kind: "success", message });
  };

  const resetSampleStudents = () => {
    setStudents(sampleStudents);
    setCsvStatus({ kind: "idle", message: "サンプル名簿に戻しました。" });
  };

  return (
    <div className="app-shell">
      <ControlPanel
        settings={settings}
        students={students}
        version={APP_VERSION}
        csvStatus={csvStatus}
        onCsvImport={importStudents}
        onCsvError={(message) => setCsvStatus({ kind: "error", message })}
        onResetSample={resetSampleStudents}
        onSettingsChange={setSettings}
        onToggleStudent={toggleStudent}
        onPrint={() => window.print()}
      />
      <PreviewArea students={sortedStudents} settings={settings} />
    </div>
  );
}
