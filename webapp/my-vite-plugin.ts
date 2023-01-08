import { Plugin } from "vite";

import { execSync } from "child_process";

const commitId = execSync("git rev-parse HEAD").toString().trim();
const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

export default (options: any): Plugin => {
  return {
    name: "vite:my-plugin",
    resolveId(id) {
      if (id === "vite:my-plugin") {
        return id;
      }
    },
    load(id) {
      if (id === "vite:my-plugin") {
        return `
          export const COMMIT_ID = '${commitId}';
          export const BRANCH = '${branch}';
        `;
      }
    },
  };
};
