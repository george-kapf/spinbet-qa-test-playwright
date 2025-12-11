import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html'], ['github']],
  timeout: 90_000,
  expect: {
    timeout: 30_000,
  },
  use: {
    navigationTimeout: 60_000,
    actionTimeout: 10_000,
    baseURL: 'https://stage.spinbet.com/en-nz',
    viewport: { width: 1920, height: 1080 },
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
    //   ...(process.env.CI
    //     ? [
    //       {
    //         name: 'firefox',
    //         use: {
    //           ...devices['Desktop Firefox'],
    //           viewport: { width: 1920, height: 1080 },
    //           storageState: '.auth/user.json',
    //         },
    //         dependencies: ['setup'],
    //       },
    //       {
    //         name: 'webkit',
    //         use: {
    //           ...devices['Desktop Safari'],
    //           viewport: { width: 1920, height: 1080 },
    //           storageState: '.auth/user.json',
    //         },
    //         dependencies: ['setup'],
    //       },
    //     ]
    //     : []),
  ],
});
