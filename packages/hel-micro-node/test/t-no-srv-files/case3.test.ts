import { registerPlatform } from '../../src';
import '../mock/mock-with-real-axios';
import { HEL_API_URL, HEL_HELLO_HELPACK, HEL_HELLO_NO_SERVER_FILES_VER } from '../util/consts';

const platform = 'hel';

describe('test no srv mod files', () => {
  test('api.mapAndPreload should catch no srv mod files', async () => {
    try {
      const api = registerPlatform({
        platform,
        registrationSource: 'tnode',
        helpackApiUrl: HEL_API_URL,
      });
      await api.mapAndPreload({
        [HEL_HELLO_HELPACK]: { ver: HEL_HELLO_NO_SERVER_FILES_VER },
      });
    } catch (err: any) {
      expect(err.message.includes('no server mod files')).toBeTruthy();
    }
  });
});
