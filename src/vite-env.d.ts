/// <reference types="vite/client" />

interface ViteTypeOptions {
  // 添加这行代码，你就可以将 ImportMetaEnv 的类型设为严格模式，
  // 这样就不允许有未知的键值了。
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_IS_REQUEST_PROXY: boolean
  readonly VITE_API_URL: string
  readonly VITE_API_URL_PREFIX: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
