Feature: Regtest funding

  Scenario: Faucet 1 BTC and mine 6 blocks
    Given I have a fresh regtest address
    When I fund it with 1 BTC and mine 6 blocks
    Then the address balance should equal 1 BTC
