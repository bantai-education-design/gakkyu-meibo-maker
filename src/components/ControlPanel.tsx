import type { RosterSettings, Student, TemplateType } from "../types";
import { CsvImportPanel, type CsvImportStatus } from "./CsvImportPanel";
import { StoragePanel } from "./StoragePanel";
import { StudentVisibilityList } from "./StudentVisibilityList";
import { TemplatePanel } from "./TemplatePanel";

interface ControlPanelProps {
  settings: RosterSettings;
  students: Student[];
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
  onPrint: () => void;
}

export function ControlPanel({
  settings,
  students,
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
  onPrint
}: ControlPanelProps) {
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
      <div className="app-title">
        <span className="app-mark">名</span>
        <div>
          <h1>学級名簿メーカー</h1>
          <p>画面で整えて、そのまま印刷</p>
        </div>
        <span className="version-badge">v{version}</span>
      </div>

      <button className="print-button" type="button" onClick={onPrint}>
        印刷する
      </button>

      <div className="print-guidance">
        きれいに印刷するには、印刷画面で「ヘッダーとフッター」をOFF、「背景のグラフィック」をONにしてください。余白は「なし」または「最小」がおすすめです。
      </div>

      <CsvImportPanel
        status={csvStatus}
        onImport={onCsvImport}
        onError={onCsvError}
      />

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

      <TemplatePanel
        selectedTemplate={settings.templateType}
        onApplyTemplate={onApplyTemplate}
      />

      <section className="panel-section">
        <h2>基本</h2>
        <label className="field">
          <span>表のタイトル</span>
          <input value={settings.title} onChange={(event) => update("title", event.target.value)} />
        </label>

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
      </section>

      <section className="panel-section">
        <h2>レイアウト</h2>
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
            checked={settings.layout.showKana}
            onChange={(event) => updateLayout("showKana", event.target.checked)}
          />
          <span>ふりがなを表示する</span>
        </label>

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
      </section>

      <section className="panel-section">
        <h2>用紙</h2>
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
      </section>

      <section className="panel-section">
        <h2>表示する児童</h2>
        <StudentVisibilityList students={students} onToggle={onToggleStudent} />
      </section>
    </aside>
  );
}
