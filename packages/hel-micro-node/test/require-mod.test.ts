import { getNodeModDesc, importNodeModByPath, mapNodeMods, requireNodeMod, resolveNodeMod } from '../src';
import './mock';

const myMod = 'my-mod';

describe('test require a non-exist node module', () => {
  test('init v1 then replace it to v2', async () => {
    mapNodeMods({ [myMod]: true });
    importNodeModByPath(myMod, require.resolve('./data/mod-v1'));
    const mod = requireNodeMod(myMod);
    expect(mod.hello()).toBe('hello v1');

    const modR = require('my-mod');
    expect(modR.hello()).toBe('hello v1');

    const modDesc = getNodeModDesc(myMod);
    expect(modDesc.storedVers.length === 1).toBeTruthy();
    expect(modDesc.modVer.includes('/data/mod-v1')).toBeTruthy();

    console.log(resolveNodeMod(myMod));

    importNodeModByPath(myMod, require.resolve('./data/mod-v2'));
    const modV2 = requireNodeMod(myMod);
    expect(modV2.hello()).toBe('hello v2');

    const modDesc2 = getNodeModDesc(myMod);
    expect(modDesc.storedVers.length === 2).toBeTruthy();
    expect(modDesc2.modVer.includes('/data/mod-v2')).toBeTruthy();
  });
});
