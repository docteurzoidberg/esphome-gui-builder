/// <reference types="vite/client" />

declare module "vite:my-plugin" {
  export const COMMIT_ID: string;
  export const BRANCH: string;
}
