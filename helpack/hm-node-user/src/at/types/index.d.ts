import { Request, Response } from 'express';

export interface IAnyObj {
  [key: string]: any;
}
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
  : never;
type GetRestItemsType<A extends Array<any>> = Exclude<A, A[0]>;

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

interface Dictionary<T> {
  [key: string]: T,
}

export type Dict<T = any> = Dictionary<T>;

export interface ICuteExpressCtxBase {
  query: Dictionary<any>;
  params: Dictionary<string>;
  body: Dictionary<any>;
  /**
   * data 必须为 object，模板里可通过 data.xxx 获取到数据
   */
  view: (name: string, data?: object, options?: { layout: boolean }) => any;
  file: (path: string) => any;
  code: (code: string | number, data?: object, msg?: string) => any;
  /** 默认 code 为 -1 */
  errCode: (msg?: string) => any;
  skip: () => any;
  jsonp: (data: any) => any;
  jsonpOutput: (outputData: any) => any;
  /**
   * 原样输出数据给调用方，而不是包裹为 {code, msg, data}
   */
  output: (data) => any;
  req: Request;
  res: Response;
  httpErrorStatus: number;
}

export function controller(ctx: ICuteExpressCtxBase): any;

export type TController = typeof controller;
