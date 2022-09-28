/** SrcMap形如：
{
  "iconSrc": "/web-app/sub-apps/news-shelf/favicon.ico",
  "mainCssSrc": "",
  "chunkCssSrcList": [],
}
*/
export interface SrcMap {
  webDirPath: string;
  /** 用于辅助iframe载入子应用入口html地址 */
  iframeSrc: string;
  iconSrc: string;
  mainCssSrc: string;
  privCssSrcList: string[];
  /** 应用包含的所有 css 列表 */
  chunkCssSrcList: string[];
  // 新的资源加载模式，leah-core hel-micro 会优先读取 headAssetList  bodyAssetList，不存在才读其他的
  // {tag:'link', attrs:{href:'', rel:'', as:''}}
  // {tag:'script', attrs:{src:''}}
  headAssetList: string[];
  bodyAssetList: string[];
}
