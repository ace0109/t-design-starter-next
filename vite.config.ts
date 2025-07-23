import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig, loadEnv } from 'vite'

const CWD = process.cwd()

// https://vite.dev/config/
export default defineConfig(({ command, mode, ...rest }) => {
  console.log(`Command: ${command}, Mode: ${mode}, rest:`, rest)

  const { VITE_BASE_URL } = loadEnv(mode, CWD)
  return {
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [vue(), vueJsx()],
    server: {
      port: 3001,
      host: '0.0.0.0',
    },
  }
})
