import React from 'react';

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


export function useForceUpdate() {
  const [, update] = React.useState({});
  return React.useCallback(() => update({}), []);
}


export function useExecuteCallbackOnce(logicCb: (...args: any[]) => any) {
  const executeFlag = React.useRef(false);
  if (!executeFlag.current) {
    executeFlag.current = true;
    logicCb();
  }
}
