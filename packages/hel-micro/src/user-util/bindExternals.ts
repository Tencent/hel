import { getGlobalThis } from 'hel-micro-core';

function injectDefault(externalItem) {
  if (!externalItem.default) {
    try {
      // eslint-disable-next-line
      externalItem.default = externalItem;
    } catch (err) {}
  }
  return externalItem;
}

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
  ReactIs?: any;
  /** 对应 react-reconciler 库, react-dom 的内部依赖 */
  ReactReconciler?: any;
}

/**
 * vite 开发环境下，直接读取cdn react会照成 invalid hook call问题，见：https://github.com/vitejs/vite/issues/1584
 * 通过调用 bindReactRuntime 主动绑定一下即可
 * @param reactRuntimeObj
 */
export function bindReactRuntime(reactRuntimeObj: IReactRuntimeObj) {
  const externalObj = {
    LEAH_React: injectDefault(reactRuntimeObj.React),
    LEAH_ReactDOM: reactRuntimeObj.ReactDOM,
    LEAH_ReactIs: null,
    LEAH_ReactReconciler: null,
  };
  if (reactRuntimeObj.ReactIs) externalObj.LEAH_ReactIs = reactRuntimeObj.ReactIs;
  if (reactRuntimeObj.ReactReconciler) externalObj.LEAH_ReactReconciler = reactRuntimeObj.ReactReconciler;
  bindExternals(externalObj);
}

/**
 * 方便 vite 开放环境配置共享 vue
 * @param reactRuntimeObj
 */
export function bindVueRuntime(vueRuntimeObj: { Vue: any }) {
  const externalObj = {
    LEAH_Vue: injectDefault(vueRuntimeObj.Vue),
  };
  bindExternals(externalObj);
}
