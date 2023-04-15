import React from 'react';
import { useForceUpdate } from './useForceUpdate';

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
export function useObject<T extends Dict = Dict>(
  initialState: T | (() => T),
  isStable?: boolean,
): [T, (partialState: Partial<T>) => void] {
  const [state, setFullState] = React.useState(initialState);
  const unmountRef = React.useRef(false);
  const forceUpdate = useForceUpdate();

  const setState = (partialState: Partial<T>) => {
    if (!unmountRef.current) {
      if (isStable) {
        Object.assign(state, partialState);
        forceUpdate();
      } else {
        setFullState((state) => ({ ...state, ...partialState }));
      }
      // setFullState((state) => ({ ...state, ...partialState }));
    }
  };

  React.useEffect(() => {
    unmountRef.current = false; // 防止 StrictMode 写为true
    // cleanup callback，标记组件已卸载
    return () => {
      unmountRef.current = true;
    };
  }, []);
  return [
    state,
    setState,
  ];
}
