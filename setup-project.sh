#!/bin/bash

# Create main project directory
mkdir bitcoin-bridge-tests
cd bitcoin-bridge-tests

# Create main directories
mkdir -p tests/api
mkdir -p tests/e2e
mkdir -p tests/security
mkdir -p lib/bitcoin
mkdir -p lib/bridge
mkdir -p lib/utils
mkdir -p fixtures
mkdir -p config

# Create test files structure
touch tests/api/bridge-status.spec.ts
touch tests/api/pegin-transactions.spec.ts
touch tests/api/pegout-transactions.spec.ts
touch tests/api/federation.spec.ts

touch tests/e2e/full-pegin-flow.spec.ts
touch tests/e2e/full-pegout-flow.spec.ts
touch tests/e2e/error-scenarios.spec.ts

touch tests/security/input-validation.spec.ts
touch tests/security/rate-limiting.spec.ts
touch tests/security/double-spending.spec.ts

# Create lib files
touch lib/bitcoin/utxo-manager.ts
touch lib/bitcoin/transaction-builder.ts
touch lib/bitcoin/script-validator.ts

touch lib/bridge/api-client.ts
touch lib/bridge/bridge-monitor.ts
touch lib/bridge/transaction-tracker.ts

touch lib/utils/test-helpers.ts
touch lib/utils/data-generators.ts
touch lib/utils/fixtures.ts

# Create fixture files
touch fixtures/test-transactions.json
touch fixtures/test-addresses.json
touch fixtures/mock-responses.json

# Create config files
touch config/test-environments.ts
touch config/bitcoin-regtest.ts
touch config/rsk-regtest.ts
touch config/global-setup.ts
touch config/global-teardown.ts

# Create root files
touch package.json
touch playwright.config.ts
touch .env.example
touch .gitignore
touch README.md