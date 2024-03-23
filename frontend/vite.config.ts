import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@pages': '/src/pages',
      '@store': '/src/redux',
      '@utils': '/src/utils',
      '@constants': 'src/constants',
      '@public': 'public',
      '@img': '/src/firebase',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000/',
        changeOrigin: true,
      },
      '/auto_tags': {
        target: 'http://127.0.0.1:8080/',
        changeOrigin: true,
        configure(proxy, options) {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Access-Control-Allow-Origin', '*')
          })
        },
      },
    },
  },
})
