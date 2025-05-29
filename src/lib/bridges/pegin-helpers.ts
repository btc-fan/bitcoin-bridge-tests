// src/lib/bridges/pegin-helpers.ts
import axios from 'axios';
import { regtest } from '../bitcoin/regtest';

export async function createPegin(btc: number): Promise<string> {
  /* ── ask the running RSK node for the federation deposit script ─────── */
  const { data } = await axios.post(
      process.env.RSK_RPC!,                 // http://127.0.0.1:4444
      { jsonrpc: '2.0', id: 1, method: 'bridge_getFederationAddress', params: [] },
      { headers: { 'content-type': 'application/json' }, timeout: 5_000 }
  );

  const depositAddr: string = data.result;
  if (!depositAddr?.startsWith('2') && !depositAddr?.startsWith('bcrt1'))
    throw new Error(`RSK returned unusable address: ${depositAddr}`);

  /* ── fund it on the bitcoin regtest instance ────────────────────────── */
  const sats = Math.round(btc * 1e8);
  const txid = await regtest.faucet(depositAddr, sats);  // returns txid
  await regtest.mine(6);                                 // first 6 confs

  return txid;
}

export async function waitConfs(txid: string, target = 100) {
  while ((await regtest.txDepth(txid)) < target) {
    await regtest.mine(1);
  }
}
