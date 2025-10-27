import {
  ICtx, IActionCtx, IAnyObj,
  MODULE_VOID, MODULE_DEFAULT, MODULE_GLOBAL,
  GetRootState, GetRootReducer, GetRootComputed, GetRootReducerCaller, GetRootReducerGhost,
} from 'concent';
import { Models } from './mods';

export type RootState = GetRootState<Models>;

export type RootRd = GetRootReducer<Models>;

export type RootRdCaller = GetRootReducerCaller<Models>;

export type RootRdGhost = GetRootReducerGhost<Models, RootRd>;

export type RootCu = GetRootComputed<Models>;

export type TGlobalSt = RootState[MODULE_GLOBAL];
export type Modules = keyof RootState;


/** util type based on actionCtx */
export type AC<M extends Modules, FullState extends IAnyObj = RootState[M]> = IActionCtx<RootState, RootCu, M, CtxM<{}, M>, FullState>;
// ********************************
// util types based on Ctx
// ********************************

// 从左到右: Extra, StaticExtra, Mapped
type OtherTypes = [any] | [any, any] | [any, any, any];

/** belong one module.  CtxM<P, M, Se, RefCu> */
export type CtxM<P = {}, M extends Modules = MODULE_DEFAULT, Se = {}, RefCu = {}, Ot extends OtherTypes = OtherTypes>
  = ICtx<RootState, RootRd, RootRdCaller, RootRdGhost, RootCu, P, {}, M, MODULE_VOID, Se, RefCu, Ot[2], [Ot[0], Ot[1]]>;

/** belong one module，expand private state.  CtxMS<P, M, St, Se, RefCu>*/
export type CtxMS<P = {}, M extends Modules = MODULE_DEFAULT, St = {}, Se = {}, RefCu = {}, Ot extends OtherTypes = OtherTypes>
  = ICtx<RootState, RootRd, RootRdCaller, RootRdGhost, RootCu, P, St, M, MODULE_VOID, Se, RefCu, Ot[2], [Ot[0], Ot[1]]>;

/** belong one module, connect other modules.  CtxMConn<P, M, Conn, Se, RefCu> */
export type CtxMConn<P = {}, M extends Modules = MODULE_DEFAULT, Conn extends Modules = MODULE_VOID, Se = {}, RefCu = {}, Ot extends OtherTypes = OtherTypes>
  = ICtx<RootState, RootRd, RootRdCaller, RootRdGhost, RootCu, P, {}, M, Conn, Se, RefCu, Ot[2], [Ot[0], Ot[1]]>;

/** belong one module，expand private state, connect other modules.  CtxMSConn<P, M, St, Conn, Se, RefCu>  */
export type CtxMSConn<P = {}, M extends Modules = MODULE_DEFAULT, St = {}, Conn extends Modules = MODULE_VOID, Se = {}, RefCu = {}, Ot extends OtherTypes = OtherTypes>
  = ICtx<RootState, RootRd, RootRdCaller, RootRdGhost, RootCu, P, St, M, Conn, Se, RefCu, Ot[2], [Ot[0], Ot[1]]>;

/** expand private state, connect other modules.  CtxMSConn<P, St, Conn, Se, RefCu>  */
export type CtxSConn<P = {}, St = {}, Conn extends Modules = MODULE_VOID, Se = {}, RefCu = {}, Ot extends OtherTypes = OtherTypes>
  = ICtx<RootState, RootRd, RootRdCaller, RootRdGhost, RootCu, P, St, MODULE_DEFAULT, Conn, Se, RefCu, Ot[2], [Ot[0], Ot[1]]>;

/** expand private state.  CtxMSConn<P, St, Conn, Se, RefCu>  */
export type CtxS<P = {}, St = {}, Se = {}, RefCu = {}, Ot extends OtherTypes = OtherTypes>
  = ICtx<RootState, RootRd, RootRdCaller, RootRdGhost, RootCu, P, St, MODULE_DEFAULT, MODULE_VOID, Se, RefCu, Ot[2], [Ot[0], Ot[1]]>;

/** connect other modules.  CtxConn<P, Conn, Se, RefCu> */
export type CtxConn<P = {}, Conn extends Modules = MODULE_VOID, Se = {}, RefCu = {}, Ot extends OtherTypes = OtherTypes>
  = ICtx<RootState, RootRd, RootRdCaller, RootRdGhost, RootCu, P, IAnyObj, MODULE_DEFAULT, Conn, Se, RefCu, Ot[2], [Ot[0], Ot[1]]>;

/** default series, when no module specified, the component belong to $$default module by default */
export type CtxDe<P = {}, Se = {}, RefCu = {}, Ot extends OtherTypes = OtherTypes>
  = CtxM<P, MODULE_DEFAULT, Se, RefCu, Ot>;
export type CtxDeS<P = {}, St = {}, Se = {}, RefCu = {}, Ot extends OtherTypes = OtherTypes>
  = CtxMS<P, MODULE_DEFAULT, St, Se, RefCu, Ot>;
export type CtxDeSConn<P = {}, St = {}, Conn extends Modules = MODULE_VOID, Se = {}, RefCu = {}, Ot extends OtherTypes = OtherTypes>
  = CtxMSConn<P, MODULE_DEFAULT, St, Conn, Se, RefCu, Ot>;
export type CtxDeConn<P = {}, Conn extends Modules = MODULE_VOID, Se = {}, RefCu = {}, Ot extends OtherTypes = OtherTypes>
  = CtxSConn<P, MODULE_DEFAULT, Conn, Se, RefCu, Ot>;

export type ItemsType<Arr> = Arr extends ReadonlyArray<infer E> ? E : never;

export type Empty = void | null | undefined;
export type MouseEv = React.MouseEvent<HTMLElement>;
export type ChangeEv = React.ChangeEvent<HTMLElement>;
export type VoidPayload = Empty | MouseEv;

