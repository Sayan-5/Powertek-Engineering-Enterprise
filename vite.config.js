
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],

  
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
