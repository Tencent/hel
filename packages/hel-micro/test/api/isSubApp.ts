import { isSubApp } from 'index';

describe('test isSubApp', () => {
  test('isSubApp should be function', () => {
    expect(isSubApp).toBeInstanceOf(Function);
  });

  test('isSubApp should return false', () => {
    expect(isSubApp() === false).toBeTruthy();
  });
});
