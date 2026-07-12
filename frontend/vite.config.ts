import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          maps: ['leaflet', 'leaflet.markercluster', 'leaflet.heat'],
          charts: ['recharts'],
          markdown: ['react-markdown'],
        },
      },
    },
  },
});
