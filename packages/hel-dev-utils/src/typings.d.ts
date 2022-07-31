
export interface IInnerSubAppOptions {
  frameworkType: 'react' | 'vue2' | 'vue3' | 'lib';
}

export interface ICreateSubAppOptions {
  externals?: Record<string, any>;
  defaultHomePage?: string;
  /** default: undefined, 需要发布到npm cdn托管元数据时，可设定此值，目前仅支持 unpkg, 后期支持其他 cdn 类型 */
  npmCdnType?: 'unpkg';
}

export interface IGetHelEnvParamsOptions {
  defaultHomePage?: string;
}
