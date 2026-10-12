import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  fullyParallel: true,
  workers: 2,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4339",
    browserName: "chromium",
    channel: process.env.CI ? undefined : "chrome",
    reducedMotion: "reduce",
    trace: "off",
  },
  webServer: {
    command: "npm run preview -- --ignore-lock --host 127.0.0.1 --port 4339",
    url: "http://127.0.0.1:4339",
    reuseExistingServer: false,
  },
});
