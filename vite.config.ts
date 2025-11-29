import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { version } from './package.json'; // Import the version from package.json

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192x192.png', 'icons/icon-512x512.png'], // Include icons
      manifest: {
        name: 'VinMapInfo',
        short_name: 'VinMapInfo',
        description: 'Explore vineyards and wine regions with VinMapInfo.',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icons/192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 40 * 1024 * 1024, // Set limit to accomodate large data files
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(version), // Inject the app version
    __BUILD_DATE__: JSON.stringify(new Date().toLocaleString()), // Inject the build timestamp in local time
  },
})