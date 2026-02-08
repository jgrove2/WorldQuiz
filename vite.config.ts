import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Note: Vite dev server handles SPA routing automatically
  // For production, configure your hosting provider's redirects
})
