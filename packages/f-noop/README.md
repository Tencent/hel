# p-guard

提供常用的函数助手，目前包含：creaate-flat-promise, noop, concurrency-guard

## 示例

### concurrency-guard

并发保护类，标识了相同 key 的多个函数在高并发场景同时执行时，只有一个函数会真正执行，其他的则进入等待并复用此函数结果

普通使用

```ts
import { ConcurrencyGuard } from '@tencent/qn-utils';

const guard = new ConcurrencyGuard();
const aHeavyAsyncTask = async () => {
  /** ... */ return 1;
};

await guard.call('key', aHeavyAsyncTask);

// 并发时，对于相同key的调用，只有一个函数会被触发，其他的会等待结果
await Promise.all([guard.call('key', aHeavyAsyncTask), guard.call('key', aHeavyAsyncTask), guard.call('key', aHeavyAsyncTask)]);
```

透传参数给目标函数

```ts
const aHeavyAsyncTask = async (p1, p2) => {
  /** ... */ return 1;
};

await guard.call('key', aHeavyAsyncTask, 1, 2);
// or
await guard.apply('key', aHeavyAsyncTask, [1, 2]);
```

在类里使用

```ts
class Cat {
  private guard = new ConcurrencyGuard();

  public async shout(someKey, p1, p2) {
    return this.guard.call(someKey, async () => {
      /** code here with p1 p2 */
      console.log(p1, p2);
      return 'Calling shout will take 3 seconds';
    });
  }
}
```

在类里使用，封装成员函数

```ts
class Cat {
  private guard = new ConcurrencyGuard();

  private async shoutLogic(p1, p2) {
    /** code here */
    return 'Calling shout will take 3 seconds';
  }

  private async shoutLogicWrap(p1, p2) {
    return this.shoutLogic(p1, p2);
  }

  public async shout(someKey, p1, p2) {
    return this.guard.call(someKey, this.shoutLogic, p1, p2);
  }

  /** 特别注意：如调用的成员函数非箭头函数，主要主动调用 bind(this)，否则函数 this 会丢失 */
  public async shoutWrap(someKey, p1, p2) {
    return this.guard.call(someKey, this.shoutLogicWrap.bind(this), p1, p2);
  }
}
```

### flat-promise

创建一个可脱离回调修改状态的扁平化 Promise，替代`new Promise()`，简化接收异步结果的写法，在处理复杂的控制流语句场景时更方便、更灵活。

> 注：`ConcurrencyGuard` 内部逻辑也是基于 `createFlatPromise` 封装的

```ts
import { createFlatPromise } from '@tencent/qn-utils';

// 基于 createFlatPromise 打开 indexedDB（简易版）
async function getIndexedDBIns(databaseName, version) {
  const promise = createFlatPromise();
  const request = window.indexedDB.open(databaseName, version);
  request.onerror = (event) => promise.reject(event);
  request.onsuccess = (event) => promise.resolve(request.result);
  return promise;
}

// 基于 new Promise 打开 indexedDB（简易版）
async function getIndexedDBIns(databaseName, version) {
  const promise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(databaseName, version);
    request.onerror = (event) => reject(event);
    request.onsuccess = (event) => resolve(request.result);
  });
  return promise;
}
```

### noop

无操作函数集合，仅用于占位，在某些场景需避开可选链判断时，初始化一个无操作函数会比较方便

```ts
import { noop } from '@tencent/qn-utils';

class Cat {
  private options = { logHook: noop.noopVoid };

  constructor(options) {
    if (typeof options.logHook === 'function') {
      this.options.logHook = options.logHook;
    }
  }

  public stand(p1, p2) {
    /** code here */
    // 不再需要 this.options?.(p1, p2)
    this.options.logHook(p1, p2);
  }
}
```
