/** args 参数转换的对象 */
export interface IArgObj {
  /** 项目名称 */
  projectName: string;
  /** 模板类型名称 */
  template: string;
  /** 是否拉取内置模板的远端代码 */
  isTplRemote: boolean;
  /** 是否调试模式 */
  isDebug: boolean;
  /** 是否拉取用户自定义的远端模板代码 */
  customTplUrl: string;
}

export interface IConfig {
  /** cli 包名 */
  cliPkgName: string;
  /** cli 版本 */
  cliPkgVersion: string;
  /** cli 使用的内置模板包名 */
  helMonoTemplates: string;
  /** cli 内置模板类型对应的远程仓库地址 */
  repoUrlDict: Record<string, string>;
  /** cli 根据类型拉取通用模板的地址前缀 */
  repoUrlPrefix: string;
  /** cli 短命令 */
  cliKeyword: string;
  /** cli 长命令 */
  cliFullKeyword: string;
  /** cli help信息里的基于xxx构建信息提示 */
  basedOn: string;
}
