Feature: Peg-out (RSK → BTC)
  Scenario: BTC ← RSK peg-out
    Given an RSK account with ≥ 0.1 RBTC
    When I request a peg-out of 0.01 RBTC to "bcrt1qwq7cg4mdfwlpnttvmekvn6k6a4w8d5e8k62jmf"
    Then the Bitcoin tx appears with 6 confirmations
