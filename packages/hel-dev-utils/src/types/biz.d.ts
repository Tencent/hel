
export interface WuWeiResp<T> {
  code: number;
  data: T[];
}

export interface WuWeiPatchResp {
  code: number;
  data: boolean;
}

export interface CosResp {
  code: number,
  data: {
    msg: string,
    url: string,
  }
}

/**形如：
  { 
    fileAbsolutePath: '/tmp/CmsSubAppBxxxxx.chunk.css',     
    cosDirName: 'om_20200408113805',      
    cosFileRelativePath: '/static/css/35.4288e4f0.chunk.css'
  }
 */
export interface FileDesc {
  /** 文件在构建机容器里所处的绝对路径 */
  fileAbsolutePath: string;
  /** 文件在网络上所处的路径 */
  fileWebPath: string;
  /** 文件在网络上所处的路径（不带host） */
  fileWebPathWithoutHost: string;
}

export interface IExtractOptions {
  appHomePage: string;
  buildDirFullPath: string;
  extractMode: string;
}

export interface IUserExtractOptions {
  buildDirFullPath: string;
  packageJson: Record<string, any>;
  extractMode?: string;
  /** default: hel_dist */
  distDir: ?string;
  /** default: packageJson.name */
  appName?: string;
  /** default: true */
  writeMetaJsonToDist?: boolean;
  /** 形如 https://xxxxx.yy.com/<zoneName>/<relativeDirName> */
  appHomePage?: string;
  /** 未指定 appHomePage 时，内部自动用 npmCdnType 结合 packageJson 拼出 appHomePage */
  npmCdnType?: 'unpkg';
}

