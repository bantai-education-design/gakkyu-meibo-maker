import type { RosterSettings, Student, TemplateType } from "../types";
import { AppLogo } from "./AppLogo";
import { CsvImportPanel, type CsvImportStatus } from "./CsvImportPanel";
import { ManualStudentPanel } from "./ManualStudentPanel";
import { PanelSection } from "./PanelSection";
import { StoragePanel } from "./StoragePanel";
import { StudentVisibilityList } from "./StudentVisibilityList";
import { TemplatePanel } from "./TemplatePanel";

interface ControlPanelProps {
  settings: RosterSettings;
  listedStudents: Student[];
  version: string;
  csvStatus: CsvImportStatus;
  storageMessage: string;
  hasSavedData: boolean;
  onCsvImport: (students: Student[], message: string) => void;
  onCsvError: (message: string) => void;
  onResetSample: () => void;
  onSaveProject: () => void;
  onLoadProject: () => void;
  onDeleteProject: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onApplyTemplate: (templateType: TemplateType) => void;
  onSettingsChange: (settings: RosterSettings) => void;
  onToggleStudent: (id: string) => void;
  onMoveStudent: (id: string, direction: "up" | "down") => void;
  onGroupChange: (id: string, group: string) => void;
  onAddStudent: (student: Omit<Student, "id" | "visible">) => void;
  onUpdateStudent: (id: string, patch: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
  onPrint: () => void;
}

export function ControlPanel({
  settings,
  listedStudents,
  version,
  csvStatus,
  storageMessage,
  hasSavedData,
  onCsvImport,
  onCsvError,
  onResetSample,
  onSaveProject,
  onLoadProject,
  onDeleteProject,
  onExportJson,
  onImportJson,
  onApplyTemplate,
  onSettingsChange,
  onToggleStudent,
  onMoveStudent,
  onGroupChange,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onPrint
}: ControlPanelProps) {
  const isFirstGradeClass = /(?:1|１|一)\s*(?:年|学年)/.test(settings.classLabel);
  const update = <K extends keyof RosterSettings>(key: K, value: RosterSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const updateLayout = <K extends keyof RosterSettings["layout"]>(
    key: K,
    value: RosterSettings["layout"][K]
  ) => {
    onSettingsChange({ ...settings, layout: { ...settings.layout, [key]: value } });
  };

  return (
    <aside className="control-panel">
      <div className="compact-top">
        <div className="app-title">
          <AppLogo />
          <span className="version-badge">v{version}</span>
        </div>
        <button className="print-button compact-print-button" type="button" onClick={onPrint}>
          印刷する
        </button>
      </div>

      <PanelSection title="データ" defaultOpen>
        <details className="inner-details">
          <summary>CSVから読み込む</summary>
          <CsvImportPanel
            status={csvStatus}
            onImport={onCsvImport}
            onError={onCsvError}
          />
        </details>
        <ManualStudentPanel
          students={listedStudents}
          onAddStudent={onAddStudent}
          onUpdateStudent={onUpdateStudent}
          onDeleteStudent={onDeleteStudent}
        />
        <details className="inner-details">
          <summary>保存・読み込み</summary>
          <StoragePanel
            message={storageMessage}
            hasSavedData={hasSavedData}
            onSave={onSaveProject}
            onLoad={onLoadProject}
            onResetSample={onResetSample}
            onDelete={onDeleteProject}
            onExportJson={onExportJson}
            onImportJson={onImportJson}
          />
        </details>
      </PanelSection>

      <PanelSection title="基本" defaultOpen>
        <TemplatePanel
          selectedTemplate={settings.templateType}
          onApplyTemplate={onApplyTemplate}
        />
        <label className="field">
          <span>表のタイトル</span>
          <input value={settings.title} onChange={(event) => update("title", event.target.value)} />
        </label>

        <label className="field">
          <span>所属</span>
          <input
            value={settings.classLabel}
            onChange={(event) => update("classLabel", event.target.value)}
            placeholder="例：1年1組"
          />
        </label>

        <label className="field">
          <span>氏名表記</span>
          <select
            value={settings.nameDisplayMode}
            onChange={(event) => {
              const nameDisplayMode = event.target.value as RosterSettings["nameDisplayMode"];
              onSettingsChange({
                ...settings,
                nameDisplayMode,
                layout: {
                  ...settings.layout,
                  showKana: nameDisplayMode === "kanjiWithKana"
                }
              });
            }}
          >
            <option value="kanjiWithKana">漢字＋ふりがな</option>
            <option value="kanaOnly">ひらがな</option>
            <option value="kanjiOnly">漢字のみ</option>
          </select>
        </label>

        {isFirstGradeClass ? (
          <p className="hint-text">1年生用の名簿では、氏名表記を「ひらがな」にすると読みやすくなります。</p>
        ) : null}

        <label className="field">
          <span>担任名</span>
          <input
            value={settings.teacherName}
            onChange={(event) => update("teacherName", event.target.value)}
            placeholder="例：担任　山田"
          />
        </label>

        <label className="check-row">
          <input
            type="checkbox"
            checked={settings.showTeacherName}
            onChange={(event) => update("showTeacherName", event.target.checked)}
          />
          <span>上に担任名を入れる</span>
        </label>
      </PanelSection>

      <PanelSection title="並べ替え・表示">
        <label className="field">
          <span>並び順</span>
          <select
            value={settings.sortMode}
            onChange={(event) => update("sortMode", event.target.value as RosterSettings["sortMode"])}
          >
            <option value="number">出席番号順</option>
            <option value="gender">男女別順</option>
            <option value="kana">五十音順</option>
            <option value="birthday">生年月日順</option>
            <option value="group">班・グループ順</option>
            <option value="custom">任意順</option>
          </select>
        </label>

        <div className="column-toggle-grid">
          <label className="check-row">
            <input
              type="checkbox"
              checked={settings.visibleColumns.gender}
              onChange={(event) =>
                onSettingsChange({
                  ...settings,
                  visibleColumns: { ...settings.visibleColumns, gender: event.target.checked }
                })
              }
            />
            <span>性別を表示</span>
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={settings.visibleColumns.birthday}
              onChange={(event) =>
                onSettingsChange({
                  ...settings,
                  visibleColumns: { ...settings.visibleColumns, birthday: event.target.checked }
                })
              }
            />
            <span>生年月日を表示</span>
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={settings.visibleColumns.group}
              onChange={(event) =>
                onSettingsChange({
                  ...settings,
                  visibleColumns: { ...settings.visibleColumns, group: event.target.checked }
                })
              }
            />
            <span>班・グループを表示</span>
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={settings.visibleColumns.note}
              onChange={(event) =>
                onSettingsChange({
                  ...settings,
                  visibleColumns: { ...settings.visibleColumns, note: event.target.checked }
                })
              }
            />
            <span>備考を表示</span>
          </label>
        </div>
        <StudentVisibilityList
          students={listedStudents}
          isCustomOrder={settings.sortMode === "custom"}
          onToggle={onToggleStudent}
          onMove={onMoveStudent}
          onGroupChange={onGroupChange}
        />
      </PanelSection>

      <PanelSection title="レイアウト">
        <div className="segmented">
          <button
            type="button"
            className={settings.layout.columns === 1 ? "active" : ""}
            onClick={() => updateLayout("columns", 1)}
          >
            1段
          </button>
          <button
            type="button"
            className={settings.layout.columns === 2 ? "active" : ""}
            onClick={() => updateLayout("columns", 2)}
          >
            2段
          </button>
        </div>

        <label className="check-row">
          <input
            type="checkbox"
            checked={settings.layout.splitGenderColumns}
            disabled={settings.sortMode !== "gender" || settings.layout.columns !== 2}
            onChange={(event) => updateLayout("splitGenderColumns", event.target.checked)}
          />
          <span>男女別順のとき左右に分ける</span>
        </label>

        <label className="range-field">
          <span>チェック欄 {settings.layout.checkColumnCount}列</span>
          <input
            type="range"
            min="0"
            max="15"
            value={settings.layout.checkColumnCount}
            onChange={(event) => updateLayout("checkColumnCount", Number(event.target.value))}
          />
        </label>

        <label className="check-row">
          <input
            type="checkbox"
            checked={settings.nameDisplayMode === "kanjiWithKana"}
            onChange={(event) =>
              onSettingsChange({
                ...settings,
                nameDisplayMode: event.target.checked ? "kanjiWithKana" : "kanjiOnly",
                layout: { ...settings.layout, showKana: event.target.checked }
              })
            }
          />
          <span>ふりがなを表示する</span>
        </label>

        <label className="range-field">
          <span>行の高さ {settings.layout.rowGap}mm</span>
          <input
            type="range"
            min="7"
            max="16"
            value={settings.layout.rowGap}
            onChange={(event) => updateLayout("rowGap", Number(event.target.value))}
          />
        </label>

        <label className="range-field">
          <span>余白 {settings.layout.marginMm}mm</span>
          <input
            type="range"
            min="6"
            max="24"
            value={settings.layout.marginMm}
            onChange={(event) => updateLayout("marginMm", Number(event.target.value))}
          />
        </label>
      </PanelSection>

      <PanelSection title="用紙・文字">
        <div className="inline-grid">
          <label className="field">
            <span>サイズ</span>
            <select
              value={settings.layout.paperSize}
              onChange={(event) => updateLayout("paperSize", event.target.value as RosterSettings["layout"]["paperSize"])}
            >
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="B4">B4</option>
            </select>
          </label>
          <label className="field">
            <span>向き</span>
            <select
              value={settings.layout.orientation}
              onChange={(event) => updateLayout("orientation", event.target.value as RosterSettings["layout"]["orientation"])}
            >
              <option value="portrait">縦</option>
              <option value="landscape">横</option>
            </select>
          </label>
        </div>
        <label className="field">
          <span>文字</span>
          <select
            value={settings.layout.fontMode}
            onChange={(event) => updateLayout("fontMode", event.target.value as RosterSettings["layout"]["fontMode"])}
          >
            <option value="gothic">ゴシック体</option>
            <option value="mincho">明朝体</option>
          </select>
        </label>
      </PanelSection>

      <PanelSection title="印刷">
        <button className="print-button" type="button" onClick={onPrint}>
          印刷する
        </button>
        <details className="print-guidance">
          <summary>印刷時の注意</summary>
          <p>ヘッダーとフッターをOFF、背景のグラフィックをON、余白はなしまたは最小がおすすめです。</p>
        </details>
      </PanelSection>
    </aside>
  );
}
