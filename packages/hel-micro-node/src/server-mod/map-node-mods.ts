import * as fs from 'fs';
import * as path from 'path';
import { PLATFORM } from '../base/consts';
import { COMPILED_PROXY_FILE_TPL, FILE_SUBPATH_LIMIT } from '../base/mod-consts';
import { getHelProxyFilesDir, resolveNodeModPath } from '../base/path-helper';
import type {
  HelModName,
  HelModOrPath,
  HelModPath,
  IFetchModMetaOptions,
  INodeModMapper,
  PkgName,
  Platform,
  PrepareFiles,
} from '../base/types';
import { noop, safeGet, uniqueStrPush } from '../base/util';
import { getSdkCtx } from '../context';
import { formatAndCheckModMapper, getModShape, ICheckData, INodeModData, makeNodeModData } from './map-node-helper';
import { getModByPath } from './mod-ins';
import { extractNameData } from './mod-name';
import { replaceTpl } from './mod-tpl-helper';

interface IMapDetail {
  mod2isPreloadTriggered: Record<HelModName, boolean>;
  modOrPath2plat: Record<HelModName | HelModOrPath, string>;
  mod2helModPaths: Record<HelModName, HelModPath[]>;
  helModFileCount: Record<HelModName, number>;
  mod2nodeName: Record<HelModOrPath, PkgName>;
  mod2fetchOptions: Record<HelModOrPath, IFetchModMetaOptions>;
  prepareFilesFns: Record<HelModOrPath, PrepareFiles>;
  proxyFiles: Record<HelModOrPath, string>;
}

function makeMapDetail(): IMapDetail {
  return {
    mod2isPreloadTriggered: {},
    modOrPath2plat: {},
    mod2nodeName: {},
    mod2fetchOptions: {},
    mod2helModPaths: {},
    prepareFilesFns: {},
    helModFileCount: {},
    proxyFiles: {},
  };
}

class MapNodeModsManager {
  public nodeName2data: Record<PkgName, INodeModData> = {};
  public mapDetails: Record<Platform, IMapDetail> = { [PLATFORM]: makeMapDetail() };
  public checkData: ICheckData = { modVerDict: {}, modApiUrlDict: {} };

  /**
   * 设置node模块与hel模块配置的映射关系
   */
  public setModMapper(modMapper: INodeModMapper) {
    const stdMapper = formatAndCheckModMapper(modMapper, this.checkData);
    Object.keys(stdMapper).forEach((nodeModName) => {
      const val = stdMapper[nodeModName];
      const { prepareFiles, platform = PLATFORM, ver, projId, branch, gray, helpackApiUrl = '' } = val;
      const fallback = Object.assign({ force: false, mod: null, path: '' }, val.fallback || {});
      const fetchOptions = { platform, ver, projId, branch, gray, helpackApiUrl };
      const helModNameOrPath = val.helModName || nodeModName;

      const detail = this.getMapDetail(platform);
      const { mod2nodeName, mod2fetchOptions, modOrPath2plat, mod2helModPaths, prepareFilesFns } = detail;

      // check
      const mappedHelMod = this.getNodeModData(nodeModName).helModName;
      if (mappedHelMod) {
        const errTip =
          `Node module '${nodeModName}' has been mapped to hel module '${mappedHelMod}', `
          + `you can not map it to ${helModNameOrPath} again!`;
        throw new Error(errTip);
      }

      const { helModName } = extractNameData(helModNameOrPath, platform);
      // 确保默认模块名，带子路径的模块名都能取到对应的 node 模块名
      mod2nodeName[helModNameOrPath] = nodeModName;
      mod2nodeName[helModName] = nodeModName;
      mod2fetchOptions[helModName] = fetchOptions;
      modOrPath2plat[helModNameOrPath] = platform;
      modOrPath2plat[helModName] = platform;

      const helModPaths = safeGet<string[]>(mod2helModPaths, helModName, []);
      uniqueStrPush(helModPaths, helModNameOrPath);
      if (prepareFiles) {
        // 把名字，名字带路径的对应 prepareFiles 句柄都记录一下，
        // 多个node模块映射到同一个hel模块不同子路径时，只需要为其中一个配置即可
        prepareFilesFns[helModName] = prepareFiles;
        prepareFilesFns[helModNameOrPath] = prepareFiles;
      }

      const { fnProps, dictProps, isShapeReady } = getModShape(nodeModName, val);
      this.nodeName2data[nodeModName] = makeNodeModData({
        helModName,
        helPath: helModNameOrPath,
        platform,
        fallback,
        fnProps,
        dictProps,
        isShapeReady,
      });
    });
  }

  /**
   * 获取node模块对应的hel代理模块文件路径
   */
  public getProxyFile(pkgName: PkgName, helModOrPath: HelModOrPath, sourceFullPath: string) {
    const { platform } = this.getNodeModData(pkgName);
    const mapDetail = this.getMapDetail(platform);
    const data: any = safeGet(this.nodeName2data, pkgName, { fallback: {} });
    data.rawPath = sourceFullPath;
    const { proxyFiles } = mapDetail;
    let proxyFile = proxyFiles[helModOrPath];
    // file not created
    if (!proxyFile) {
      proxyFile = this.genProxyModFile(pkgName, helModOrPath);
    }

    return proxyFile;
  }

  public getNodeModData(nodeModName: PkgName, allowFake = true): INodeModData {
    const realData = this.nodeName2data[nodeModName];
    if (!realData && !allowFake) {
      throw new Error(`Unmapped node module ${nodeModName}`);
    }

    return realData || makeNodeModData();
  }

  public getMappedPath(nodeModName: PkgName) {
    return this.getNodeModData(nodeModName).helPath;
  }

  public isFallbackModExist(nodeModName: PkgName) {
    const { fallback } = this.getNodeModData(nodeModName);
    if (fallback.mod || getModByPath(fallback.path, { allowNull: true }) || resolveNodeModPath(nodeModName, true)) {
      return true;
    }

    return false;
  }

  public isModShapeExist(nodeModName: PkgName) {
    const { isShapeReady } = this.getNodeModData(nodeModName);
    return isShapeReady;
  }

  public getFallbackMod(helModNameOrPath: HelModOrPath, platform: string) {
    const { nodeModName, fallback } = this.getFallbackData(helModNameOrPath, platform);
    const { mod, path } = fallback;
    return mod || getModByPath(path, { allowNull: true }) || getModByPath(nodeModName, { allowNull: true });
  }

  public getFallbackData(helModNameOrPath: HelModOrPath, platform: string) {
    const nodeModName = this.getNodeModName(helModNameOrPath, platform);
    const { fallback } = this.getNodeModData(nodeModName);
    return { fallback, nodeModName };
  }

  public getMappedApiUrl(helModName: HelModName) {
    return this.checkData.modApiUrlDict[helModName] || '';
  }

  /**
   * 获取预设的准备文件函数
   */
  public getPrepareFilesFn(helModNameOrPath: HelModOrPath, platform: string): PrepareFiles {
    const { helModName } = extractNameData(helModNameOrPath, platform);
    const { prepareFilesFns } = this.getMapDetail(platform);
    return prepareFilesFns[helModNameOrPath] || prepareFilesFns[helModName];
  }

  /**
   * 获取hel模块名映射的node模块包名，如获得空字符串表示上传还未映射模块关系就直接调用了 importMod
   */
  public getNodeModName(helModNameOrPath: HelModOrPath, platform: string) {
    const { mod2nodeName } = this.getMapDetail(platform);
    return mod2nodeName[helModNameOrPath] || '';
  }

  public getHelModData(helModName: HelModName, platform = PLATFORM) {
    const mapDetail = this.mapDetails[platform];
    if (!mapDetail) {
      return null;
    }
    const { mod2nodeName, mod2helModPaths } = mapDetail;
    // nodeModName 为 '' 表示这是一个未通过 node 模块来映射的 hel 模块，
    // 即未调用 mapNodeMods 或 mapAndPreload 函数来映射过
    const nodeModName = mod2nodeName[helModName] || '';
    const helModPaths = mod2helModPaths[helModName] || [];
    if (!helModPaths.length) {
      return null;
    }
    return { nodeModName, helModPaths };
  }

  /**
   * 获取映射 node 模块与 hel 模块关系时的拉取 meta 的请求参数选项
   */
  public getFetchOptions(helModNameOrPath: HelModOrPath, platform: string): IFetchModMetaOptions | null {
    const { mod2fetchOptions } = this.getMapDetail(platform);
    return mod2fetchOptions[helModNameOrPath] || null;
  }

  /**
   * 获取hel模块名下所有映射的hel模块路径
   */
  public getHelModPaths(helModName: HelModName, platform: string) {
    const { mod2helModPaths } = this.getMapDetail(platform);
    return mod2helModPaths[helModName] || [];
  }

  /**
   * 获取映射的 hel 模块名称列表，不传递 onlyUntriggered 或传递 onlyUntriggered=false 时，会获取所有的，
   * 传递 onlyUntriggered=true 时，只返回未触发 preload 流程的 hel 模块名称列表
   */
  public getHelModNames(platform: string, onlyUntriggered?: boolean) {
    const { mod2helModPaths, mod2isPreloadTriggered } = this.getMapDetail(platform);
    const helModNames = Object.keys(mod2helModPaths);
    if (!onlyUntriggered) {
      return helModNames;
    }

    const untriggeredNames: string[] = [];
    helModNames.forEach((name) => {
      if (!mod2isPreloadTriggered[name]) {
        untriggeredNames.push(name);
      }
    });
    return untriggeredNames;
  }

  public setIsPreloadTriggered(helModName: HelModName, platform: string) {
    const { mod2isPreloadTriggered } = this.getMapDetail(platform);
    mod2isPreloadTriggered[helModName] = true;
  }

  /**
   * 根据 MOD_TPL 模板生成新的代理模块文件
   */
  private genProxyModFile(nodeModName: PkgName, helModOrPath: HelModOrPath) {
    const { platform } = this.getNodeModData(nodeModName);
    const { helModName, proxyFileName } = extractNameData(helModOrPath, platform);
    const detail = this.getMapDetail(platform);
    if (this.getProxyFileCount(helModName, platform) === FILE_SUBPATH_LIMIT) {
      throw new Error(`Too much sub path for ${helModName}, currently limit ${FILE_SUBPATH_LIMIT}`);
    }

    let content = COMPILED_PROXY_FILE_TPL;
    content = replaceTpl(content, nodeModName);

    // 生成代理文件名称，并将代理模块内容写入到对应文件里
    const proxyFilePath = path.join(getHelProxyFilesDir(), proxyFileName);
    fs.writeFileSync(proxyFilePath, content);

    // 记录 hel 模块名和代理模块路径的映射关系
    detail.proxyFiles[helModOrPath] = proxyFilePath;
    this.getNodeModData(nodeModName).proxyFilePath = proxyFilePath;
    this.incProxyFileCount(helModName, platform);

    return proxyFilePath;
  }

  /**
   * 对hel模块对应的导出文件数量加1
   */
  private incProxyFileCount(helMod: HelModName, platform: string) {
    const { helModFileCount } = this.getMapDetail(platform);
    if (!helModFileCount[helMod]) {
      helModFileCount[helMod] = 1;
    } else {
      helModFileCount[helMod] += 1;
    }
  }

  /**
   * 获取hel模块对应的导出文件数量
   */
  private getProxyFileCount(helMod: HelModName, platform: string) {
    const { helModFileCount } = this.getMapDetail(platform);
    return helModFileCount[helMod] || 0;
  }

  private getMapDetail(platform: string) {
    // 未注册平台值的话，内部自动为此平台注册一个处于未激活态的 sdkCtx
    noop(getSdkCtx(platform));
    let mapDetail = this.mapDetails[platform];
    if (!mapDetail) {
      mapDetail = makeMapDetail();
      this.mapDetails[platform] = mapDetail;
    }
    return mapDetail;
  }
}

export const mapNodeModsManager = new MapNodeModsManager();
