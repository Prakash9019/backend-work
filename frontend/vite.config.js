// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // Ensures all assets load relative to the HTML file
  plugins: [react()],
  build: {
    outDir: 'build' // or whatever your build output folder is
  }
});
