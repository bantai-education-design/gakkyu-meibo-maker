import { useEffect, useState } from "react";
import { onPwaUpdate } from "../pwa";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [updateAction, setUpdateAction] = useState<(() => void) | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    onPwaUpdate((action) => {
      setUpdateAction(() => action);
    });

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const isElectron = navigator.userAgent.includes('Electron');
  if (isElectron) return null;

  return (
    <div className="pwa-status-container">
      {updateAction && (
        <div className="pwa-alert update-alert">
          <p>新しいバージョンがあります</p>
          <button type="button" onClick={updateAction}>
            更新する
          </button>
        </div>
      )}

      {deferredPrompt && (
        <div className="pwa-alert install-alert">
          <p>
            <strong>このアプリをパソコンに追加</strong>
            <br />
            <small>インストールすると、デスクトップやスタートメニューから起動できます。</small>
          </p>
          <button type="button" onClick={handleInstallClick}>
            アプリとして追加
          </button>
        </div>
      )}

      {isOffline && (
        <div className="pwa-alert offline-alert">
          <p>
            <strong>オフラインで使用中</strong>
            <br />
            <small>入力内容はこの端末内に保存されます。</small>
          </p>
        </div>
      )}

      <div className="pwa-privacy-notice">
        <p><strong>【データ保存について】</strong></p>
        <p>
          このアプリは入力した名簿データを外部サーバーへ送信しません。データは使用中の端末内に保存されます。<br />
          ブラウザのデータ削除やアプリの削除を行うと、端末内の保存内容が消える場合があります。必要な名簿はファイルとして保存してください。<br />
          共有パソコンで使用する場合は、使用後に保存データを削除してください。<br />
          学校や自治体の個人情報取り扱いルールに従ってご利用ください。
        </p>
      </div>
    </div>
  );
}
