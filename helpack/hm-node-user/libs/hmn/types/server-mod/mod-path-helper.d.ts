import type { IFileDownloadInfo, IGetModRootDirDataOptions, INameData, IWebFileInfo } from '../base/types';
export declare function resolveNodeModPath(nodeModNameOrPath: string): string;
/**
 * 获取 sdk 当前运行时去读取 hel 模块的目录路径
 */
export declare function getHelModulesPath(): string;
/**
 * 递归获得某个目录下的所有文件绝对路径
 */
export declare function getDirFileList(dirPath: any, filePathList?: string[]): string[];
/**
 * 获取hel代理文件存放目录
 */
export declare function getHelProxyFilesDir(): string;
/**
 * 获取hel模块根目录名称
 */
export declare function getModRootDirName(helModName: string, platform?: string): string;
/**
 * 默认逻辑是：判断来自类 helpack 平台则生成 hel+xx-mod 、hel+xx-scope@xx-mod，your-hel+xx-mod，your-hel+xx-scope@xx-mod，
 * 子目录版本则是时间戳非类 helpack 平台则固定生成 npm+xxx-mod、npm+xx-scope@xx-mod，子目录则是 npm 版本号
 */
export declare function getModRootDirData(params: IGetModRootDirDataOptions): {
    modRootDirName: string;
    modVer: string;
};
/**
 * 根据网路根目录和对应文件网络url，提取出带相对路径的目录名称，文件名称
 * @example
 * input:
 *   'https://mat1.gtimg.com/x/y/z/qqnews-pc-dc-test_20250418080738'
 *   'https://mat1.gtimg.com/x/y/z/qqnews-pc-dc-test_20250418080738/srv/static/js/static.js'
 * output:
 *   {relativeDir: 'srv/static/js', fileName: 'static.js'}
 *
 * input:
 *   'https://mat1.gtimg.com/x/y/z/qqnews-pc-dc-test_20250418080738'
 *   'https://mat1.gtimg.com/x/y/z/qqnews-pc-dc-test_20250418080738/xx/yy-js/static.js'
 * output:
 *   {relativeDir: 'xx/yy-js', fileName: 'static.js'}
 */
export declare function getFilePathData(webDirPath: string, url: string): {
    relativeDir: string;
    fileName: string;
    fileRelPath: string;
};
/**
 * hel模块在 helModules 下的根目录路径
 */
export declare function getModRootDirPath(modRootDirName: string): string;
/**
 * 通过网路路径描述对象获取模块路径数据
 */
export declare function getModPathData(webFile: IWebFileInfo): {
    modPath: string;
    modRelPath: string;
    isMainMod: boolean;
    mainModPath: string;
    modDirPath: string;
    modRootDirPath: string;
    modVer: string;
    fileDownloadInfos: IFileDownloadInfo[];
};
/**
 * @example
 * in: 'a/b.js'
 * out: {helModName: 'a', relPath: 'b.js'}
 *
 * in: 'a/d/d1/b.js'
 * out: {helModName: 'a', relPath: 'd/d1/b.js'}
 */
export declare function extractNameData(helModNameOrPath: string, platform?: string): INameData;
