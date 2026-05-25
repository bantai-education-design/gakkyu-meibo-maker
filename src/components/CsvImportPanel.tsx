import { useState, type ChangeEvent } from "react";
import type { Student } from "../types";
import {
  decodeCsvBuffer,
  hasPossibleMojibake,
  parseStudentCsv,
  type CsvEncoding
} from "../utils/parseCsv";

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
  const [encoding, setEncoding] = useState<CsvEncoding>("utf-8");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      onError("CSVファイルを選んでください。");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const text = decodeCsvBuffer(buffer, encoding);
      const result = parseStudentCsv(text);
      const mojibakeWarning = "文字化けしている可能性があります。文字コードを Shift-JIS に変更してもう一度読み込んでください。";

      if (!result.ok) {
        onError(hasPossibleMojibake(text) ? mojibakeWarning : result.message);
        return;
      }

      const message = `${result.students.length}人の名簿を読み込みました。`;
      onImport(result.students, hasPossibleMojibake(text) ? `${message} ${mojibakeWarning}` : message);
    } catch {
      onError("CSVを読み込めませんでした。ファイルと文字コードを確認してください。");
    }
  };

  return (
    <section className="panel-section">
      <h2>CSV読み込み</h2>
      <label className="field">
        <span>文字コード</span>
        <select value={encoding} onChange={(event) => setEncoding(event.target.value as CsvEncoding)}>
          <option value="utf-8">UTF-8</option>
          <option value="shift_jis">Shift-JIS</option>
        </select>
      </label>
      <label className="file-field">
        <span>名簿CSVを選ぶ</span>
        <input type="file" accept=".csv,text/csv" onChange={handleFileChange} />
      </label>
      <p className="csv-help">
        まずはUTF-8を選びます。文字化けする場合は、文字コードをShift-JISに変更して同じCSVをもう一度選んでください。
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
