#!/bin/bash

echo "🔍 Getting list of RSK accounts..."
ACCOUNTS=$(curl -s -X POST http://127.0.0.1:4444 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "method": "eth_accounts", "params": [], "id": 1}' | jq -r '.result[]')

echo "Available accounts:"
for acc in $ACCOUNTS; do
  BAL=$(curl -s -X POST http://127.0.0.1:4444 \
    -H "Content-Type: application/json" \
    -d '{
      "jsonrpc": "2.0",
      "method": "eth_getBalance",
      "params": ["'$acc'", "latest"],
      "id": 1
    }' | jq -r '.result')

  if [ "$BAL" != "0x0" ]; then
    echo "💰 $acc has balance: $BAL"
    FUNDER=$acc
    break
  else
    echo "💸 $acc has 0 balance"
  fi
done

if [ -z "$FUNDER" ]; then
  echo "❌ No funded accounts found in RSK regtest"
  echo "💡 Try starting RSK regtest with pre-funded accounts"
  exit 1
fi

echo "✅ Using $FUNDER as funder account"

# Rest of transfer logic...