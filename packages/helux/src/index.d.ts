import type { Dict, SharedObject } from './typing';

/**
 * 创建共享对象，可透传给 useSharedObject，具体使用见 useSharedObject
 * @param rawState
 * ```
 * const sharedObj = createSharedObject({a:1, b:2});
 * ```
 */
export function createSharedObject<T extends Dict = Dict>(rawState: T | (() => T)): SharedObject<T>;

/**
 *  创建响应式的共享对象，可透传给 useSharedObject
 * ```
 * const [sharedObj, setSharedObj] = createReactiveSharedObject({a:1, b:2});
 * // sharedObj.a = 111; // 任意地方修改 a 属性，触发视图渲染
 * // setSharedObj({a: 111}); // 使用此方法修改 a 属性，同样也能触发视图渲染，深层次的数据修改可使用此方法
 * ```
 */
export function createReactiveSharedObject<T extends Dict = Dict>(
  rawState: T | (() => T),
): [SharedObject<T>, (partialState: Partial<T>) => void];

/**
 *  创建响应式的共享对象，当需要调用脱离函数上下文的服务函数（即不需要感知props时），可使用该接口
 *  第二位参数为是否创建响应式状态，效果同 createReactiveSharedObject 返回的 sharedObj
 *
 * ```
 *  const ret = createShared({ a: 100, b: 2 });
 *  const ret2 = createShared({ a: 100, b: 2 }, true); // 创建响应式状态
 *  // ret.state 可透传给 useSharedObject
 *  // ret.setState 可以直接修改状态
 *  // ret.call 可以调用服务函数，并透传上下文
 * ```
 *  以下将举例两种具体的调用方式
 * ```
 * // 调用服务函数第一种方式，直接调用定义的函数，配合 ret.setState 修改状态
 * function changeAv2(a: number, b: number) {
 *    ret.setState({ a, b });
 * }
 *
 * // 第二种方式，使用 ret.call(srvFn, ...args) 调用定义在call函数参数第一位的服务函数
 * function changeA(a: number, b: number) {
 *    ret.call(async function (ctx) { // ctx 即是透传的调用上下文，
 *      // args：使用 call 调用函数时透传的参数列表，state：状态，setState：更新状态句柄
 *      // 此处可全部感知到具体的类型
 *      // const { args, state, setState } = ctx;
 *      return { a, b };
 *    }, a, b);
 *  }
 * ```
 */
export function createShared<T extends Dict = Dict>(
  rawState: T | (() => T),
  enableReactive?: boolean,
): {
  state: SharedObject<T>;
  call: <A extends any[] = any[]>(
    srvFn: (ctx: { args: A; state: T; setState: (partialState: Partial<T>) => void }) => Promise<Partial<T>> | Partial<T> | void,
    ...args: A
  ) => void;
  setState: (partialState: Partial<T>) => void;
};

/**
 * 使用共享对象
 * ```ts
 * // 在组件外部其他地方创建共享对象
 * const sharedObj = createSharedObject({a:1, b:2});
 * // 然后在任意组件里使用即可
 * const [ obj, setObj ] = useSharedObject(sharedObj);
 * ```
 * @param sharedObject
 * @param enableReactive
 */
export function useSharedObject<T extends Dict = Dict>(
  sharedObject: T | (() => T),
  enableReactive?: boolean,
): [SharedObject<T>, (partialState: Partial<T>) => void];

/**
 * 使用 useObject 有两个好处
 * ```txt
 * 1 方便定义多个状态值时，少写很多 useState
 * 2 内部做了 unmount 判断，让异步函数也可以安全的调用 setState，避免 react 出现警告 :
 * "Called SetState() on an Unmounted Component" Errors
 * ```
 * @param initialState
 * @returns
 */
export function useObject<T extends Dict = Dict>(initialState: T | (() => T)): [T, (partialState: Partial<T>) => void];

/**
 * 是用服务模式开发 react 组件，demo 见：
 * https://codesandbox.io/s/demo-show-service-dev-mode-ikybly?file=/src/Child.tsx
 * https://codesandbox.io/p/sandbox/use-service-to-replace-ref-e5mgr4?file=%2Fsrc%2FApp.tsx
 * @param compCtx
 * @param serviceImpl
 */
export function useService<P extends Dict = Dict, S extends Dict = Dict, T extends Dict = Dict>(
  compCtx: {
    props: P;
    state: S;
    setState: (partialState: Partial<S>) => void;
  },
  serviceImpl: T,
): T & {
  ctx: {
    setState: (partialState: Partial<S>) => void;
    getState: () => S;
    getProps: () => P;
  };
};

/**
 * 强制更新
 */
export function useForceUpdate(): () => void;

type DefaultExport = {
  useObject: typeof useObject;
  useService: typeof useService;
  useSharedObject: typeof useSharedObject;
  useForceUpdate: typeof useForceUpdate;
  createSharedObject: typeof createSharedObject;
  createReactiveSharedObject: typeof createReactiveSharedObject;
  createShared: typeof createShared;
};

declare const defaultExport: DefaultExport;
export default defaultExport;
