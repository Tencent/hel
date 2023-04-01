import { getGlobalThis } from 'hel-micro-core';

function injectDefault(externalItem: any) {
  if (externalItem && !externalItem.default) {
    try {
      // eslint-disable-next-line
      externalItem.default = externalItem;
      // prettier-ignore
    } catch (err: any) {}
  }
  return externalItem;
}

export function bindExternals(externalsObj: Record<string, any>) {
  const globalThis = getGlobalThis();
  Object.keys(externalsObj).forEach((key: string) => {
    const mod = externalsObj[key];
    if (mod) {
      // @ts-ignore
      globalThis[key] = mod;
    }
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
 * 存在以下几种情况时，可调用此接口让子模块顺利复用宿主 react 运行时（注：不存在以下情况调用此接口）
 * -------------------------------------------------
 * 1 宿主是 vite 开发环境，直接读取cdn react会照成 invalid hook call问题，见：https://github.com/vitejs/vite/issues/1584
 * 2 宿主没有配置 externals 外链 cdn react（ 例如在线IDE ）
 * 3 宿主配置的 externals 和子模块没有对齐
 * -------------------------------------------------
 * 不存在上诉情况调用此接口也没事，意味着可以总是调用此接口
 * @param reactRuntimeObj
 */
export function bindReactRuntime(reactRuntimeObj: IReactRuntimeObj) {
  const reactMod = injectDefault(reactRuntimeObj.React);
  const reactDomMod = injectDefault(reactRuntimeObj.ReactDOM);
  const reactIsMod = reactRuntimeObj.ReactIs || null;
  const reactReconcilerMod = reactRuntimeObj.ReactReconciler || null;

  const externalObj = {
    // 让一些采用了旧映射模式的包也能够正常加载
    LEAH_React: reactMod,
    LEAH_ReactDOM: reactDomMod,
    LEAH_ReactIs: reactIsMod,
    LEAH_ReactReconciler: reactReconcilerMod,
    // 对齐社区的挂载 key 名称
    React: reactMod,
    ReactDOM: reactDomMod,
    ReactIs: reactIsMod,
    ReactReconciler: reactReconcilerMod,
  };
  bindExternals(externalObj);
}

/**
 * 宿主调用此接口让子模块可复用宿主的 vue 运行时，详细意义同 bindReactRuntime 描述
 * @param vueRuntimeObj
 */
export function bindVueRuntime(vueRuntimeObj: { Vue: any }) {
  const vueMod = injectDefault(vueRuntimeObj.Vue);
  const externalObj = {
    // 让一些采用了旧映射模式的包也能够正常加载
    LEAH_Vue: vueMod,
    // 对齐社区的挂载 key 名称
    Vue: vueMod,
  };
  bindExternals(externalObj);
}
