import { createBdd } from 'playwright-bdd';
import { expect, test } from '@playwright/test';
import axios from 'axios';
import { regtest } from '../src/lib/bitcoin/regtest';
import { JsonRpcProvider, Wallet } from 'ethers';
// steps/pegin_duplicate.steps.ts  ← top of file
import { createPegin, waitConfs } from '../src/lib/bridges/pegin-helpers.js';

const { Given, When, Then } = createBdd();

const rsk = new JsonRpcProvider(process.env.RSK_RPC!);
let signer: Wallet;
let proof: any;          // whatever format your bridge expects
let creditedBefore: bigint;

/* ---------------- Background ---------------- */

Given('a funded Bitcoin address', async () => {
  // you already implemented this in fund_address.steps.ts
});

/* ---------------- Duplicate peg-in ---------------- */

Given(
    'I already have a confirmed peg-in of {float} BTC',
    async ({}, amount: number) => {
      // 1) craft + broadcast real peg-in tx (reuse your existing helper)
      // 2) wait ≥ 100 confs OR call regtest.mine() loop
      // 3) query bridge → store peg-in proof & initial RSK balance

      const btcTxid = await createPegin(amount);   // implement helper
      await waitConfs(btcTxid, 100);

      // Save the proof returned by the bridge for later replay
      const { data } = await axios.post(`${process.env.BRIDGE_API}/pegin`, {
        txid: btcTxid,
      });
      proof = data.proof ?? data;        // flexible

      // Store signer & credited balance
      const pk = process.env.RSK_PK!;
      signer = new Wallet(pk.startsWith('0x') ? pk : `0x${pk}`, rsk);
      creditedBefore = await rsk.getBalance(signer);
    }
);

When('I resubmit the same peg-in proof', async () => {
  try {
    await axios.post(`${process.env.BRIDGE_API}/pegin`, proof);
    // If no error → fail the test
    throw new Error('Bridge accepted duplicate proof!');
  } catch (err: any) {
    // capture for Then-step
    test.info().annotations.push({ type: 'bridgeError', description: err.response?.data });
    expect(err.response?.status).toBeGreaterThanOrEqual(400);
  }
});

Then('the bridge responds with {string}', async ({}, keyword: string) => {
  const lastErr = test.info().annotations.find(a => a.type === 'bridgeError')?.description || '';
  expect(JSON.stringify(lastErr).toLowerCase()).toContain(keyword.toLowerCase());
});

Then('the RSK balance should remain unchanged', async () => {
  const now = await rsk.getBalance(signer);
  expect(now).toEqual(creditedBefore);
});
