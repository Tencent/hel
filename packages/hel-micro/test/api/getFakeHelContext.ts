import { getFakeHelContext } from 'index';

describe('test getFakeHelContext', () => {
  test('getFakeHelContext should be function', () => {
    expect(getFakeHelContext).toBeInstanceOf(Function);
  });

  test('getFakeHelContext should work', () => {
    const fakeCtx = getFakeHelContext('app1');
    expect(fakeCtx.name).toBe('app1');
  });

  test('getFakeHelContext pass platform', () => {
    const fakeCtx = getFakeHelContext('app1', { platform: 'tnews' });
    expect(fakeCtx.name).toBe('app1');
    expect(fakeCtx.platform).toBe('tnews');
  });

  test('getFakeHelContext pass versionId', () => {
    const fakeCtx = getFakeHelContext('app1', { versionId: 'ver_1' });
    expect(fakeCtx.name).toBe('app1');
    expect(fakeCtx.versionId).toBe('ver_1');
  });
});
