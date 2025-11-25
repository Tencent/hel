import { buildImportHelpackModTest } from './util/test-real-builder';

describe('test importNodeMod', () => {
  const testFn = buildImportHelpackModTest();
  testFn('call importNodeMod then call requireNodeMod');
});
