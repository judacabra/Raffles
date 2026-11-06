import { defineConfig, } from 'vite'

import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

import { EnvironmentEnum } from './src/enums/config.enums.ts'

export default defineConfig(({ mode }) => {
  const emitSourcemaps = mode === EnvironmentEnum.DEV

  return {
    build: {
      sourcemap: emitSourcemaps ? 'inline' : false,
      minify: !emitSourcemaps,
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, "..."),
      },
    },
    server: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT || '80'),
      strictPort: true,
      allowedHosts: ['.rifaspro.local'], 
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: false,
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT || '80'),
    },
  }
})
