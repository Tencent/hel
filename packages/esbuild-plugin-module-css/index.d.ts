export interface IModuleCssOptions {
  /**
   * default: 'src', 源码目录名
   */
  baseSrc?: string;
  /**
   * default: '', 模块css前缀
   */
  moduleCssScopePrefix?: string;
}

/**
 * moduleCss factory
 */
export declare function moduleCss(options?: IModuleCssOptions): { name: string; setup: (...args: any[]) => any };

export default moduleCss;
