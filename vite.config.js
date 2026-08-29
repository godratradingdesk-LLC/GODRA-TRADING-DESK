import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    // The GTD logo is small enough that inlining it as a data URI costs a
    // request less than it costs bytes. Everything larger stays a real file.
    assetsInlineLimit: 4096,
  },
})
