#!/usr/bin/env bash
set -euo pipefail
NODE=${RSK_RPC:-http://127.0.0.1:4444}
BRIDGE=${BRIDGE_API:-http://127.0.0.1:5000}

echo "▶ deriving RSK address from RSK_PK ..."
ADDR=$(node - <<'NODE'
  const {Wallet}=require('ethers');
  console.log(new Wallet(process.env.RSK_PK).address);
NODE)
echo "   → $ADDR"

echo "▶ importing test key into rskj (safe if already imported)"
curl -s $NODE -Hcontent-type:application/json -d \
'{"jsonrpc":"2.0","id":1,"method":"personal_importRawKey",
  "params":["'${RSK_PK#0x}'","pass"]}' >/dev/null || true

echo "▶ finding a pre-mined faucet account ..."
FUNDER=$(curl -s $NODE -Hcontent-type:application/json -d \
'{"jsonrpc":"2.0","id":1,"method":"eth_accounts","params":[]}' |
jq -r '.result[]' |
while read a; do
  b=$(curl -s $NODE -Hcontent-type:application/json -d \
  '{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":[""'"$a"'" ,"latest"]}' |
  jq -r '.result')
  [[ $b != 0x0 ]] && echo $a && break
done)
echo "   → $FUNDER"

echo "▶ unlocking faucet for 5 min"
curl -s $NODE -Hcontent-type:application/json -d \
'{"jsonrpc":"2.0","id":1,"method":"personal_unlockAccount",
  "params":[""'"$FUNDER"'" ,"pass","0x12c"]}' >/dev/null

echo "▶ sending 0.2 RBTC to test key"
TX=$(curl -s $NODE -Hcontent-type:application/json -d \
'{"jsonrpc":"2.0","id":1,"method":"personal_sendTransaction",
  "params":[{"from":"'"$FUNDER"'", "to":"'"$ADDR"'", "value":"0x2d79883d200000", "gas":"0x5208"},"pass"]}' |
jq -r '.result')
echo "   tx = $TX"

echo "▶ mining 1 block so it confirms"
curl -s $NODE -Hcontent-type:application/json \
     -d '{"jsonrpc":"2.0","id":1,"method":"evm_mine","params":[]}' >/dev/null

BAL=$(curl -s $NODE -Hcontent-type:application/json -d \
'{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":[""'"$ADDR"'" ,"latest"]}' |
jq 'tonumber/1e18')
echo "✅ balance on $ADDR = ${BAL} RBTC (need ≥ 0.1)"

echo "▶ asking bridge for a fresh deposit script"
BRIDGE_DEPOSIT=$(curl -s "$BRIDGE/pegin-address" -H "accept: application/json" | jq -r '.address // .result // .deposit')
echo "   → $BRIDGE_DEPOSIT"
[[ $BRIDGE_DEPOSIT == bcrt1* ]] || { echo "❌ bridge did not return a reg-test bech32 address" ; exit 1; }

echo "▶ writing .env with the two derived values"
cat > .env <<ENV
BRIDGE_API=$BRIDGE
RSK_RPC=$NODE
RSK_PK=$RSK_PK
BRIDGE_DEPOSIT=$BRIDGE_DEPOSIT
ENV
echo "✅ .env refreshed"

echo "All set – run  \`npm test\`"
