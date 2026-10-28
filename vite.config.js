
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],

  // Use the GitHub Pages path for production,
  // but the root path during local development.
  base: command === 'serve'
    ? '/'
    : '/Powertek-Engineering-Enterprise/',

  appType: 'mpa',

  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        portal: 'portal.html',
      },
    },
  },
}))
