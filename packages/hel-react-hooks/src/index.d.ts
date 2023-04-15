type Dict<T extends any = any> = Record<string, T>;

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

export function useForceUpdate(): void;

type DefaultExport = {
  useObject: typeof useObject;
  useService: typeof useService;
  useForceUpdate: typeof useForceUpdate;
};

declare const defaultExport: DefaultExport;
export default defaultExport;
