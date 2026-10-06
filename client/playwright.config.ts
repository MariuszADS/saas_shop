import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/test",

  use: {
    baseURL: "http://localhost:5173",

    browserName: "chromium",

    launchOptions: {
      executablePath: "/usr/bin/google-chrome",
    },

    trace: "on-first-retry",
  },
});