import { buildImportNodeModTest } from './util/test-builder';

describe('test importNodeMod', () => {
  const testFn = buildImportNodeModTest({
    modVer1: 'for-import-mod-test',
    modVer2: 'for-import-mod-test-v2',
    indexFileRelPath: '/srv/hel-hello/index.js',
  });

  testFn('call preloadMiddleware then call importNodeMod, copy multi level dir mod');
});
