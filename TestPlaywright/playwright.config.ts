import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  retries: 0,
  reporter: [['list']],
  use: {
    headless: true,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api',
      testDir: './api',   // Sadece api altındaki testler
      use: {}             // Browser bağımsız
    },
    {
      name: 'ui-chromium',
      testDir: './ui',    // UI testleri
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'ui-firefox',
      testDir: './ui',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'db',
      testDir: './db',    // DB ile ilgili testler
      use: {}             // Browser bağımsız
    }
  ]
});
