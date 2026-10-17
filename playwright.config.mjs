import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  fullyParallel: true,
  workers: 2,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4339",
    reducedMotion: "reduce",
    trace: "off",
  },
  projects: [
    {name: "chromium", use: {browserName: "chromium", channel: process.env.PLAYWRIGHT_CHANNEL || undefined}},
    {name: "firefox", testMatch: "cross-browser.spec.mjs", use: {browserName: "firefox"}},
    {name: "webkit", testMatch: "cross-browser.spec.mjs", use: {browserName: "webkit"}}
  ],
  webServer: {
    command: "npm run preview -- --ignore-lock --host 127.0.0.1 --port 4339",
    url: "http://127.0.0.1:4339",
    reuseExistingServer: false,
  },
});
