// steps/fund.steps.ts
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';
import * as secp from 'tiny-secp256k1';
import { regtest } from '../src/lib/bitcoin/regtest';

const { Given, When, Then } = createBdd();
const ECPair = ECPairFactory(secp);          // ← actual key-pair generator

let address: string;

Given('I have a fresh regtest address', async ({}) => {
    const kp = ECPair.makeRandom({ network: regtest.network });
    address = bitcoin.payments.p2wpkh({
        pubkey: Buffer.from(kp.publicKey),
        network: regtest.network
    }).address!;
});

When(
    'I fund it with {float} BTC and mine {int} blocks',
    async ({}, btc: number, blocks: number) => {
        const sats = Math.round(btc * 1e8);      // convert BTC → satoshis
        await regtest.faucet(address, sats);
        await regtest.mine(blocks);
    }
);

Then('the address balance should equal {float} BTC', async ({}, expected: number) => {
    const utxos = await regtest.unspents(address);
    const balance = utxos.reduce((s, u) => s + u.value, 0) / 1e8;
    expect(balance).toBe(expected);
});
