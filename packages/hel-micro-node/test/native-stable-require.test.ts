import { buildNativeStableRequireTest } from './util/test-real-builder';

describe('test native require', () => {
  const testStableFn = buildNativeStableRequireTest();
  testStableFn('stable fn ref should work');
});
