import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/*.test.ts"],
    env: {
      DATABASE_URL:
        "postgres://pupsquest:pupsquest@localhost:5432/pupsquest_test",
      APP_MODE: "museum",
    },
    globalSetup: "./tests/setup.ts",
    setupFiles: "./tests/reset-user-data.ts",
    fileParallelism: false,
  },
});
