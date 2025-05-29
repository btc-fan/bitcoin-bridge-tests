// steps/pegin.steps.ts
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();   // ✅

Given('a funded Bitcoin address', async () => {
  /* … */
});
When('I submit a peg-in transaction', async () => {
  /* … */
});
Then('the bridge credits the corresponding RSK address', async () => {
  expect(true).toBeTruthy();
});
