import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  use: { baseURL: "http://localhost:3123" },
  webServer: {
    command: "npm run build && npm start",
    url: "http://localhost:3123",
    reuseExistingServer: true,
  },
});
