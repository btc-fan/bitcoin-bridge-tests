# mines 120 empty blocks to your test key so the 3 coin-base rewards mature
ADDR=0x4A9C6ca67BF65e3B3D8Ab6d99600f384F20a0aa1
for i in {1..120}; do
  curl -s http://127.0.0.1:4444 \
       -H content-type:application/json \
       -d '{"jsonrpc":"2.0","id":1,"method":"evm_mine","params":[]}' > /dev/null
done
curl -s http://127.0.0.1:4444 -H content-type:application/json -d \
'{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":["'"$ADDR"'","latest"]}' \
| jq 'tonumber/1e18'        # → ≥120
