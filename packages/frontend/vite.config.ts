import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // Important for Docker

    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend:3000', // Use service name in Docker
        changeOrigin: true,
      },
    },
  },
});