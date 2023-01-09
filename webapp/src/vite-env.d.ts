/// <reference types="vite/client" />

declare module "vite:my-plugin" {
  export const COMMIT_ID: string;
  export const BRANCH: string;
}

interface ImportMetaEnv {
  readonly VITE_COMMIT_ID: string;
  readonly VITE_BRANCH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
