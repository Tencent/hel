import { getIndexedDBFactory, IndexedDBStorage } from 'browser/indexeddb';

describe('test indexedDB storage', () => {
  test('indexedDB should be usable', () => {
    const IndexedDB = getIndexedDBFactory();
    expect(IndexedDB).toBeTruthy();
  });

  test('indexedDB setItem and getItem should be usable', async () => {
    const indexedDBIns = new IndexedDBStorage({
      name: 'test',
      storeName: 'test_store',
    });
    const setedVal: Record<string, any> = await indexedDBIns.setItem('test_store_key', { id: '001' });
    expect(setedVal).toEqual('test_store_key');

    const getedVal: Record<string, any> = await indexedDBIns.getItem('test_store_key');
    expect(getedVal).toEqual({ id: '001' });
  });

  test('repeatedly indexedDB with the same options should be not effect', async () => {
    const firstIndexedDBIns = new IndexedDBStorage({
      name: 'test',
      storeName: 'test_store',
    });
    await firstIndexedDBIns.setItem('test_store_key', { id: '001' });

    const secondIndexedDBIns = new IndexedDBStorage({
      name: 'test',
      storeName: 'test_store',
    });
    const secondGetedVal: Record<string, any> = await secondIndexedDBIns.getItem('test_store_key');
    expect(secondGetedVal).toEqual({ id: '001' });

    await secondIndexedDBIns.setItem('test_store_key_twice', { id: '002' });
    const firstGetedVal: Record<string, any> = await firstIndexedDBIns.getItem('test_store_key_twice');
    expect(firstGetedVal).toEqual({ id: '002' });
  });
});
