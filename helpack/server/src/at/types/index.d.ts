import { Request, Response } from 'express';
import services from '../../services';
import * as pipes from '../pipes';
import dao from '../dao';

export interface IAnyObj { [key: string]: any }
export interface IAnyFn {
  (...args: any): any;
}
/**
 * inspired by
 * https://github.com/pirix-gh/ts-toolbelt/blob/master/src/List/Tail.ts
 */
type C2List<A = any> = ReadonlyArray<A>;
type Tail<L extends C2List> =
  ((...t: L) => any) extends ((head: any, ...tail: infer LTail) => any)
  ? LTail
  : never
type GetRestItemsType<A extends Array<any>> = Exclude<A, A[0]>;
export type PipesType<PipeFns> =
  PipeFns extends IAnyObj ? (
    { [key in keyof PipeFns]:
      (
        PipeFns[key] extends IAnyFn ?
        (p: string) => ReturnType<PipeFns[key]> :
        PipeFns[key]
      )
    }
  ) : {};

export type PipesTypeGood<PipeFns> =
  PipeFns extends IAnyObj ? (
    { [key in keyof PipeFns]:
      (
        PipeFns[key] extends IAnyFn ?
        (...p: GetRestItemsType<Tail<Parameters<PipeFns[key]>>>) => ReturnType<PipeFns[key]> :
        PipeFns[key]
      )
    }
  ) : {};

interface Dictionary<T = any> {
  [key: string]: T,
}

interface InputData {
  query?: Dictionary<string>,
  params?: Dictionary<string>,
  body?: Dictionary<object>,
}

export interface ICuteExpressCtxBase {
  query: Dictionary<string>;
  params: Dictionary<string>;
  body: Dictionary<any>;
  req: Request;
  res: Response;
  /** 中间数据，cute-express 提供给用户在真正的逻辑层之前方便透传额外数据的对象容器 */
  midData: Dictionary<any>;
  view: (name: string, data?: object, options?: { layout: boolean }) => any;
  file: (path: string) => any;
  code: (code: string, data?: object, msg?: string) => any;
  /**
   * 原样输出数据给调用方，而不是包裹为 {code, msg: data}
   */
  output: (outputData: any) => any;
  jsonp: (data: any) => any;
  jsonpCode: (data: any, code: string, msg?: string) => any;
  jsonpOutput: (outputData: any) => any;
  skip: () => any;
  services: typeof services;
  dao: typeof dao;
  pipes: PipesTypeGood<typeof pipes>;
  httpErrorStatus: number;
  setQueryValue: (key: string | number, value: any) => void;
}



export interface ICuteExpressCtx<
  Q extends Dictionary<any> = any, P extends Dictionary<any> = any, B extends Dictionary<any> = any,
> extends ICuteExpressCtxBase {
  query: Q;
  params: P;
  body: B;
}

export type TController<
  Q extends Dictionary<any> = Dictionary, P extends Dictionary<any> = Dictionary, B extends Dictionary<any> = Dictionary,
> = (ctx: ICuteExpressCtx<Q, P, B>) => any;

/**
 * 含返回结果泛型定义
 */
export type TControllerRet<
  Q extends Dictionary<any> = Dictionary, P extends Dictionary<any> = Dictionary,
  B extends Dictionary<any> = Dictionary, Ret extends any = any,
> = (ctx: ICuteExpressCtx<Q, P, B>) => Ret;
