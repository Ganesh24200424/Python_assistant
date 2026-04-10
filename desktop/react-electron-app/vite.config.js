import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000,
    strictPort: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'orb': path.resolve(__dirname, '../../Frontend/orb.js')
    }
  },
  define: {
    global: 'globalThis'
  }
})

