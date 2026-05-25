interface StoragePanelProps {
  message: string;
  hasSavedData: boolean;
  onSave: () => void;
  onLoad: () => void;
  onResetSample: () => void;
  onDelete: () => void;
}

export function StoragePanel({
  message,
  hasSavedData,
  onSave,
  onLoad,
  onResetSample,
  onDelete
}: StoragePanelProps) {
  return (
    <section className="panel-section">
      <h2>保存</h2>
      <div className="storage-actions">
        <button className="secondary-button" type="button" onClick={onSave}>
          現在の状態を保存
        </button>
        <button className="secondary-button" type="button" onClick={onLoad} disabled={!hasSavedData}>
          保存データを読み込み
        </button>
        <button className="secondary-button" type="button" onClick={onResetSample}>
          サンプル名簿に戻す
        </button>
        <button className="danger-button" type="button" onClick={onDelete} disabled={!hasSavedData}>
          保存データを削除
        </button>
      </div>
      {message ? <div className="storage-message">{message}</div> : null}
    </section>
  );
}
