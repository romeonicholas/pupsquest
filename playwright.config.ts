import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  use: {
    baseURL: "http://localhost:3001",
  },
  webServer: {
    command: "tsx tests/browser/reset-db.ts && npm start",
    url: "http://localhost:3001",
    env: { DB_FILE_NAME: "file:browser.db", PORT: "3001" },
  },
});
