import { importNodeMod, mapNodeMods } from '../src';

const myMod = 'my-mod';

describe('test writeIndexContent', () => {
  beforeAll(() => {
    mapNodeMods({ [myMod]: true });
  });

  test('writeIndexContent should work', async () => {
    const { mod } = await importNodeMod(myMod, {
      skipMeta: true,
      prepareFiles: (params) => {
        params.writeIndexContent(`
          exports.hello = ()=>'my hello';
        `);
      },
    });
    expect(mod.hello()).toBe('my hello');
  });

  test('customVer should work', async () => {
    const { mod } = await importNodeMod(myMod, {
      skipMeta: true,
      prepareFiles: (params) => {
        params.writeIndexContent(`
          exports.hello = ()=>'my hello v2';
        `);
      },
      customVer: 'v2',
    });
    expect(mod.hello()).toBe('my hello v2');
  });
});
