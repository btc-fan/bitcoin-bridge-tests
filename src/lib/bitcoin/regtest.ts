import * as bitcoin from 'bitcoinjs-lib';
import { RegtestUtils } from 'regtest-client';

export const regtest = new RegtestUtils(bitcoin, {
  APIURL: process.env.BTC_API ?? 'http://127.0.0.1:8080/1',
});
export const network = regtest.network;

export async function txDepth(txid: string): Promise<number> {
  const tx = await regtest.api(`tx/${txid}`);   // back-ticks
  return tx?.status?.confirmations ?? 0;
}
