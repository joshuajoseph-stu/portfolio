import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    watch: {
      usePolling: true, // Enables file polling
      interval: 1000,    // Optional: polling interval in milliseconds
    },
  },
  plugins: [react()],
})
