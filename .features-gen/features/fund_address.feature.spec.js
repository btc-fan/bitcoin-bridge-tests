// Generated from: features/fund_address.feature
import { test } from "playwright-bdd";

test.describe('Regtest funding', () => {

  test('Faucet 1 BTC and mine 6 blocks', async ({ Given, When, Then }) => { 
    await Given('I have a fresh regtest address'); 
    await When('I fund it with 1 BTC and mine 6 blocks'); 
    await Then('the address balance should equal 1 BTC'); 
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('features/fund_address.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I have a fresh regtest address","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I fund it with 1 BTC and mine 6 blocks","stepMatchArguments":[{"group":{"start":15,"value":"1","children":[]},"parameterTypeName":"float"},{"group":{"start":30,"value":"6","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then the address balance should equal 1 BTC","stepMatchArguments":[{"group":{"start":33,"value":"1","children":[]},"parameterTypeName":"float"}]}]},
]; // bdd-data-end