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

export function useExecuteCallbackOnce(logicCb: (...args: any[]) => any) {
  const executeFlag = React.useRef(false);
  if (!executeFlag.current) {
    executeFlag.current = true;
    logicCb();
  }
}

type Dict = Record<string, any>;
let keySeed = 0;

function useIns() {
  const insRef = React.useRef({ key: 0, updater: null });
  if (!insRef.current.key) {
    keySeed += 1;
    insRef.current.key = keySeed;
  }
  return insRef.current;
}

const mountInfo = new Map<number, { key: number; updater: any; mountCount: number; t: number }>();
function updateMountInfo(key: number, updater: any) {
  let info = mountInfo.get(key);
  if (info) {
    info.mountCount = 2;
  } else {
    info = { key, updater, mountCount: 1, t: Date.now() };
    mountInfo.set(key, info);
  }

  if (info.mountCount === 2) {
    const prevKey = key - 1;
    mountInfo.set(prevKey, { key: prevKey, updater, mountCount: 1, t: Date.now() });
  }
}

let limit = 100;
function checkExpireData() {
  if (mountInfo.size < limit) {
    return;
  }
  const map = new Map(mountInfo);
  const now = Date.now();
  let isDel = false;
  map.forEach((value, key) => {
    if (now - value.t > 2000) {
      mountInfo.delete(key);
      isDel = true;
    }
  });
  // 无删除行为则提升下一次检测的上限
  limit = isDel ? 100 : limit + 100;
}

function clearMountInfo(key: number) {
  const info = mountInfo.get(key);
  if (!info) return;
  const mountCount = info.mountCount;
  if (mountCount === 2) {
    mountInfo.delete(key);
    mountInfo.delete(key - 1); // clear prev ghost ins mountInfo
  }
  checkExpireData();
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
        updater({ ...state, ...partialState });
      }
    },
  ];
}

export function useForceUpdate() {
  const [, update] = useObject({});
  return React.useCallback(() => {
    update({});
  }, []);
}
