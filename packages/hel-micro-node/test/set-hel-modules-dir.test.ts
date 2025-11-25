import { buildImportHelpackModTest } from './util/test-real-builder';

describe('test set helModulesDir', () => {
  const testFn = buildImportHelpackModTest();
  testFn('helModulesDir should work');
});
