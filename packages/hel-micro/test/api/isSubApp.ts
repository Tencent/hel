import { runTest } from '../testKit';

runTest(({ api, describe }) => {
  const { isSubApp } = api;

  describe('test isSubApp', () => {
    test('isSubApp should be function', () => {
      expect(isSubApp).toBeInstanceOf(Function);
    });

    test('isSubApp should return false', () => {
      expect(isSubApp() === false).toBeTruthy();
    });
  });
});
