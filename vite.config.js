import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: 'https://omarcillo44.github.io/FinaMente/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Si el código viene de una librería, lo metemos al paquete "vendor"
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
