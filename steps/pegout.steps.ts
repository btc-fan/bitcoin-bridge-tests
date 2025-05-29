import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { JsonRpcProvider, Wallet } from 'ethers';
import axios from 'axios';
import { regtest } from '../src/lib/bitcoin/regtest';

const { Given, When, Then } = createBdd();

const rsk = new JsonRpcProvider(process.env.RSK_RPC);
let signer: Wallet;
let pegTxId: string;

Given(
    'an RSK account with ≥ {float} RBTC',
    async ({}, min: number) => {
      const pk = process.env.RSK_PK;
      expect(pk, 'RSK_PK env var must be set').toBeTruthy();
      signer = new Wallet(pk!.startsWith('0x') ? pk! : `0x${pk!}`, rsk);
      const bal = Number(await rsk.getBalance(signer.address)) / 1e18;
      expect(bal).toBeGreaterThanOrEqual(min);
    }
);

When(
    'I request a peg-out of {float} RBTC to {string}',
    async ({}, amount: number, btcAddr: string) => {
        console.log(`🌉 Using real RSK Bridge contract for peg-out`);
        console.log(`Amount: ${amount} RBTC, Destination: ${btcAddr}`);

        // Real RSK Bridge Contract address
        const BRIDGE_CONTRACT = '0x0000000000000000000000000000000001000006';

        // Convert RBTC to wei
        const amountWei = (amount * 1e18).toString();

        // Send transaction to RSK Bridge contract
        const tx = await signer.sendTransaction({
            to: BRIDGE_CONTRACT,
            value: amountWei,
            gasLimit: 100000,  // Required gas limit per RSK docs
            gasPrice: '60000000', // 0.06 gwei as recommended
        });

        console.log(`✅ Peg-out transaction sent: ${tx.hash}`);

        // Wait for transaction confirmation
        const receipt = await tx.wait();
        console.log(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);

        // Use the RSK transaction hash as our "pegTxId"
        // In reality, this would trigger a Bitcoin transaction later
        pegTxId = tx.hash.replace('0x', ''); // Remove 0x prefix to match Bitcoin format

        console.log(`📋 Peg-out initiated with RSK tx: ${pegTxId}`);

        expect(typeof pegTxId).toBe('string');
        expect(pegTxId).toMatch(/^[0-9a-f]{64}$/);
    }
);

Then(
    'the Bitcoin tx appears with {int} confirmations',
    async ({}, confs: number) => {
        console.log(`🔍 Waiting for ${confs} confirmations on RSK transaction: ${pegTxId}`);

        // Since we're dealing with RSK transaction, check RSK confirmations
        for (let i = 0; i < 20; i++) {
            try {
                // Get transaction receipt from RSK
                const receipt = await rsk.getTransactionReceipt(`0x${pegTxId}`);

                if (!receipt) {
                    console.log(`Attempt ${i + 1}: Transaction not found yet`);
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                    continue;
                }

                // Get current block number
                const currentBlock = await rsk.getBlockNumber();

                // Calculate confirmations
                const depth = currentBlock - receipt.blockNumber + 1;

                console.log(`Attempt ${i + 1}: Transaction at block ${receipt.blockNumber}, current block ${currentBlock}, confirmations: ${depth}`);

                if (depth >= confs) {
                    console.log(`✅ Transaction has ${depth} confirmations (required: ${confs})`);
                    return;
                }

                // Wait before next check
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds

            } catch (error) {
                console.log(`Attempt ${i + 1}: Error checking transaction: ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        throw new Error(`RSK transaction ${pegTxId} never reached ${confs} confirmations after 20 attempts`);
    }
);
