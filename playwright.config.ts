import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 35000,
  expect: {
    timeout: 6000
  },
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'node server/dist/server.js',
      url: 'http://localhost:5000/api/health',
      reuseExistingServer: true,
      timeout: 15000,
    },
    {
      command: 'npm --prefix client run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 15000,
    }
  ],
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 }
      },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 390, height: 844 }
      },
    },
  ],
});

