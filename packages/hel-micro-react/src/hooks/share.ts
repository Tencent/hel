import React from 'react';

export async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * 浅比较两个参数是否一样
 * true: 不一样
 * false: 一样
 */
export function isNotEqualByShallowDiff(param: any, toDiffParam: any) {
  for (let i in param) if (!(i in toDiffParam)) return true;
  for (let i in toDiffParam) if (param[i] !== toDiffParam[i]) return true;
  return false;
}

/**
 * 两者是否一样，true：一样，false：不一样
 * 基于 isNotEqualByShallowDiff 二次封装，以便更好的语义化表达一样的含义
 */
export function isEqual(param: any, toDiffParam: any) {
  return !isNotEqualByShallowDiff(param, toDiffParam);
}

export function useForceUpdate(needJudgeUnmout = false) {
  const [, update] = React.useState({});
  const isHookUnmoutRef = React.useRef(false);
  React.useEffect(() => {
    return () => {
      isHookUnmoutRef.current = true;
    };
  }, []);
  return React.useCallback(() => {
    if (!needJudgeUnmout) {
      return update({});
    }

    const isUnmout = isHookUnmoutRef.current;
    if (!isUnmout) update({});
  }, [needJudgeUnmout]);
}

export function useExecuteCallbackOnce(logicCb: (...args: any[]) => any) {
  const executeFlag = React.useRef(false);
  if (!executeFlag.current) {
    executeFlag.current = true;
    logicCb();
  }
}

export function useObject<T extends Record<string, any> = Record<string, any>>(initialState: T): [T, (partialState: Partial<T>) => void] {
  const [state, setFullState] = React.useState(initialState);
  const unmountRef = React.useRef(false);
  React.useEffect(
    () => () => {
      unmountRef.current = true;
    },
    [],
  );
  return [
    state,
    (partialState: Partial<T>) => {
      if (!unmountRef.current) {
        setFullState((state) => ({ ...state, ...partialState }));
      }
    },
  ];
}
