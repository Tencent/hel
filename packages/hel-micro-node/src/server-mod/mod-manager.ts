import { ConcurrencyGuard } from '@tmicro/f-guard';
import * as path from 'path';
import { clearModule } from '../base/clear-module';
import { HOOK_TYPE, PLATFORM } from '../base/consts';
import { printWarn } from '../base/logger';
import { recordMemLog, type ILogOptions } from '../base/mem-logger';
import {
  HEL_MDO_PROXY,
  INDEX_JS,
  IS_HEL_MOD_PROXY,
  KEY_DEFAULT,
  KW_NODE_MOD_NAME,
  LIMIT_VER_COUNT,
  MOD_INIT_VER,
} from '../base/mod-consts';
import { getModRootDirData } from '../base/path-helper';
import type {
  IDownloadServerModFilesOptions,
  IGetModDescOptions,
  IMeta,
  IModDesc,
  IModIns,
  IModManagerItem,
  INameData,
  IResolveModResult,
  IWebFileInfo,
} from '../base/types';
import type {
  IInnerImportModByMetaOptions,
  IInnerImportModByMetaSyncOptions,
  IInnerImportModByPathOptions,
  IInnerImportModOptions,
} from '../base/types-srv-mod';
import { isDict, isFn, isValidModule, uniqueStrPush } from '../base/util';
import { isHookValid, triggerHook } from '../context/hooks';
import { maySetToJestMock } from '../test-util';
import { makeMeta } from './fake-meta';
import { delFileOrDir } from './file-helper';
import { mapNodeModsManager } from './map-node-mods';
import { getCustomModIns, getDiskModIns, getDiskModInsByInitPath, getModByPath, getWebModIns, prepareWebModFiles } from './mod-ins';
import { getEnsuredIMBMOptions, getHelModFilePath, getModProxyHelpData, mayInjectApiUrl } from './mod-manager-helper';
import { fetchModMeta } from './mod-meta';
import { extractNameData } from './mod-name';
import { noSlash } from './util';

function log(options: Omit<ILogOptions, 'type'>) {
  recordMemLog({ ...options, type: 'HelServerMod' });
}

/**
 * server 模块管理类
 */
class ModManager {
  /** 模块管理数据映射 */
  public modItemMap: Record<string, IModManagerItem> = {};

  /** 并发守护实例 */
  public guard = new ConcurrencyGuard();

  /** 模块代理缓存 */
  public modProxyCache: Record<string, any> = {};

  /**
   * 获取模块描述，支持传入 hel 模块名或原始模块名，
   * 需注意如果传入的是原始模块名的话，需提前在 mapNodeMod 里映射了调用才会返回有意义的值
   */
  public getModDesc(helModNameOrPath: string, options?: IGetModDescOptions): IModDesc {
    const { platform: plat = PLATFORM } = options || {};
    const { helModName } = extractNameData(helModNameOrPath, plat);
    const modItem = this.getServerModItem(helModName, options);
    if (!modItem) {
      return {
        modName: '',
        modVer: '',
        modDirPath: '',
        modRootDirPath: '',
        modPath: '',
        downloadCount: 0,
        storedVers: [],
        exportedModPaths: {},
        firstDownloadVer: '',
        platform: plat,
      };
    }
    // prettier-ignore
    const {
      modName, modVer, modDirPath, modRootDirPath, modPath, downloadCount,
      storedVers, exportedMods, firstDownloadVer, platform,
    } = modItem;
    const exportedModPaths: Record<string, string> = {};
    exportedMods.forEach((modInfo, key) => (exportedModPaths[key] = modInfo.path));
    // prettier-ignore
    return {
      modName, modVer, modDirPath, modRootDirPath, modPath, downloadCount, storedVers,
      exportedModPaths, firstDownloadVer, platform,
    };
  }

  /**
   * 获取模块版本, 支持传入 hel 模块名或原始模块名
   */
  public getModVer(helModNameOrPath: string, platform: string): string {
    const { helModName } = extractNameData(helModNameOrPath, platform);
    const modItem = this.getServerModItem(helModName, { platform, allowNull: false });
    return modItem.modVer;
  }

  /**
   * 查看映射的 hel 模块路径数据
   * @example
   * 当 mapNodeMod 函数映射的hel模块被激活时，导出的模块路径会指向代理模块，形如：
   * /proj/node_modules/.hel_modules/.proxy/hel-lib-test.js
   */
  public resolveMod(helModNameOrPath: string, platform: string): IResolveModResult {
    const { helModName, helModPath } = extractNameData(helModNameOrPath, platform);
    const modItem = this.getServerModItem(helModName, { platform, allowNull: false });
    const helModInfo = mapNodeModsManager.getHelModData(helModName, platform);
    const isMainMod = helModName === helModPath;
    const { modVer } = modItem;

    if (!helModInfo) {
      return {
        nodeModName: '',
        nodeModFilePath: '',
        helModName,
        helModVer: modVer,
        helModPath,
        helModFilePath: '',
        helModFallbackPath: '',
        isMainMod,
        proxyFilePath: '',
      };
    }

    const { nodeModName } = helModInfo;
    const { rawPath, fallback, proxyFilePath } = mapNodeModsManager.getNodeModData(nodeModName);
    const helModFilePath = getHelModFilePath(helModNameOrPath, modItem);

    return {
      nodeModName,
      nodeModFilePath: rawPath,
      helModName,
      helModVer: modVer,
      helModPath,
      helModFilePath,
      helModFallbackPath: fallback.path,
      isMainMod,
      proxyFilePath,
    };
  }

  /**
   * 同步获取 server 模块，确保模块已被初始化过，此同步方法才可用，
   * 提供 proxy 对象，支持用户在文件头部缓存模块根引用
   * @example 无兜底模块时，不可以在文件头部对模块引用做解构，只能在用的地方现场解构或直接调用
   * ```
   * // good 热更新能生效的写法
   * const someMod = requireMod('my-util');
   *
   * function logic(){
   *   // 直接调用
   *   someMod.callMethod();
   *   // 或写为
   *   const { callMethod } = someMod;
   *   callMethod();
   * }
   *
   * // bad 缓存住了方法引用，导致热更新失效
   * const { callMethod } = requireMod('my-util');
   * ```
   * @example 有兜底模块时，可以提前解构函数、字典对象，内部会自动创建一层包裹
   * ```
   * // ok, 热更新能正常工作，此时的 callMethod 是一个包裹函数，someDict 是一个代理对象
   * const { callMethod, someDict } = requireMod('my-util', { rawMod });
   *
   * // 如一级属性对应 primitive 类型，则不能提前解构，否则导致热更新失效
   * // bad
   * const { someNum } = requireMod('my-util', { rawMod });
   * // good;
   * const mod = requireMod('my-util', { rawMod });
   * mod.someNum; // 用的地方现获取
   *
   * // 故建议一级属性不要暴露原始类型的值，可以统一包裹到一个字典下再导出，例如
   * const { consts } = requireMod('my-util', { rawMod });
   * consts.someNum // consts 会把包裹为一个代理，用的时候才获取，此时热更新能生效
   * ```
   */
  public requireMod<T extends any = any>(helModNameOrPath: string, options?: { platform?: string }): T {
    // 来自占位符调用，返回 {} 即可
    if (KW_NODE_MOD_NAME === helModNameOrPath) {
      return {} as unknown as T;
    }

    const { platform = PLATFORM } = options || {};
    const { fnProps, dictProps, rawMod, rawPath } = getModProxyHelpData(helModNameOrPath, platform);

    const dictKey = this.getDictKey(platform, helModNameOrPath);
    const cachedProxy = this.modProxyCache[dictKey];
    if (cachedProxy) {
      return cachedProxy;
    }

    const nameData = extractNameData(helModNameOrPath, platform);
    const modRef = this.getHelModRef(platform, nameData);
    if (!modRef) {
      // 还未触发过 importMod 就直接调用 requireMod
      throw new Error(`Module ${helModNameOrPath} not preloaded!`);
    }

    const mayWrapVal = (prop: any, wrapType: 'fn' | 'dict') => {
      if ('fn' === wrapType) {
        const fn = (...args: any[]) => {
          const modRef = this.getModRef(platform, nameData, rawMod);
          return modRef[prop](...args);
        };
        return fn;
      }

      if ('dict' === wrapType) {
        return new Proxy(
          {},
          {
            get: (t, dictKey) => {
              const modRef = this.getModRef(platform, nameData, rawMod);
              return modRef[prop][dictKey];
            },
          },
        );
      }

      const modRef = this.getModRef(platform, nameData, rawMod);
      return modRef[prop];
    };

    const modProxy: any = new Proxy(rawMod, {
      get: (target, prop) => {
        // console.log(`return proxy fn for ${helModNameOrPath}`, prop);
        // 兼容上层编译后，以 xxxMod.default.someMethod 发起的调用
        if (KEY_DEFAULT === prop) {
          return modProxy;
        }
        if (HEL_MDO_PROXY === prop) {
          return IS_HEL_MOD_PROXY;
        }
        // ts编译后的特殊属性获取
        // 如: import('some-mod').then
        if (prop === 'then') {
          return target[prop];
        }

        const propStr = prop as string;
        // 命中 fnProps[prop] 和 dictProps[prop] 表示设置了兜底模块或者人工传入了假模块创建规则
        // 这里再包裹一层，可让函数引用、字典引用在文件头部提前解构时，也能做到热更新
        if (fnProps[propStr] || dictProps[propStr]) {
          const wrapType = fnProps[propStr] ? 'fn' : 'dict';
          return mayWrapVal(prop, wrapType);
        }

        const modRef = this.getModRef(platform, nameData, rawMod);
        const val = modRef[prop];
        if (isFn(val) || isDict(val)) {
          const wrapType = isFn(val) ? 'fn' : 'dict';
          return mayWrapVal(prop, wrapType);
        }

        return val;
      },
    });
    // 此处加 default 是为了 es 的多种导入模块语法编译为 js 后也能正常生效
    modProxy.default = modProxy;

    if (rawPath) {
      // 一旦 rawPath 有值，表示调用链路经过原生 import/require 了，缓存住针对这种调用生成的代理对象
      // 后续所有 requireMod 返回结果都复用此对象，代理结果上可看到原始模块的相关属性
      this.modProxyCache[dictKey] = modProxy;
    }

    // 返回服务端代理模块对象
    return modProxy;
  }

  /**
   * 通过 hel 模块信息参数异步导入 server 模块
   */
  public async importModByMeta<T extends any = any>(meta: IMeta, options: IInnerImportModByMetaOptions): Promise<IModIns<T>> {
    const ensuredOptions = getEnsuredIMBMOptions(meta, options);
    const { onFilesReady, reuseLocalFiles, platform, standalone } = ensuredOptions;
    const helModNameOrPath = ensuredOptions.helModNameOrPath || meta.app.name;

    const result = this.tryGetLocalModIns(platform, meta, helModNameOrPath);
    const { modItem, webFile, modIns } = result;
    if (modIns) {
      this.updateModManagerItem(modItem, modIns, { helModNameOrPath, platform });
      return modIns;
    }
    // 本地磁盘不存在模块文件，走一次网络下载，然后再导出
    log({ subType: 'importModByMeta', desc: 'getWebModIns', data: webFile });
    const prepareFiles = ensuredOptions.prepareFiles || mapNodeModsManager.getPrepareFilesFn(helModNameOrPath, platform);
    const webModIns = await getWebModIns(webFile, { meta, prepareFiles, onFilesReady, reuseLocalFiles });
    if (standalone) {
      return webModIns;
    }

    this.updateModManagerItem(modItem, webModIns, { helModNameOrPath, platform, isDownload: true });
    const mod = this.requireMod<T>(ensuredOptions.helModNameOrPath || meta.app.name, ensuredOptions);
    maySetToJestMock(platform, helModNameOrPath, mod);

    return webModIns;
  }

  /**
   * 通过 hel 模块名称异步导入 server 模块
   */
  public async importMod<T extends any = any>(helModNameOrPath: string, options: IInnerImportModOptions) {
    const { platform = PLATFORM, skipMeta, customVer } = options;
    const { helModName } = extractNameData(helModNameOrPath, platform);
    const guardKey = this.getDictKey(platform, helModName);

    let meta: IMeta;
    if (skipMeta) {
      meta = makeMeta(platform, helModName, customVer);
    } else {
      meta = await this.guard.call(guardKey, async () => {
        meta = await fetchModMeta(helModName, mayInjectApiUrl(helModName, options));
        return meta;
      });
    }
    const modIns = await this.importModByMeta<T>(meta, { ...options, helModNameOrPath });

    return modIns;
  }

  /**
   * 通过自定义的同步的准备文件函数准备 server 模块
   */
  public importModByMetaSync<T extends any = any>(meta: IMeta, options: IInnerImportModByMetaSyncOptions) {
    const { helModNameOrPath, prepareFiles, onFilesReady, standalone } = options;
    const platform = options.platform || meta.app.platform || PLATFORM;
    const nameOrPath = helModNameOrPath || meta.app.name;
    const result = this.tryGetLocalModIns<T>(platform, meta, nameOrPath);
    let { modIns } = result;
    if (!modIns) {
      log({ subType: 'importModByMetaSync', desc: 'getCustomModIns' });
      modIns = getCustomModIns(result.webFile, prepareFiles, onFilesReady);
    }
    if (standalone) {
      return modIns;
    }

    this.updateModManagerItem(result.modItem, modIns, { helModNameOrPath: nameOrPath, platform });
    maySetToJestMock(platform, nameOrPath, modIns.mod);

    return modIns;
  }

  /**
   * 根据用户透传的模块初始路径，同步准备 server 模块
   */
  public importModByPath(helModName: string, modInitPath: string, options?: IInnerImportModByPathOptions) {
    const { platform = PLATFORM, ver, standalone } = options;
    const modVer = ver || modInitPath;
    const modIns = getDiskModInsByInitPath(modInitPath, modVer);
    const { mod } = modIns;
    if (standalone) {
      return { mod, isUpdated: false };
    }

    const modItem = this.ensureModItem(platform, helModName);
    let isUpdated = false;
    if (!modItem.storedVers.includes(modVer)) {
      isUpdated = true;
      log({ subType: 'importModByPath', data: { modPath: modIns.modPath, modVer: modIns.modVer } });
      this.updateModManagerItem(modItem, modIns, { helModNameOrPath: helModName, platform });
      maySetToJestMock(platform, helModName, mod);
    }

    return { mod, isUpdated };
  }

  /**
   * 为服务端模块准备相关文件
   */
  public async prepareServerModFiles(helModNameOrPath: string, options?: IDownloadServerModFilesOptions) {
    const { helModName } = extractNameData(helModNameOrPath);
    const { platform = PLATFORM, onFilesReady, reuseLocalFiles } = options || {};
    const result = await this.guard.call(`${helModName}-PSMF`, async () => {
      const meta = await fetchModMeta(helModName, options);
      const { webFile } = this.prepareModParams(platform, meta, helModNameOrPath);
      const modFileInfo = await prepareWebModFiles(webFile, { meta, onFilesReady, reuseLocalFiles });
      return { meta, modFileInfo };
    });

    return result;
  }

  /**
   * 尝试从本地磁盘里获取模块实例
   */
  private tryGetLocalModIns<T extends any = any>(platform: string, meta: IMeta, helModNameOrPath?: string) {
    const logBase = { subType: 'tryGetLocalModIns' };
    const { modItem, webFile } = this.prepareModParams(platform, meta, helModNameOrPath);
    log({ ...logBase, data: { webFile, storedVers: modItem.storedVers } });
    let modIns: IModIns<T> | null = null;
    if (modItem.storedVers.includes(meta.version.sub_app_version)) {
      // 本地磁盘存在模块文件，直接导出即可，如传递了 helModNameOrPath 需保证子路径正确
      // 否则会报错 xxx module not found
      log({ ...logBase, desc: 'getLocalModIns', data: webFile });
      modIns = getDiskModIns(webFile);
    }

    return { modItem, modIns, webFile };
  }

  /**
   * 清理上一个版本的已导出模块内存数据
   */
  private clearPrevModCache(prevModPaths: string[]) {
    // 修复已载入模块被移除的问题，例如以下场景
    // 使用 NODE_PATH='./build' node ./build/index 启动服务，发现透传了
    // prevModPaths=[''] 时导致所有已加载模块会被误清理导致二次加载，故此处需要做严格判定
    const validPaths = prevModPaths.filter((v) => !!v);
    if (!validPaths.length) {
      return;
    }

    // 清理上一个模块的内存数据
    log({ subType: 'clearPrevModCache', desc: 'start clear prev mod data', data: { prevModPaths } });
    prevModPaths.forEach((path) => clearModule(path));
  }

  /**
   * 获取模块引用，优先获取hel模块，不存在则降级为兜底模块
   */
  private getModRef(platform: string, nameData: INameData, backupMod: any) {
    let modRef = this.getHelModRef(platform, nameData);
    if (modRef) {
      return modRef;
    }
    const { helModNameOrPath } = nameData;
    printWarn(`hel module ${helModNameOrPath} not found, try use backup module`);
    modRef = backupMod;
    if (!isValidModule(modRef)) {
      throw new Error(`${platform}: module not found for ${helModNameOrPath}`);
    }
    return modRef;
  }

  /**
   * 获取hel模块引用对象
   */
  private getHelModRef(platform: string, nameData: INameData) {
    const { helModName, relPath } = nameData;
    const modItem = this.getServerModItem(helModName, { platform });
    if (!modItem) {
      return null;
    }

    // 是默认导出模块
    if (!relPath || relPath === INDEX_JS) {
      let mainMod = modItem.mod;
      if (!mainMod) {
        // 可能先激活了子模块，这里根据 modPath 把主模块激活一下
        mainMod = getModByPath(modItem.modPath, { allowNull: true });
        modItem.mod = mainMod;
      }

      return mainMod;
    }

    // 是子路径导出模块
    const { exportedMods, modDirPath: modDir, modPaths } = modItem;
    const modInfo = exportedMods.get(relPath);

    if (modInfo) {
      return modInfo.mod;
    }

    // 可能先激活了主模块，此时获取子模块无 modInfo，现场将子模块激活一下，并生成 modInfo 记录起来
    const modPath = path.join(modDir, relPath);
    const modRef = getModByPath(modPath, { allowNull: true });
    if (modRef) {
      exportedMods.set(relPath, { mod: modRef, path: modPath });
      uniqueStrPush(modPaths, modPath);
    }

    return modRef;
  }

  /**
   * 确保模块对应管理对象存在
   */
  private ensureModItem(platform: string, helModName: string) {
    const dictKey = this.getDictKey(platform, helModName);
    let modItem = this.modItemMap[dictKey];
    if (!modItem) {
      modItem = {
        mod: null,
        modName: helModName,
        modVer: '',
        modDirPath: '',
        modRootDirPath: '',
        modPath: '',
        exportedMods: new Map(),
        modPaths: [],
        storedDirs: [],
        storedVers: [],
        downloadCount: 0,
        firstDownloadVer: '',
        platform,
      };
      this.modItemMap[dictKey] = modItem;
    }
    return modItem;
  }

  /**
   * 为后续逻辑执行准备模块相关参数
   */
  private prepareModParams(platform: string, meta: IMeta, helModNameOrPath?: string) {
    const {
      version: { src_map: srcMap },
      app: { name },
    } = meta;
    const { srvModSrcList = [], srvModSrcIndex } = srcMap;
    // 部分旧数据存储了以 / 结尾不规范的路径，这里做一下额外处理
    const webDirPath = noSlash(srcMap.webDirPath);
    const { modRootDirName, modVer } = getModRootDirData({ meta, platform, webDirPath });

    const webFile: IWebFileInfo = {
      name,
      webDirPath,
      relPath: INDEX_JS,
      urls: srvModSrcList,
      indexUrl: srvModSrcIndex,
      modRootDirName,
      modVer,
    };

    if (helModNameOrPath) {
      const nameData = extractNameData(helModNameOrPath, platform);
      // 保持一致才赋值 relPath
      if (name === nameData.helModName) {
        webFile.relPath = nameData.relPath;
      }
    }
    if (!srvModSrcList.length) {
      throw new Error(`no server mod files for ${name}`);
    }
    const modItem = this.ensureModItem(platform, name);
    return { modItem, webFile };
  }

  /**
   * 清理模块磁盘文件
   */
  private mayClearModDiskFiles(modItem: IModManagerItem) {
    const { storedDirs, storedVers, firstDownloadVer, modRootDirPath } = modItem;

    // 仅对下载模块做文件清理（过滤掉初始版本和第一个下载版本）
    const vers = storedVers.filter((v) => ![firstDownloadVer, MOD_INIT_VER].includes(v));
    // 因保留一个最初下载的版本，故这里使用 LIMIT_VER_COUNT - 1 来判断
    if (vers.length <= LIMIT_VER_COUNT - 1) {
      return;
    }

    // 尝试删最早下载的那个版本（已排除掉初始版本和第一个下载版本）
    const toDelVer = vers[0];
    const idx = storedVers.indexOf(toDelVer);
    const toDelVerDir = path.join(modRootDirPath, toDelVer);
    const dirIndex = storedDirs.indexOf(toDelVerDir);

    const subType = 'mayClearModDiskFiles';
    log({ subType, desc: 'before del dir', data: { toDelVer, idx, dirIndex } });
    const shouldDel = idx >= 0 && dirIndex >= 0;
    if (!shouldDel) {
      log({ subType, desc: 'del noop', data: { toDelVer, idx, dirIndex } });
      return;
    }

    storedVers.splice(idx, 1);
    storedDirs.splice(dirIndex, 1);
    delFileOrDir(toDelVerDir, {
      onSuccess: () => log({ subType, desc: 'del dir done', data: { toDelVerDir } }),
      onFail: (err) => log({ subType, desc: 'del dir err', data: { toDelVerDir, err: err.message } }),
    });
  }

  /**
   * 获取模块管理对象
   */
  private getServerModItem<T extends any = any>(helModName: string, options?: IGetModDescOptions) {
    const { allowNull = true, platform = PLATFORM } = options || {};
    const dictKey = this.getDictKey(platform, helModName);
    const modItem: IModManagerItem<T> = this.modItemMap[dictKey] || null;

    if (!modItem?.mod && !allowNull) {
      // 用户有以下路径可触发 node 模块对应的 hel 微模块被预加载
      // mapAndPreload
      // importNodeMod
      // importNodeModByMeta
      // importNodeModByMetaSync
      // importNodeModByNodePath
      throw new Error(`Mapped hel module ${helModName} not preloaded`);
    }
    return modItem;
  }

  /**
   * 更新模块管理数据
   */
  private updateModManagerItem(
    modItem: IModManagerItem,
    modIns: IModIns,
    options: { helModNameOrPath: string; isDownload?: boolean; platform?: string },
  ) {
    const { mod, modPath, modDirPath, modRootDirPath, modVer, modRelPath, isMainMod, mainModPath } = modIns;
    const { isDownload, platform = PLATFORM, helModNameOrPath } = options || {};
    const subType = 'updateModManagerItem';
    // 同版本更新
    if (modVer === modItem.modVer) {
      log({
        subType,
        desc: 'update same ver',
        data: { modVer, isMainMod, modPath },
      });
      if (isMainMod) {
        // 更新主模块
        Object.assign(modItem, { mod, modPath });
      } else {
        // 更新子路径模块
        modItem.exportedMods.set(modRelPath, { mod, path: modPath });
        uniqueStrPush(modItem.modPaths, modPath);
      }
      return;
    }

    log({
      subType,
      desc: 'update different ver',
      data: { newVer: modVer, prevVer: modItem.modVer, isDownload, isMainMod, modRelPath },
    });
    const prevModPaths = modItem.modPaths.concat(modItem.modPath);
    // clear prev ver exported mod cache
    modItem.exportedMods.clear();
    const base = { modVer, modRootDirPath, modDirPath, modPaths: [] };
    // reset modItem
    if (isMainMod) {
      // 先激活了主模块
      Object.assign(modItem, { mod, modPath, ...base });
    } else {
      // 先激活了子路径模块，这里把主模块路径 mainModPath 先记录下来，方便后续激活主模块时使用
      Object.assign(modItem, { mod: null, modPath: mainModPath, ...base });
      modItem.exportedMods.set(modRelPath, { mod, path: modPath });
      modItem.modPaths.push(modPath);
    }

    const { storedDirs, storedVers } = modItem;
    const modItemVar = modItem;
    if (isDownload) {
      if (!modItem.downloadCount) {
        modItemVar.firstDownloadVer = modVer;
      }
      modItemVar.downloadCount += 1;
    }

    uniqueStrPush(storedDirs, modDirPath);
    uniqueStrPush(storedVers, modVer);

    this.triggerOnModLoadedHook(modItem, helModNameOrPath, platform);
    this.clearPrevModCache(prevModPaths);
    this.mayClearModDiskFiles(modItem);
  }

  private triggerOnModLoadedHook(modItem: IModManagerItem, helModNameOrPath: string, platform: string) {
    if (!isHookValid(HOOK_TYPE.onHelModLoaded, platform)) {
      return;
    }

    const isInitialVersion = !modItem.modPath;
    const { helModName, helModPath, helModVer } = this.resolveMod(helModNameOrPath, platform);
    const pkgName = mapNodeModsManager.getNodeModName(helModNameOrPath, platform);
    triggerHook(HOOK_TYPE.onHelModLoaded, { platform, helModName, helModPath, pkgName, version: helModVer, isInitialVersion }, platform);
  }

  private getDictKey(platform: string, helModNameOrPath: string) {
    return `${platform}/${helModNameOrPath}`;
  }
}

export const modManager = new ModManager();
