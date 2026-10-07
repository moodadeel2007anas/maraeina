import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        name: 'مراعينا',
        short_name: 'مراعينا',
        description: 'تطبيق سوبر ماركتنا للطلبات والتوصيل',

        theme_color: '#168a45',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',

        icons: [
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})