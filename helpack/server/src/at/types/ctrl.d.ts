import { ICuteExpressCtx } from './index';
import { SubAppVersion, SubAppInfo } from './domain';

declare function jsonUpload(ctx: ICuteExpressCtx<
  {},// query type
  {},// params type
  { fileName: string, jsonData: object } // body type
>): any;
export type JsonUpload = typeof jsonUpload;

declare function jsonGet(ctx: ICuteExpressCtx<
  { url: string },// query type
  {}, // params type
  {} // body type
>): any;
export type JsonGet = typeof jsonGet;

declare function secGet(ctx: ICuteExpressCtx<
  {},
  { sysName: string },
  {}
>): any;
export type SecGet = typeof secGet;

export namespace appCtrl {

  export interface getSubApp {
    (ctx: ICuteExpressCtx<{
      name: string;
    }>): Promise<SubAppInfo | null>;
  }

  export interface getSubAppVersion {
    (ctx: ICuteExpressCtx<{
      /** 子应用的版本号 */
      ver: string;
      /** default: '0', 0: 不下发 html_content, 1: 下发 html_content */
      content?: '1' | '0',
      /** 排除字段，用,分隔 */
      exclude: string;
    }>): Promise<SubAppVersion>;
  }

  export interface getSubAppAndItsVersion {
    (ctx: ICuteExpressCtx<{
      /** 子应用的版本号 */
      ver: string;
      /** 排除字段，用,分隔 */
      exclude: string;
    }>): Promise<any>;
  }

  export interface getUserVisitAppNames {
    (ctx: ICuteExpressCtx): Promise<string[]>;
  }

}

export namespace appVersionCtrl {

  export interface getSubAppVersionListByName {
    (ctx: ICuteExpressCtx<
      {}, {},
      {
        page: number,
        size: number,
        name: string,
      }
    >): Promise<SubAppVersion[]>;
  }

}

