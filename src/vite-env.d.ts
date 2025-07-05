/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_DEV_MODE: string
  readonly VITE_ENABLE_DEVTOOLS: string
  readonly VITE_FRONTEND_URL: string
  readonly VITE_BACKEND_HTTPS: string
  readonly VITE_BACKEND_HTTP: string
  readonly VITE_SWAGGER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
