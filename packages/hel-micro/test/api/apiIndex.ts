import * as apiIndex from 'index';

describe('test apiIndex', () => {
  test('expose 17 apis', () => {
    expect(apiIndex).toBeTruthy();
    expect(Object.keys(apiIndex).filter((apiName) => apiName !== 'default').length).toBe(17);
  });
});
