import React from 'react';
import { SKIP_CHECK_OBJ } from '../consts';
import { getInternal } from '../helpers/feature';
import type { Dict } from '../typing';
import { useForceUpdate } from './useForceUpdate';

interface IInnerOptions {
  isStable?: boolean;
  [key: string | symbol]: any;
}

export function useObjectInner<T extends Dict = Dict>(
  initialState: T | (() => T),
  options: IInnerOptions,
): [T, (partialState: Partial<T>) => void] {
  const { isStable } = options;
  const [state, setFullState] = React.useState(initialState);
  const unmountRef = React.useRef(false);
  const forceUpdate = useForceUpdate();

  if (!options[SKIP_CHECK_OBJ] && getInternal(initialState)) {
    throw new Error('OBJ_NOT_NORMAL_ERR: can not pass a shared object to useObject!');
  }

  const setState = (partialState: Partial<T>) => {
    if (!unmountRef.current) {
      if (isStable) {
        Object.assign(state, partialState);
        forceUpdate();
      } else {
        setFullState((state) => ({ ...state, ...partialState }));
      }
    }
  };

  React.useEffect(() => {
    unmountRef.current = false; // 防止 StrictMode 写为true
    // cleanup callback，标记组件已卸载
    return () => {
      unmountRef.current = true;
    };
  }, []);
  return [state, setState];
}

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
export function useObject<T extends Dict = Dict>(initialState: T | (() => T), isStable?: boolean): [T, (partialState: Partial<T>) => void] {
  return useObjectInner(initialState, { isStable });
}
