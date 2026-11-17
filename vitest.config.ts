import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/*.test.ts"],
    env: { DB_FILE_NAME: "file:test.db" },
    globalSetup: "./tests/setup.ts",
    setupFiles: "./tests/reset-user-data.ts",
    fileParallelism: false,
  },
});
