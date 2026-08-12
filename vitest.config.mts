import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(new URL("./src/test/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    // Default forks leave the Vitest runner unset on this Windows + Node 24 host.
    pool: "vmThreads",
    include: ["src/**/*.test.ts"],
    coverage: {
      reporter: ["text", "json-summary"],
    },
  },
});
