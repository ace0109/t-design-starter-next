import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { defineConfig, loadEnv } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'

const CWD = process.cwd()

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_BASE_URL, VITE_API_URL_PREFIX, VITE_API_URL } = loadEnv(mode, CWD)
  return {
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [vue(), vueJsx(), vueDevTools(), UnoCSS(), svgLoader()],
    build: {
      sourcemap: true,
    },
    server: {
      port: 3001,
      host: '0.0.0.0',
      proxy: {
        [VITE_API_URL_PREFIX]: {
          target: VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
  }
})
