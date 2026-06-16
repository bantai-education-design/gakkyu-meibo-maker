/// <reference types="vite-plugin-pwa/client" />
import { registerSW } from 'virtual:pwa-register';

export type PwaUpdateCallback = (updateAction: () => void) => void;

let needRefreshCallback: PwaUpdateCallback | null = null;
let updateSWAction: ((reloadPage?: boolean) => Promise<void>) | undefined;

export function onPwaUpdate(callback: PwaUpdateCallback) {
  needRefreshCallback = callback;
}

export function registerPwa() {
  if (typeof window === 'undefined') return;
  // Electron環境ではService Workerを登録しない
  if (navigator.userAgent.includes('Electron')) {
    console.log('Skipping Service Worker registration in Electron.');
    return;
  }

  updateSWAction = registerSW({
    immediate: true,
    onNeedRefresh() {
      if (needRefreshCallback && updateSWAction) {
        needRefreshCallback(() => updateSWAction?.(true));
      }
    },
    onOfflineReady() {
      console.log('App is ready to work offline');
    },
  });
}
