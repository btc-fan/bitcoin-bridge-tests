Feature: Peg-in BTC to RSK
  Scenario: Successful peg-in
    Given a funded Bitcoin address
    When I submit a peg-in transaction
    Then the bridge credits the corresponding RSK address
