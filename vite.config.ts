import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        name: '学級名簿メーカー',
        short_name: '学級名簿',
        description: '先生の名簿づくりや提出物チェック表作成を支援する無料アプリ',
        theme_color: '#0f766e',
        background_color: '#eef3f5',
        display: 'standalone',
        start_url: './',
        lang: 'ja',
        orientation: 'landscape-primary',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 5000000
      }
    })
  ],
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
