import type { ChangeEvent } from "react";
import type { Student } from "../types";
import { parseStudentCsv } from "../utils/parseCsv";

export interface CsvImportStatus {
  kind: "idle" | "success" | "error";
  message: string;
}

interface CsvImportPanelProps {
  status: CsvImportStatus;
  onImport: (students: Student[], message: string) => void;
  onError: (message: string) => void;
  onResetSample: () => void;
}

export function CsvImportPanel({
  status,
  onImport,
  onError,
  onResetSample
}: CsvImportPanelProps) {
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      onError("CSVファイルを選んでください。");
      return;
    }

    try {
      const text = await file.text();
      const result = parseStudentCsv(text);

      if (!result.ok) {
        onError(result.message);
        return;
      }

      onImport(result.students, `${result.students.length}人の名簿を読み込みました。`);
    } catch {
      onError("CSVを読み込めませんでした。ファイルを確認してください。");
    }
  };

  return (
    <section className="panel-section">
      <h2>CSV読み込み</h2>
      <label className="file-field">
        <span>名簿CSVを選ぶ</span>
        <input type="file" accept=".csv,text/csv" onChange={handleFileChange} />
      </label>
      <p className="csv-help">
        UTF-8のCSVに対応しています。Shift-JIS対応は次の段階で追加しやすい形にしています。
      </p>
      {status.message ? (
        <div className={`csv-status ${status.kind}`}>{status.message}</div>
      ) : null}
      <button className="secondary-button" type="button" onClick={onResetSample}>
        サンプル名簿に戻す
      </button>
    </section>
  );
}
