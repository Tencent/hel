import { IModActionCtx, IRefCtxM, ReducerCallerParams, IReducerFn, IAnyObj } from 'concent';
import { makeUseModel, makeUseModelWithSetup, makeUseModelWithSetupCuf } from 'concent-utils';
// import { RootState, RootCu } from 'types/store';
import state from './state';
import * as reducer from './reducer';

type ModuleState = ReturnType<typeof state>

export const moduleName = 'GeneralTable';

export const modelDesc = {
  state,
  reducer,
};

export const model = { [moduleName]: modelDesc };

export type ModelDesc = typeof modelDesc;
export type ModuleName = typeof moduleName;
export type CallerParams = ReducerCallerParams | [IReducerFn, any];
export type ReducerFn = IReducerFn;
export type St = ModuleState;
// export type RootInfo = { state: RootState, computed: RootCu };
export type RootInfo = { state: {}, computed: {} };
/** 用于描述 reducer 函数第3位参数 actionCtx 的类型 */
export type IAC = IModActionCtx<RootInfo, ModelDesc>;
export type CtxPre<RefCu = IAnyObj, Extra = IAnyObj> = IRefCtxM<RootInfo, IAnyObj, ModelDesc, RefCu, Extra>;

export const useModelWithSetup = makeUseModelWithSetup<RootInfo, ModelDesc>(moduleName);
export const useModelWithSetupCuf = makeUseModelWithSetupCuf<RootInfo, ModelDesc>(moduleName);
export const useModel = makeUseModel<RootInfo, ModelDesc>(moduleName);

export default model;
