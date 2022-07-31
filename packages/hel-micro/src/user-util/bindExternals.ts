import { getGlobalThis } from 'hel-micro-core';


export function bindExternals(externalsObj: Record<string, any>) {
  const globalThis = getGlobalThis();
  Object.keys(externalsObj).forEach((key: string) => {
    // @ts-ignore
    globalThis[key] = externalsObj[key];
  });
}


interface IReactRuntimeObj {
  /** 对应 react 库 */
  React: any;
  /** 对应 react-dom 库 */
  ReactDOM: any;
  /** 对应 react-is 库 */
  ReactIs: any;
  /** 对应 react-reconciler 库 */
  ReactReconciler: any;
}

/**
 * vite 开发环境下，直接读取cdn react会照成 invalid hook call问题，见：https://github.com/vitejs/vite/issues/1584
 * 通过调用 bindReactRuntime 主动绑定一下即可
 * @param reactRuntimeObj 
 */
export function bindReactRuntime(reactRuntimeObj: IReactRuntimeObj) {
  const externalObj = {
    LEAH_React: reactRuntimeObj.React,
    LEAH_ReactDOM: reactRuntimeObj.ReactDOM,
    LEAH_ReactIs: reactRuntimeObj.ReactIs,
    LEAH_ReactReconciler: reactRuntimeObj.ReactReconciler,
  };
  bindExternals(externalObj);
}

