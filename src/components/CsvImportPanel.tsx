import { useState, type ChangeEvent } from "react";
import type { Student } from "../types";
import { CsvColumnMappingPanel } from "./CsvColumnMappingPanel";
import { convertRowsToStudents, inferColumnMapping, mappingWarnings, type CsvColumnMapping } from "../utils/csvColumnMapping";
import {
  decodeCsvBuffer,
  hasPossibleMojibake,
  parseCsvTable,
  type CsvEncoding,
  type CsvTable
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
  const [pendingTable, setPendingTable] = useState<CsvTable | null>(null);
  const [mapping, setMapping] = useState<CsvColumnMapping>({});
  const [mojibakeDetected, setMojibakeDetected] = useState(false);

  const mojibakeWarning = "文字化けしている可能性があります。文字コードを Shift-JIS に変更してもう一度読み込んでください。";

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
      const result = parseCsvTable(text);

      if (!result.ok) {
        onError(hasPossibleMojibake(text) ? mojibakeWarning : result.message);
        return;
      }

      setPendingTable(result.table);
      setMapping(inferColumnMapping(result.table.headers));
      setMojibakeDetected(hasPossibleMojibake(text));
      onError("CSVの列対応を確認してください。問題なければ「この対応で読み込む」を押してください。");
    } catch {
      onError("CSVを読み込めませんでした。ファイルと文字コードを確認してください。");
    }
  };

  const confirmImport = () => {
    if (!pendingTable) return;
    const result = convertRowsToStudents(pendingTable.headers, pendingTable.rows, mapping);

    if (!result.ok) {
      onError(result.message);
      return;
    }

    const warnings = mappingWarnings(mapping);
    const messageParts = [`${result.students.length}人の名簿を読み込みました。`, ...warnings];
    if (mojibakeDetected) messageParts.push(mojibakeWarning);

    onImport(result.students, messageParts.join(" "));
    setPendingTable(null);
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
        CSVを選ぶと、先に列の対応を確認できます。文字化けする場合は、文字コードをShift-JISに変更して同じCSVをもう一度選んでください。
      </p>
      {status.message ? (
        <div className={`csv-status ${status.kind}`}>{status.message}</div>
      ) : null}
      {pendingTable ? (
        <CsvColumnMappingPanel
          table={pendingTable}
          mapping={mapping}
          onMappingChange={setMapping}
          onConfirm={confirmImport}
          onCancel={() => setPendingTable(null)}
        />
      ) : null}
      <button className="secondary-button" type="button" onClick={onResetSample}>
        サンプル名簿に戻す
      </button>
    </section>
  );
}
