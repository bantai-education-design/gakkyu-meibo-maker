import { useEffect, useMemo, useRef, useState } from "react";
import { ControlPanel } from "./components/ControlPanel";
import type { CsvImportStatus } from "./components/CsvImportPanel";
import { PreviewArea } from "./components/PreviewArea";
import { sampleStudents } from "./data/sampleStudents";
import type { RosterSettings, Student, TemplateType } from "./types";
import { sortStudents } from "./utils/sortStudents";
import {
  deleteRosterProject,
  hasSavedRosterProject,
  loadRosterProject,
  saveRosterProject
} from "./utils/storage";
import { exportProjectAsJson, importProjectFromJsonFile } from "./utils/fileStorage";
import { applyTemplate } from "./utils/templates";
import {
  moveStudentInCustomOrder,
  normalizeCustomOrder,
  orderStudentsByCustomOrder
} from "./utils/customOrder";
import { APP_VERSION } from "./version";

const initialSettings: RosterSettings = {
  templateType: "submission",
  title: "提出物チェック表",
  teacherName: "担任　山田",
  showTeacherName: true,
  sortMode: "number",
  customOrder: sampleStudents.map((student) => student.id),
  visibleColumns: {
    gender: false,
    birthday: false,
    note: true,
    group: false
  },
  layout: {
    columns: 1,
    checkColumnCount: 5,
    showKana: true,
    fontMode: "gothic",
    rowGap: 10,
    marginMm: 12,
    paperSize: "A4",
    orientation: "portrait",
    splitGenderColumns: true,
    numberColumnWidth: 28,
    nameColumnWidth: 98,
    checkColumnMinWidth: 20,
    nameFontSize: 16.25,
    nameFontSizeNoKana: 18.5
  }
};

function normalizeSettings(settings: RosterSettings): RosterSettings {
  return {
    ...initialSettings,
    ...settings,
    templateType: settings.templateType ?? initialSettings.templateType,
    customOrder: settings.customOrder ?? initialSettings.customOrder,
    visibleColumns: settings.visibleColumns ?? initialSettings.visibleColumns,
    layout: {
      ...initialSettings.layout,
      ...settings.layout
    }
  };
}

function loadInitialState() {
  const saved = loadRosterProject();
  if (saved) {
    return {
      students: saved.students,
      settings: {
        ...normalizeSettings(saved.settings),
        customOrder: normalizeCustomOrder(
          saved.students,
          saved.settings.customOrder ?? saved.customOrder
        )
      },
      message: "保存データを読み込みました。"
    };
  }

  return {
    students: sampleStudents,
    settings: initialSettings,
    message: "サンプル名簿を表示しています。"
  };
}

export default function App() {
  const initialState = useMemo(() => loadInitialState(), []);
  const [students, setStudents] = useState<Student[]>(initialState.students);
  const [settings, setSettings] = useState<RosterSettings>(initialState.settings);
  const [storageMessage, setStorageMessage] = useState(initialState.message);
  const [hasSavedData, setHasSavedData] = useState(() => hasSavedRosterProject());
  const [csvStatus, setCsvStatus] = useState<CsvImportStatus>({
    kind: "idle",
    message: initialState.message
  });
  const skipFirstAutoSave = useRef(true);

  useEffect(() => {
    if (skipFirstAutoSave.current) {
      skipFirstAutoSave.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      saveRosterProject(students, settings);
      setHasSavedData(true);
      setStorageMessage("自動保存しました。");
    }, 400);

    return () => window.clearTimeout(timer);
  }, [students, settings]);

  const sortedStudents = useMemo(
    () => sortStudents(students, settings.sortMode, settings.customOrder),
    [students, settings.sortMode, settings.customOrder]
  );

  const listedStudents = useMemo(
    () =>
      settings.sortMode === "custom"
        ? orderStudentsByCustomOrder(students, settings.customOrder)
        : students,
    [students, settings.sortMode, settings.customOrder]
  );

  const toggleStudent = (id: string) => {
    setStudents((current) =>
      current.map((student) =>
        student.id === id ? { ...student, visible: !student.visible } : student
      )
    );
  };

  const updateStudentGroup = (id: string, group: string) => {
    setStudents((current) =>
      current.map((student) => (student.id === id ? { ...student, group } : student))
    );
  };

  const moveStudent = (id: string, direction: "up" | "down") => {
    setSettings((current) => ({
      ...current,
      sortMode: "custom",
      customOrder: moveStudentInCustomOrder(students, current.customOrder, id, direction)
    }));
  };

  const importStudents = (nextStudents: Student[], message: string) => {
    setStudents(nextStudents);
    setSettings((current) => ({
      ...current,
      customOrder: nextStudents.map((student) => student.id)
    }));
    setCsvStatus({ kind: "success", message });
  };

  const resetSampleStudents = () => {
    setStudents(sampleStudents);
    setSettings(initialSettings);
    setCsvStatus({ kind: "idle", message: "サンプル名簿に戻しました。" });
    setStorageMessage("サンプル名簿に戻しました。");
  };

  const saveCurrentProject = () => {
    saveRosterProject(students, settings);
    setHasSavedData(true);
    setStorageMessage("保存しました。");
  };

  const loadSavedProject = () => {
    const saved = loadRosterProject();
    if (!saved) {
      setStorageMessage("保存データが見つかりません。");
      return;
    }

    setStudents(saved.students);
    setSettings({
      ...normalizeSettings(saved.settings),
      customOrder: normalizeCustomOrder(saved.students, saved.settings.customOrder ?? saved.customOrder)
    });
    setCsvStatus({ kind: "success", message: "保存データを読み込みました。" });
    setStorageMessage("保存データを読み込みました。");
  };

  const deleteSavedProject = () => {
    deleteRosterProject();
    setHasSavedData(false);
    setStorageMessage("保存データを削除しました。");
  };

  const exportJsonProject = () => {
    exportProjectAsJson(students, settings);
    setStorageMessage("JSONファイルとして保存しました。");
  };

  const importJsonProject = async (file: File) => {
    try {
      const project = await importProjectFromJsonFile(file);
      setStudents(project.students);
      setSettings({
        ...normalizeSettings(project.settings),
        customOrder: normalizeCustomOrder(
          project.students,
          project.settings.customOrder ?? project.customOrder
        )
      });
      setCsvStatus({ kind: "success", message: "JSONファイルを読み込みました。" });
      setStorageMessage("JSONファイルを読み込みました。");
    } catch (error) {
      const message = error instanceof Error ? error.message : "JSONファイルの読み込みに失敗しました。";
      setStorageMessage(message);
    }
  };

  const applyRosterTemplate = (templateType: TemplateType) => {
    setSettings((current) => applyTemplate(current, templateType));
    setStorageMessage("用途テンプレートを反映しました。");
  };

  return (
    <div className="app-shell">
      <ControlPanel
        settings={settings}
        listedStudents={listedStudents}
        version={APP_VERSION}
        csvStatus={csvStatus}
        storageMessage={storageMessage}
        hasSavedData={hasSavedData}
        onCsvImport={importStudents}
        onCsvError={(message) => setCsvStatus({ kind: "error", message })}
        onResetSample={resetSampleStudents}
        onSaveProject={saveCurrentProject}
        onLoadProject={loadSavedProject}
        onDeleteProject={deleteSavedProject}
        onExportJson={exportJsonProject}
        onImportJson={importJsonProject}
        onApplyTemplate={applyRosterTemplate}
        onSettingsChange={setSettings}
        onToggleStudent={toggleStudent}
        onMoveStudent={moveStudent}
        onGroupChange={updateStudentGroup}
        onPrint={() => window.print()}
      />
      <PreviewArea students={sortedStudents} settings={settings} />
    </div>
  );
}
