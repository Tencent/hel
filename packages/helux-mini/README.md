# helux-mini

helux-mini 是一个鼓励服务注入，并支持响应式变更 react 的全新数据流方案，为了更符合现在流行的 DDD 围绕业务构建领域模型而生。

> 它的前身是[concent](https://github.com/concentjs/concent)，经过抛弃面向 class 组件的 api 处理并做大量裁剪后，诞生了`helux`，现降`2.*`版本独立为`helux-mini`来发布

它拥有以下优势：

- 轻量，压缩后 2kb
- 高性能，带一层 proxy 依赖收集，不支持proxy环境的降级使用 defineProperty
- 无 Provider 嵌套，共享状态随取随用
- 有强大的生命周期管理
- 支持带 key 的 store 创建
- 100% ts 类型推导
- 接近 react useState 的对等使用体验，也支持配置 actions 集中管理修改状态行为

![2](https://user-images.githubusercontent.com/7334950/232248704-95532231-ae99-4555-adcd-8d5999a0c5d4.gif)

see oneline [demo1](https://codesandbox.io/s/helux-effect-qyv6xz?file=/src/App.tsx)，[demo2](https://codesandbox.io/p/sandbox/use-service-to-replace-ref-e5mgr4?file=%2Fsrc%2FApp.tsx)

## quick start

### 简单上手

使用 npm 命令`npm i helux-mini`安装`helux-mini`，然后调用`createShared`创建共享状态，调用`useShared`使用共享状态，that's all，你已接入`helux-mini`来提升局部状态为共享状态. ✨

```diff
import React from 'react';
+ import { createShared, useShared } from 'helux-mini';
+ const { state: sharedObj } = createShared({a:100, b:2});

function HelloHelux(props: any) {
-  const [state, setState] = React.useState({ a: 100, b: 2 });
+  const [state, setState] = useShared(sharedObj);
   return <div>{state.a}</div>; // 当前组件仅依赖a变更才触发重渲染
}
```

### 配置 actions

配置 `actionsFactory` 选项可创建同步或异步的修改状态函数

```ts
export const store = createShared(
  () => ({ a: 1, b: 2 }),
  {
    actionsFactory: ({ state, setState }) => ({
      changeName() {
        setState({ a: Date.now() }); // 注意：变谁就修改谁即可
      },
      async someCall(label: string) {
        // const b await youApi();
        setState({ b: 2 });
      }
    }),
  },
);
```

组件中使用

```tsx
export function Demo() {
  const { state, actions } = store.useStore();

  return (
    <div>
      stat.a {state.a}
      <button onClick={actions.changeName}>change</button>
    </div>
  );
}
```

### 配置 lifecycle

解决react的useEffect在共享状态里的使用局限性，举个例子，有些状态需要组件初始前willMount或首次挂载后mounted去获取，卸载后清理willUnmount , 如果按照传统思路需要在组件的 useEffect 实现相关代码，但 react 的生命周期只能服务于局部状态，应对共享状态存在天然的不足。

因为对于非共享状态这样做没问题，提升为状态后，这样的代码就行不通了，因为只需要第一个组件发起请求即可，其他的复用，通常我们可以认为使用顶层组件来做这个事情，但这是一个极其脆弱的约定（组件位置随时会变动），同时共享状态何时该清理以便减轻内存消耗也是一个问题。

框架层面提供lifecycle接口可完美解决上述问题（框架内部很容易知道共享状态被多少组件使用中），用户不需要关注组件位置在哪里，如何设计第一个请求再哪里发起，只需要配置 lifecycle 即可。


```ts
export const store2 = createShared(() => ({ a: 1 }), {
  actionsFactory: ({ state, setState }) => ({
    /** 略... */
  }),
  lifecycle: {
    // 第一个使用此共享状态的组件 beforeMount 时触发，其他组件再挂载时不会触发，当所有组件都卸载后若满足条件会重新触发
    mounted(params) {
      // 调用 actions 处理相关逻辑
      // params.actions.xxx('some params');
    },
    // 第一个使用此共享状态的组件 mounted 时触发，其他组件再挂载时不会触发，当所有组件都卸载后若满足条件会重新触发
    beforeMount(params) { },
    // 最后一个使用此共享状态的组件 willUnmount 时触发，多个组件挂载又卸载干净会重新触发
    willUnmount(params) {},
    // setState 之前触发，可用于辅助 console.trace 来查看调用源头
    beforeSetState() {},
  },
});
```

### 创建带 key 的共享状态

创建带 key 的 store，当前多个实体需要共享状态到不同组件并复用一模一样的 actions 逻辑时，使用 `createKeyedShared` 创建带 key 共享状态

```ts
export const store = createKeyedShared(
  () => ({ name: 1 }),
  {
    actionsFactory: ({ state, setState })=>({ 
      someAction(){
        console.log('state.key'); // 此处能读取到 key
      }
    }),
    storeName: 'Test', // 【可选】配置 store 名称
    lifecycle: { /** 略... */ },
  }
);
```

组件中使用 `store.useStore` 透传 key 即可

```tsx
export function Demo() {
  // 此处透传 key 后，state 里将自动拥有 key 值
  const { state, actions } = store.useStore('someKey');
  return /** 略... */;
```

### 创建响应式对象

用户应该总是优先考试使用 `actionsFactory` 来统一里管理修改状态的行为，此特性用于展示响应性功能。

```ts
const { state: sharedObj, setState } = createShared({ a: 100, b: 2 }, true);
// or
const { state: sharedObj, setState } = createShared({ a: 100, b: 2 }, { enableReactive: true });

// 以下两种写法均可以更新所有使用 `sharedObj.a` 值的组件实例
sharedObj.a++;
setState({ a: sharedObj.a + 1 });
```

## api 详情
查看[api 详情](./API_DETAIL.md)
