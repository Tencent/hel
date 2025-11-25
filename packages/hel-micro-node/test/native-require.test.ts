import { buildNativeRequireTest } from './util/test-real-builder';

describe('test nqtive require', () => {
  const testFn = buildNativeRequireTest();
  testFn('require should work');
});
