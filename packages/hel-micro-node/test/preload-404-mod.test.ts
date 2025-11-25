import { mapAndPreload } from '../src';
import './mock';

describe('test preload 404', () => {
  test('should catch 404', async () => {
    try {
      await mapAndPreload({ 'hel-hello': { ver: '0.0.3' } });
    } catch (err: any) {
      expect(err.message.includes('404')).toBeTruthy();
    }
  });
});
