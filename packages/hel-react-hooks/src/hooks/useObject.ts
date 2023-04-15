import React from 'react';
type Dict<T extends any = any> = Record<string, T>;

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
export function useObject<T extends Dict = Dict>(initialState: T | (() => T)): [T, (partialState: Partial<T>) => void] {
  const [state, setFullState] = React.useState(initialState);
  const unmountRef = React.useRef(false);
  React.useEffect(() => {
    unmountRef.current = false; // 防止 StrictMode 写为true
    // cleanup callback，标记组件已卸载
    return () => {
      unmountRef.current = true;
    };
  }, []);
  return [
    state,
    (partialState: Partial<T>) => {
      console.log('call setFullState', unmountRef.current);
      if (!unmountRef.current) {
        console.log('call setFullState22', partialState);
        setFullState((state) => ({ ...state, ...partialState }));
      }
    },
  ];
}
