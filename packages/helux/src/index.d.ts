type Dict<T extends any = any> = Record<string, T>;

type SharedObject<T extends Dict = any> = T;

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
  sharedObject: T,
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
};

declare const defaultExport: DefaultExport;
export default defaultExport;
