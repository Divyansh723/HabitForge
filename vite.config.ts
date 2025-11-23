import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { copyFileSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'copy-spa-files',
      closeBundle() {
        copyFileSync('index.html', 'dist/200.html')
        copyFileSync('public/_redirects', 'dist/_redirects')
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})