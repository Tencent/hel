/**
 * concent 相关的一些公共封装函数
 */
// eslint-disable-next-line
import c2, { cst, getComputed, getState, reducer, useConcent } from 'concent';
import { noop } from 'utils/fn';
import * as demos from './c2HookDemos';

function priBuildCallParams(
  moduleName,
  connect,
  /** @type import('./c2t').Options*/
  options,
) {
  const targetOptions = options || {};
  const { setup, tag, extra, staticExtra, cuDesc, passCuDesc = true, props = {}, ccClassKey } = targetOptions;
  const regOpt = {
    module: moduleName,
    connect,
    setup,
    props,
    tag,
    extra,
    staticExtra,
    cuDesc: null,
  };
  if (passCuDesc) regOpt.cuDesc = cuDesc;
  return { regOpt, ccClassKey };
}

/**
 * 属于某个模块
 * use the target model context you want by passing a module name
 * 如需要全局任意地方可通过 useC2Mod('xx') 导出xx模块上下文来使用，
 * 需要在 src/models/index.js 显式的导出该模块
 * -----------------------[Code example]-----------------------
 * @see {demos.UseC2Mod} - click to see useC2Mod example
 * --------------------------------------------------------------
 * @template { import('types/store').Modules } M
 * @template { import('concent').IAnyObj } P
 * @template { import('./c2t').ValidSetup } Setup
 * @template { import('concent').MultiComputed<any> } CuDesc
 * @template { import('concent').IAnyObj } Extra
 * @template { any } StaticExtra
 * @template { import('./c2t').ValidMapProps } Mp
 * @param { M } moduleName - 所属的模块
 * @param {import('./c2t').Options<P, Setup, CuDesc, Extra, StaticExtra, ValidMapProps>} [options] - 可选参数，见 Options定义
 * @return { import('types/store').CtxM<P, M, import('concent').SettingsType<Setup>,
 * import('concent').ComputedValType<CuDesc>, [Extra, StaticExtra, ReturnType<Mp>]>}
 */
export function useC2Mod(moduleName, options = {}) {
  const { regOpt, ccClassKey } = priBuildCallParams(moduleName, [], options);
  return useConcent(regOpt, ccClassKey);
}

/**
 * 属于某个模块，连接多个模块
 * -----------------------[Code example]-----------------------
 * @see {demos.UseC2ModConn} - click to see useC2ModConn example
 * --------------------------------------------------------------
 * @template { import('types/store').Modules } M
 * @template { Array<import('types/store').Modules> } Conn
 * @template { import('concent').IAnyObj } P
 * @template { import('./c2t').ValidSetup } Setup
 * @template { import('concent').MultiComputed<any> } CuDesc
 * @template { import('concent').IAnyObj } Extra
 * @template { any } StaticExtra
 * @template { import('./c2t').ValidMapProps } Mp
 * @param { M } moduleName - 所属的模块
 * @param { Conn } connect - 连接的其他模块
 * @param {import('./c2t').Options<P, Setup, CuDesc, Extra, StaticExtra, ValidMapProps>} [options] - 可选参数，见 Options定义
 * @return { import('types/store').CtxMConn<P, M, Conn[number], import('concent').SettingsType<Setup>,
 * import('concent').ComputedValType<CuDesc>, [Extra, StaticExtra, ReturnType<Mp>]> }
 */
export function useC2ModConn(moduleName, connect, options = {}) {
  const { regOpt, ccClassKey } = priBuildCallParams(moduleName, connect, options);
  return useConcent(regOpt, ccClassKey);
}

/**
 * 连接多个模块
 * -----------------------[Code example]-----------------------
 * @see {demos.UseC2Conn} - click to see useC2Mod example
 * --------------------------------------------------------------
 * @template { Array<import('types/store').Modules> } Conn
 * @template { import('concent').IAnyObj } P
 * @template { import('./c2t').ValidSetup } Setup
 * @template { import('concent').MultiComputed<any> } CuDesc
 * @template { import('concent').IAnyObj } Extra
 * @template { any } StaticExtra
 * @template { import('./c2t').ValidMapProps } Mp
 * @param { Conn } connect - 连接的其他模块
 * @param {import('./c2t').Options<P, Setup, CuDesc, Extra, StaticExtra, ValidMapProps>} [options] - 可选参数，见 Options定义
 * @return { import('types/store').CtxConn<P, Conn[number], import('concent').SettingsType<Setup>,
 * import('concent').ComputedValType<CuDesc>, [Extra, StaticExtra, ReturnType<Mp>]> }
 */
export function useC2Conn(connect, options = {}) {
  const { regOpt, ccClassKey } = priBuildCallParams(cst.MODULE_DEFAULT, connect, options);
  return useConcent(regOpt, ccClassKey);
}

/**
 * 适用于不属于任何模块，只是设置setup函数的场景
 * @template { import('./c2t').ValidSetup } Setup
 * @template { import('concent').IAnyObj } P
 * @template { import('concent').MultiComputed<any> } CuDesc
 * @template { import('concent').IAnyObj } Extra
 * @template { any } StaticExtra
 * @template { import('./c2t').ValidMapProps } Mp
 * @param {Setup} setup - setup函数
 * @param {import('./c2t').OptionsBase<P, CuDesc, Extra, StaticExtra, ValidMapProps>} [options] - 可选参数，见 Options定义
 * @return { import('types/store').CtxDe<P, import('concent').SettingsType<Setup>,
 * import('concent').ComputedValType<CuDesc>, [Extra, StaticExtra, ReturnType<Mp>]>['settings']}
 */
export function useSetup(setup, options = {}) {
  const mergedOptions = { setup, ...options };
  const { regOpt, ccClassKey } = priBuildCallParams(cst.MODULE_DEFAULT, [], mergedOptions);
  const { settings } = useConcent(regOpt, ccClassKey);
  return settings;
}

/**
 * 为属于某个模块的 ctx 标记类型, 通常使用在class成员变量上 和 setup函数体内
 * 在class组件成员变量使用时不需要传递第三位参数ctx，组件实例化时会由concent注入并替换
 * 在setup函数里使用时，可直接传入已经创建好的ctx
 * @template { import('types/store').Modules } M
 * @template { import('concent').IAnyObj } P
 * @template { import('./c2t').ValidSetup } Setup
 * @template { import('concent').MultiComputed<any> } CuDesc
 * @template { import('concent').IAnyObj } Extra
 * @template { any } StaticExtra
 * @template { import('./c2t').ValidMapProps } Mp
 * @param { M } moduleName - 所属的模块
 * @param {import('./c2t').Options<P, Setup, CuDesc, Extra, StaticExtra, ValidMapProps>} options - 见 Options定义
 * @param { any } ctx - 如有已经创建好的ctx，则需要传入
 * @return { import('types/store').CtxM<P, M, import('concent').SettingsType<Setup>,
 * import('concent').ComputedValType<CuDesc>, [Extra, StaticExtra, ReturnType<Mp>]>}
 */
export function typeCtxM(moduleName, options, ctx = {}) {
  noop(moduleName, options);
  return ctx;
}

/**
 * 为属于某个模块同时也连接了其他模块的 ctx 标记类型, 通常使用在class成员变量上 和 setup函数体内
 * 在class组件成员变量使用时不需要传递第三位参数ctx，组件实例化时会由concent注入并替换
 * 在setup函数里使用时，可直接传入已经创建好的ctx
 * @template { import('types/store').Modules } M
 * @template { Array<import('types/store').Modules> } Conn
 * @template { import('concent').IAnyObj } P
 * @template { import('./c2t').ValidSetup } Setup
 * @template { import('concent').MultiComputed<any> } CuDesc
 * @template { import('concent').IAnyObj } Extra
 * @template { any } StaticExtra
 * @template { import('./c2t').ValidMapProps } Mp
 * @param { M } moduleName - 所属的模块
 * @param { Conn } connect - 连接的其他模块
 * @param {import('./c2t').Options<P, Setup, CuDesc, Extra, StaticExtra, ValidMapProps>} options - 见 Options定义
 * @param { any } ctx - 如有已经创建好的ctx，则需要传入
 * @return { import('types/store').CtxMConn<P, M, Conn[number], import('concent').SettingsType<Setup>,
 * import('concent').ComputedValType<CuDesc>, [Extra, StaticExtra, ReturnType<Mp>]>}
 */
export function typeCtxMConn(moduleName, connect, options, ctx = {}) {
  noop(moduleName, connect, options);
  return ctx;
}

/**
 * 为连接了其他模块的 ctx 标记类型, 通常使用在class成员变量上 和 setup函数体内
 * 在class组件成员变量使用时不需要传递第三位参数ctx，组件实例化时会由concent注入并替换
 * 在setup函数里使用时，可直接传入已经创建好的ctx
 * @template { Array<import('types/store').Modules> } Conn
 * @template { import('concent').IAnyObj } P
 * @template { import('./c2t').ValidSetup } Setup
 * @template { import('concent').MultiComputed<any> } CuDesc
 * @template { import('concent').IAnyObj } Extra
 * @template { any } StaticExtra
 * @template { import('./c2t').ValidMapProps } Mp
 * @param { Conn } connect - 连接的其他模块
 * @param {import('./c2t').Options<P, Setup, CuDesc, Extra, StaticExtra, ValidMapProps>} options - 见 Options定义
 * @param { any } ctx - 如有已经创建好的ctx，则需要传入
 * @return { import('types/store').CtxConn<P, Conn[number], import('concent').SettingsType<Setup>,
 * import('concent').ComputedValType<CuDesc>, [Extra, StaticExtra, ReturnType<Mp>]>}
 */
export function typeCtxConn(connect, options, ctx = {}) {
  noop(cst.MODULE_DEFAULT, connect, options);
  return ctx;
}

/**
 * 为属于默认模块的 ctx 标记类型, 通常使用在class成员变量上 和 setup函数体内
 * 在class组件成员变量使用时不需要传递第三位参数ctx，组件实例化时会由concent注入并替换
 * 在setup函数里使用时，可直接传入已经创建好的ctx
 * @template { import('concent').IAnyObj } P
 * @template { import('./c2t').ValidSetup } Setup
 * @template { import('concent').MultiComputed<any> } CuDesc
 * @template { import('concent').IAnyObj } Extra
 * @template { any } StaticExtra
 * @template { import('./c2t').ValidMapProps } Mp
 * @param {import('./c2t').Options<P, Setup, CuDesc, Extra, StaticExtra, ValidMapProps>} options - 见 Options定义
 * @param { any } ctx - 如有已经创建好的ctx，则需要传入
 * @return { import('types/store').CtxDe<P, import('concent').SettingsType<Setup>,
 * import('concent').ComputedValType<CuDesc>, [Extra, StaticExtra, ReturnType<Mp>]>}
 */
export function typeCtxDe(options, ctx = {}) {
  noop(cst.MODULE_DEFAULT, options);
  return ctx;
}

/**
 * useC2Mod的工厂函数，返回钩子函数的同时，也提供了帮助推导setup函数的ctx参数类型的辅助函数
 * 注意! 此工厂函数仅适用于 setup函数ctx参数不需要感知 props, extra 类型时，方可使用
 * -----------------------[Code example]-----------------------
 * @see {demos.UseC2ModByFactory} - click to see makeUseC2Mod example
 * --------------------------------------------------------------
 * @template { import('types/store').Modules } M
 * @param { M } moduleName - 所属的模块
 */
export function makeUseC2Mod(moduleName) {
  return {
    /**
     * 需要传入的 setup 函数
     * @template { import('concent').IAnyObj } P
     * @template { import('./c2t').ValidSetup } Setup
     * @template { import('concent').MultiComputed<any> } CuDesc
     * @template { import('concent').IAnyObj } Extra
     * @template { any } StaticExtra
     * @template { import('./c2t').ValidMapProps } Mp
     * @param {import('./c2t').Options<P, Setup, CuDesc, Extra, StaticExtra, ValidMapProps>} 【options]
     * - 可选参数，见 Options 定义
     * @return {import('types/store').CtxM<P, M, import('concent').SettingsType<Setup>,
     *    import('concent').ComputedValType<CuDesc>, [Extra, StaticExtra, ReturnType<Mp>]>}
     */
    useC2Mod: (options) => {
      const { regOpt, ccClassKey } = priBuildCallParams(moduleName, [], options);
      return useConcent(regOpt, ccClassKey);
    },
    /**
     * 推导setup函数的ctx参数类型
     * @param {import('concent').ICtxBase} ctx
     * @return {import('types/store').CtxM<P, M>}
     */
    typeCtx: (ctx) => ctx,
  };
}

/**
 * @template { import('types/store').Modules } M
 * @param { M } moduleName - 所属的模块
 * @return { import('types/store').RootState[M] }
 */
export function getModelState(moduleName) {
  return getState(moduleName);
}

/**
 * @template { import('types/store').Modules } M
 * @param { M } moduleName - 所属的模块
 * @return { import('types/store').RootCu[M] }
 */
export function getModelComputed(moduleName) {
  return getComputed(moduleName);
}

/**
 * @return { import('types/store').RootState[typeof cst.MODULE_GLOBAL] }
 */
export function getGlobalState() {
  return getState(cst.MODULE_GLOBAL);
}

/**
 * @return { import('types/store').RootCu[typeof cst.MODULE_GLOBAL] }
 */
export function getGlobalComputed() {
  return getComputed(cst.MODULE_GLOBAL);
}

/**
 * @return { import('types/store').RootState }
 */
export function getRootState() {
  return getState();
}

/** @type { import('types/store').RootRd } */
export const ccReducer = reducer;

export const emit = c2.emit;
