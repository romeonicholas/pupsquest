import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: { DB_FILE_NAME: "file:test.db" },
    globalSetup: "./tests/setup.ts",
    setupFiles: "./tests/reset-user-data.ts",
    fileParallelism: false,
  },
});
