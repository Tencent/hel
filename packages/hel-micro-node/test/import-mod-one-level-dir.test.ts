import { buildImportNodeModTest } from './util/test-builder';

describe('test importNodeMod of one dir level', () => {
  const testFn = buildImportNodeModTest({
    modVer1: 'mod-v1',
    modVer2: 'mod-v2',
    indexFileRelPath: '/index.js',
  });

  testFn('call preloadMiddleware then call importNodeMod');
});
