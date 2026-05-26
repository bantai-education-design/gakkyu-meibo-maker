import type { ChangeEvent } from "react";

interface StoragePanelProps {
  message: string;
  hasSavedData: boolean;
  onSave: () => void;
  onLoad: () => void;
  onResetSample: () => void;
  onDelete: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
}

export function StoragePanel({
  message,
  hasSavedData,
  onSave,
  onLoad,
  onResetSample,
  onDelete,
  onExportJson,
  onImportJson
}: StoragePanelProps) {
  const handleJsonFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) onImportJson(file);
  };

  return (
    <div className="compact-panel">
      <p className="privacy-note">
        実名の名簿データを扱う場合は、保存ファイルの取り扱いにご注意ください。共有PCでは使用後に保存データを削除してください。
      </p>
      <div className="storage-actions">
        <button className="secondary-button" type="button" onClick={onSave}>
          現在の状態を保存
        </button>
        <button className="secondary-button" type="button" onClick={onLoad} disabled={!hasSavedData}>
          保存データを読み込み
        </button>
        <button className="secondary-button" type="button" onClick={onExportJson}>
          JSONファイルとして保存
        </button>
        <label className="json-import-button">
          JSONファイルを読み込む
          <input type="file" accept=".json,application/json" onChange={handleJsonFileChange} />
        </label>
        <button className="secondary-button" type="button" onClick={onResetSample}>
          サンプル名簿に戻す
        </button>
        <button className="danger-button" type="button" onClick={onDelete} disabled={!hasSavedData}>
          保存データを削除
        </button>
      </div>
      {message ? <div className="storage-message">{message}</div> : null}
    </div>
  );
}
