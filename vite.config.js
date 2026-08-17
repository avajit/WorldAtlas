import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // All requests to /rc-api/* get forwarded to api.restcountries.com
      // This runs server-side so there is ZERO CORS issue
      '/rc-api': {
        target: 'https://api.restcountries.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/rc-api/, ''),
      },
    },
  },
})
