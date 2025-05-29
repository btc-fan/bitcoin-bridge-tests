#!/usr/bin/env bash
set -euo pipefail

# ── settings ──────────────────────────────────────────────────────────────────
PROJECT=bitcoin-bridge-tests
NODE_REQUIRED=20

# ── project skeleton ──────────────────────────────────────────────────────────
mkdir -p "$PROJECT" && cd "$PROJECT"
npm init -y                                               # package.json
npm pkg set type="module"

# core test stack
npm i -D @playwright/test playwright-bdd@latest @cucumber/cucumber \
       typescript ts-node @types/node                     \
       bitcoin-core bitcoinjs-lib axios dotenv            \
       eslint prettier eslint-plugin-cucumber eslint-config-prettier \
       husky lint-staged

npx playwright install --with-deps                        # browsers:contentReference[oaicite:0]{index=0}

# TypeScript
npx tsc --init --rootDir src --outDir dist \
          --moduleResolution node --esModuleInterop \
          --resolveJsonModule --strict

# folders
mkdir -p {features,steps,.features-gen,src/{lib/{bitcoin,bridge,utils},tests/{api,e2e,security}},config,fixtures}

# Playwright config (points runner to generated BDD tests)
cat > playwright.config.ts <<'EOF'
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '.features-gen',
  timeout: 120000,
  reporter: [['list'], ['html', { outputFolder: 'reports' }]],
  use: { trace: 'on-first-retry' }
});
EOF

# Cucumber config for step defs
cat > cucumber.mjs <<'EOF'
export default {
  default: {
    require: ['steps/**/*.ts'],
    publishQuiet: true
  }
};
EOF

# sample feature & step stub
cat > features/pegin.feature <<'EOF'
Feature: Peg-in BTC to RSK
  Scenario: Successful peg-in
    Given a funded Bitcoin address
    When I submit a peg-in transaction
    Then the bridge credits the corresponding RSK address
EOF

mkdir -p steps && cat > steps/pegin.steps.ts <<'EOF'
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('a funded Bitcoin address', async function () {
  /* TODO: create regtest address & fund via bitcoin-core RPC */
});

When('I submit a peg-in transaction', async function () {
  /* TODO: broadcast tx and wait for confirmations */
});

Then('the bridge credits the corresponding RSK address', async function () {
  /* TODO: poll bridge API & assert balance */
  expect(true).toBeTruthy();
});
EOF

# env template
cat > .env.example <<'EOF'
BTC_RPC=http://user:pass@127.0.0.1:18443
RSK_RPC=http://127.0.0.1:4444
BRIDGE_API=http://localhost:3000
EOF

# git + pre-commit linting
git init
npx husky install
npm pkg set scripts.prepare="husky install"
npx husky add .husky/pre-commit "npx lint-staged"

# convenient scripts
npm pkg set scripts.bddgen="bddgen"
npm pkg set scripts.test="bddgen && playwright test"

echo -e "\n✔  Bootstrap complete.  Next:\n  cp .env.example .env\n  npm run test"
