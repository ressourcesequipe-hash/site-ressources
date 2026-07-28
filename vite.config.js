import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  ssr: {
    // react-helmet-async est publié en CommonJS : il doit être intégré au bundle
    // SSR plutôt qu'externalisé, sinon Node ne peut pas en lire les exports nommés.
    noExternal: ['react-helmet-async'],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      // Le découpage en chunks ne concerne que le bundle client : en build SSR,
      // react-router-dom est externalisé et ne peut donc pas être chunké.
      output: isSsrBuild
        ? {}
        : {
            manualChunks: {
              router: ['react-router-dom'],
              helmet: ['react-helmet-async'],
            },
          },
    },
  },
}))
