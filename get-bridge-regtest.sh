# host shell
BRIDGE_DEPOSIT=$(docker exec bitcoin-test-env \
                 bitcoin-cli -regtest getnewaddress "" bech32)
echo "Bridge deposit address = $BRIDGE_DEPOSIT"
