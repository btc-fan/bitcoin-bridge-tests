#Feature: Peg-in replay detection
#  As a bridge validator
#  I want to prevent someone from crediting RBTC twice
#  By submitting the same peg-in proof again
#
#  Background:
#    Given a funded Bitcoin address
#
#  Scenario: Duplicate peg-in proof is rejected
#    Given I already have a confirmed peg-in of 0.005 BTC
#    When I resubmit the same peg-in proof
#    Then the bridge responds with "duplicate"
#    And the RSK balance should remain unchanged
