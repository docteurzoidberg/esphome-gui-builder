import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    //lib: {
    //  entry: "src/my-app.ts",
    //  formats: ["es"],
    //},
    //rollupOptions: {
    //  external: /^lit/,
    //},
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
