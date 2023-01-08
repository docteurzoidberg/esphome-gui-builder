import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import copy from "rollup-plugin-copy";
import { resolve } from "path";
import GitRevision from "./vite-plugin-git-revision";
import myVitePlugin from "./my-vite-plugin";
export default defineConfig({
  plugins: [
    myVitePlugin({}),
    /*
    GitRevision({
      lightweightTags: false,
      branch: true,
    }),
    */
    tsconfigPaths(),
    copy({
      copyOnce: true,
      targets: [
        {
          src: resolve(
            __dirname,
            "node_modules/@shoelace-style/shoelace/dist/assets"
          ),
          dest: resolve(__dirname, "./public/assets/shoelace"),
        },
      ],
    }),
  ],
  build: {
    outDir: "./build/dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
