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

export function useForceUpdate(needJudgeUnmout = true) {
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

type Dict = Record<string, any>;
let keySeed = 0;
const mountInfo = new Map<number, { key: number; updater: any; mountCount: number }>();

function useIns() {
  const insRef = React.useRef({ key: 0, updater: null });
  if (!insRef.current.key) {
    keySeed += 1;
    insRef.current.key = keySeed;
  }
  return insRef.current;
}

function updateMountInfo(key: number, updater: any) {
  let info = mountInfo.get(key);
  if (info) {
    info.mountCount = 2;
  } else {
    info = { key, updater, mountCount: 1 };
    mountInfo.set(key, info);
  }

  if (info.mountCount === 2) {
    const prevKey = key - 1;
    mountInfo.set(prevKey, { key: prevKey, updater, mountCount: 1 });
  }
}

function clearMountInfo(key: number) {
  const info = mountInfo.get(key);
  if (info?.mountCount === 2) {
    mountInfo.delete(info.key);
    mountInfo.delete(info.key - 1);
  }
}

export function useObject<T extends Dict = Dict>(initialState: T | (() => T)): [T, (partialState: Partial<T>) => void] {
  const [state, setFullState] = React.useState(initialState);
  const unmountRef = React.useRef(false);
  const ins = useIns();
  const { key } = ins;

  React.useEffect(() => {
    unmountRef.current = false; // 避免 strict mode 双调用机制写为 true
    updateMountInfo(key, setFullState);
    return () => {
      unmountRef.current = true;
      clearMountInfo(key);
    };
  }, []);
  return [
    state,
    (partialState: Partial<T>) => {
      if (!unmountRef.current) {
        const updater = mountInfo.get(key)?.updater || setFullState;
        updater((state: any) => ({ ...state, ...partialState }));
      }
    },
  ];
}
