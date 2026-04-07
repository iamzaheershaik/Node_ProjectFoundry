import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/rwskill-assets': {
        target: 'https://www.rwskill.edu.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rwskill-assets/, ''),
      },
      '/student-assets': {
        target: 'https://student.rwskill.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/student-assets/, ''),
      },
    },
  },
})
