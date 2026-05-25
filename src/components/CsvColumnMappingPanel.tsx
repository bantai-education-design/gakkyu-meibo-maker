import type { CsvTable } from "../utils/parseCsv";
import {
  csvFieldOptions,
  mappingWarnings,
  validateColumnMapping,
  type CsvColumnMapping,
  type CsvStudentField
} from "../utils/csvColumnMapping";

interface CsvColumnMappingPanelProps {
  table: CsvTable;
  mapping: CsvColumnMapping;
  onMappingChange: (mapping: CsvColumnMapping) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CsvColumnMappingPanel({
  table,
  mapping,
  onMappingChange,
  onConfirm,
  onCancel
}: CsvColumnMappingPanelProps) {
  const errors = validateColumnMapping(mapping);
  const warnings = mappingWarnings(mapping);
  const previewRows = table.rows.slice(0, 5);

  const updateField = (columnIndex: number, field: CsvStudentField) => {
    onMappingChange({ ...mapping, [columnIndex]: field });
  };

  return (
    <div className="mapping-panel">
      <div className="mapping-title-row">
        <h3>列の対応を確認</h3>
        <button className="small-button" type="button" onClick={onCancel}>
          閉じる
        </button>
      </div>

      <div className="mapping-list">
        {table.headers.map((header, index) => (
          <label className="mapping-row" key={`${header}-${index}`}>
            <span className="mapping-header">CSV列「{header || `列${index + 1}`}」</span>
            <select
              value={mapping[index] ?? "ignore"}
              onChange={(event) => updateField(index, event.target.value as CsvStudentField)}
            >
              {csvFieldOptions.map((option, optionIndex) => (
                <option value={option.value} key={`${option.value}-${option.label}-${optionIndex}`}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {warnings.map((warning) => (
        <p className="mapping-warning" key={warning}>{warning}</p>
      ))}
      {errors.map((error) => (
        <p className="mapping-error" key={error}>{error}</p>
      ))}

      <div className="mapping-preview">
        <table>
          <thead>
            <tr>
              {table.headers.map((header, index) => (
                <th key={`${header}-${index}`}>{header || `列${index + 1}`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {table.headers.map((_, columnIndex) => (
                  <td key={`${rowIndex}-${columnIndex}`}>{row[columnIndex] ?? ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="print-button mapping-confirm"
        type="button"
        onClick={onConfirm}
        disabled={errors.length > 0}
      >
        この対応で読み込む
      </button>
    </div>
  );
}
