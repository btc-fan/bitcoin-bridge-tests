// playwright.config.ts
import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import 'dotenv/config';

const testDir = defineBddConfig({
  paths:   ['features/**/*.feature'],
  import:  ['steps/**/*.ts'],    // ESM
  outputDir: '.features-gen'
});

export default defineConfig({
  testDir,
  reporter: [['list'], ['html', { outputFolder: 'reports' }]],
});