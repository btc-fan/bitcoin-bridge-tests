// Generated from: features/pegout.feature
import { test } from "playwright-bdd";

test.describe('Peg-out (RSK → BTC)', () => {

  test('BTC ← RSK peg-out', async ({ Given, When, Then }) => { 
    await Given('an RSK account with ≥ 0.1 RBTC'); 
    await When('I request a peg-out of 0.01 RBTC to "bcrt1qwq7cg4mdfwlpnttvmekvn6k6a4w8d5e8k62jmf"'); 
    await Then('the Bitcoin tx appears with 6 confirmations'); 
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('features/pegout.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":2,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":3,"keywordType":"Context","textWithKeyword":"Given an RSK account with ≥ 0.1 RBTC","stepMatchArguments":[{"group":{"start":22,"value":"0.1","children":[]},"parameterTypeName":"float"}]},{"pwStepLine":8,"gherkinStepLine":4,"keywordType":"Action","textWithKeyword":"When I request a peg-out of 0.01 RBTC to \"bcrt1qwq7cg4mdfwlpnttvmekvn6k6a4w8d5e8k62jmf\"","stepMatchArguments":[{"group":{"start":23,"value":"0.01","children":[]},"parameterTypeName":"float"},{"group":{"start":36,"value":"\"bcrt1qwq7cg4mdfwlpnttvmekvn6k6a4w8d5e8k62jmf\"","children":[{"start":37,"value":"bcrt1qwq7cg4mdfwlpnttvmekvn6k6a4w8d5e8k62jmf","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":5,"keywordType":"Outcome","textWithKeyword":"Then the Bitcoin tx appears with 6 confirmations","stepMatchArguments":[{"group":{"start":28,"value":"6","children":[]},"parameterTypeName":"int"}]}]},
]; // bdd-data-end