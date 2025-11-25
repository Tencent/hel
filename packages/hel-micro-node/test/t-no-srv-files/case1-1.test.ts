import { importNodeMod, mapNodeMods } from '../../src';
import '../mock/mock-with-real-axios';
import { HEL_API_URL, HEL_HELLO_HELPACK, HEL_HELLO_NO_SERVER_FILES_VER } from '../util/consts';

const platform = 'hel';

describe('test no srv mod files', () => {
  test('importNodeMod should catch no srv mod files', async () => {
    try {
      mapNodeMods({
        [HEL_HELLO_HELPACK]: { platform },
      });
      await importNodeMod(HEL_HELLO_HELPACK, { ver: HEL_HELLO_NO_SERVER_FILES_VER, helpackApiUrl: HEL_API_URL });
    } catch (err: any) {
      expect(err.message.includes('no server mod files')).toBeTruthy();
    }
  });
});
