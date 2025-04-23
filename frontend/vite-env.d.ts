/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  // Add more VITE_ vars here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
