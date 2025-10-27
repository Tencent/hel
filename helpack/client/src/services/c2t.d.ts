import {
  useConcent,
  reducer,
  getState as getSt,
  getGlobalState as getGst,
  emit,
  ReducerCallerParams,
  IReducerFn,
  IActionCtxBase,
  cst,
  ICtxBase,
  IAnyObj,
  SettingsType,
  ComputedValType,
  SetupFn,
  MultiComputed
} from "concent";
import {
  CtxM,
  CtxMConn,
  CtxConn,
  Modules,
  RootRd,
  RootState,
  CtxDe
} from "../types/store";

export interface ValidSetup {
  (ctx: ICtxBase): IAnyObj | void;
}
export interface ValidMapProps {
  (ctx: ICtxBase): IAnyObj;
}

export interface OptionsBase<
  P extends IAnyObj,
  CuDesc extends MultiComputed<any>,
  Extra extends IAnyObj,
  StaticExtra extends any,
  Mp extends ValidMapProps
  > {
  props?: P;
  tag?: string;
  ccClassKey?: string;
  extra?: Extra;
  staticExtra?: StaticExtra;
  /**
   * 一个遗留的参数，对接useConcent的mapProps，每一轮渲染都会调用，返回结果可通过 ctx.mapped拿到
   */
  mapProps?: Mp;
  cuDesc?: CuDesc;
  /**
   * 是否透传 cuSpec 给 useConcent函数，默认为true，
   * 表示需要透传，此时用户不需要再setup函数体内调用 ctx.computed(cuSpec)
   * 如果用户设置passCuSpec为false，表示传入 cuSpec 仅为了方便推导出refComputed类型，但不透传 cuSpec 给 useConcent函数
   * 注意此时用户需要在 setup函数体内调用 ctx.computed(cuSpec) 来完成示例计算函数的定义，
   * 否则 refComputed 里拿不到真正的计算结果
   */
  passCuDesc?: boolean;
}
export interface Options<
  P extends IAnyObj,
  Setup extends ValidSetup,
  CuDesc extends MultiComputed<any>,
  Extra extends IAnyObj,
  StaticExtra extends any,
  Mp extends ValidMapProps
  > extends OptionsBase<P, CuDesc, Extra, StaticExtra, Mp> {
  setup?: Setup;
}

// without setup
export type OptionsNoSe = Omit<Options, "setup">;
