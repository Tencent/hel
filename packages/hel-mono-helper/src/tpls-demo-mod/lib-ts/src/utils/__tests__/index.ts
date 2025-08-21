import { hello } from '../index';

test('hello', () => {
  expect(hello().includes('hello')).toBeTruthy();
});
