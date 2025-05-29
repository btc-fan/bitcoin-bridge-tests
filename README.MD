# Bitcoin-Bridge Tests 🧪

End-to-end (BDD) test-suite for a **BTC ⇄ RSK** bridge.  
Written in **TypeScript + Playwright BDD** with helper libs for Bitcoin regtest, RSK regtest and a minimal HTTP bridge stub.

---

## Table of Contents

1. [Quick start](#quick-start)
2. [Project layout](#project-layout)
3. [Available npm scripts](#available-npm-scripts)
4. [Environment variables](#environment-variables)
5. [Docker helpers](#docker-helpers)
6. [Troubleshooting](#troubleshooting)
7. [Extending the suite](#extending-the-suite)

---

## Quick start

```bash
# clone & install
git clone https://github.com/your-org/bitcoin-bridge-tests.git
cd bitcoin-bridge-tests
npm ci

# spin up all deps (Bitcoin regtest, Esplora, bridge stub, RSK regtest)
docker compose up -d

# fund the RSK key (mines 120 blocks so rewards mature)
bash scripts/rsk-rsk-topup.sh

# generate spec files & run the whole suite
npm run bddgen
npm test
```

All three baseline scenarios should go green:

| Feature | Scenario |
|---------|----------|
| Regtest funding | Faucet 1 BTC + mine 6 blocks |
| Peg-in BTC → RSK | Successful peg-in |
| Peg-out RSK → BTC | Successful peg-out (mock bridge) |

## Project layout

```bash
├── .features-gen/          # auto-generated Playwright specs (git-ignored)
├── features/               # Gherkin feature files
├── steps/                  # step-definitions (TypeScript)
├── src/lib/bitcoin/        # regtest helpers (utxo manager, script checks…)
├── scripts/                # ad-hoc helper scripts (docker, funding…)
├── playwright.config.ts
└── README.md
```

## Available npm scripts

| Script | What it does |
|--------|--------------|
| `npm run bddgen` | generates .features-gen/**/*.spec.{ts,js} |
| `npm test` | bddgen + playwright test |
| `npm run lint` | eslint + prettier |
| `npm run clean` | removes .features-gen/ |

## Environment variables

Create .env (or edit the sample) at project root:

```dotenv
# Bitcoin regtest
BTC_API=http://127.0.0.1:8080/1    # Esplora API root

# RSK regtest
RSK_RPC=http://127.0.0.1:4444
RSK_PK=0x944987e545a36...cd77a5     # pre-funded key (≥0.1 RBTC)

# bridge REST endpoint (mock on :5000 by default)
BRIDGE_API=http://127.0.0.1:5000
```

## Docker helpers
```docker
docker run -d \
--name bitcoin-test-env \
-p 8080:8080 \
-p 60401:60401 \
-p 3002:3002 \
-p 5000:5000 \
bitcoinerlab/tester


docker run -d --name rsk-regtest -p 4444:4444 rsksmart/rskj:latest \
--regtest --http --http.addr=0.0.0.0 --http.port=4444 \
--minerthreads=1 --unlock=0 --password=pass


curl http://localhost:3002/blocks/tip/height
Response:
432%
```

| Container | Ports | Purpose |
|-----------|-------|---------|
| bitcoinerlab/tester | 8080 (Esplora), 5000 (mock bridge), 3002 (JSON WS), 60401 (regtest RPC) | Bitcoin + RSK friendly toolbox |
| rsk-regtest | 4444 | Stand-alone RSK node (started by scripts/rsk-topup.sh) |

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Received: 0 < 0.1 in peg-out step | run `scripts/rsk-topup.sh` to mine 120 blocks → makes rewards spendable |
| Bridge API response missing transaction ID | ensure BRIDGE_API points to a service that returns `{ txid }` or `{ result:{txid} }`. The included mock (bitcoinerlab/tester on :5000) satisfies this. |
| ENOENT package.json | you're outside the repo – `cd bitcoin-bridge-tests` |

## Extending the suite

1. Write a new `*.feature` under `features/`.
2. `npm run bddgen` generates a skeleton step file.
3. Fill the step-definitions in `steps/`, use helpers from `src/lib/**`.
4. Run `npm test`.
5. Commit both the new feature and its steps.

Happy testing 👩‍💻👨‍💻