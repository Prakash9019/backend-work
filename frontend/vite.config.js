import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// vite.config.js

export default defineConfig({
  build: {
    outDir: 'build'  // Change this from "dist" to "build"
  }
});
