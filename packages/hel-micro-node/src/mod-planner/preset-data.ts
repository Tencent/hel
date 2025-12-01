import type { IMeta, IModInfo } from '../base/types';
import type { IInnerImportModByMetaOptions, IInnerImportModByMetaSyncOptions } from '../base/types-srv-mod';
import { uniqueStrPush, xssFilter } from '../base/util';
import { getSdkCtx } from '../context';
import { getEnsuredModConf, isModMapped, shouldAcceptVersion } from '../context/facade';
import { mapNodeModsManager } from '../server-mod/map-node-mods';
import { modManager } from '../server-mod/mod-manager';
import { getBackupModInfo } from '../server-mod/mod-meta-backup';
import { checkServerModFile, log, updatePageAssetCache, checkPresetDataInit } from './preset-data-helper';

type AssetMap = Record<string, { css: string; js: string } | null>;

interface IUpdateServerModOptions {
  mustBeServerMod?: boolean;
  importOptions?: IInnerImportModByMetaOptions;
}

interface IUpdateServerModSyncOptions {
  mustBeServerMod?: boolean;
  importOptions?: IInnerImportModByMetaSyncOptions;
}

/**
 * 预置数据逻辑类，内部有两个场景会用到：
 * 1 供中间件使用，需要把数据某些 hel 模块的加工数据透传给模板引擎时，会调用此类
 * 2 监听到版本变化时，由此类来响应变化的信号，执行 client 和 server 端模块相关更新动作
 */
export class PresetData {
  /** 服务于 planner */
  public isForPlanner = false;

  public modInfoCache: Record<string, IModInfo> = {};

  /** 可下发到首页的 hel 元数据缓存 */
  public metaCache: Record<string, IMeta> = {};

  /** 已生成的元数据字符串 */
  public metaStr = '';

  /** css 含link的字符串缓存 */
  public cssCache: Record<string, string> = {};

  /** 已生成的样式字符串 */
  public cssLinkStr = '';

  /** hel-entry js sdk 缓存 */
  public helEntryCache: Record<string, string> = {};

  /** 模板名对应的产物数据, key: 模板名（ xxx.ejs ），value：产物对象 */
  public viewAssetCache: AssetMap = {};

  /** 入口名对应的产物数据, key: 带模块前缀的入口名（ xxxMod/yyy ），value：产物对象 */
  public entryAssetCache: AssetMap = {};

  /** 需预拉取 js 的模块元数据缓存 */
  public preloadMetaCache: Record<string, IMeta> = {};

  /** 已生成的需预拉取的 js link 字符串 */
  public preloadJsStr = '';

  constructor(options?: { isForPlanner?: boolean }) {
    const { isForPlanner = false } = options || {};
    this.isForPlanner = isForPlanner;
    checkPresetDataInit(isForPlanner);
  }

  /**
   * 服务于 initMiddleware 同步流程，此模式下优先更新客户端模块，
   * 顺带检查服务端模块是否存在，如存在则异步更新，适用于前后端模块版本可短时间不一致的场景
   */
  public updateForClient(platform: string, modInfo: IModInfo) {
    if (!this.canUpdate(platform, modInfo)) {
      return false;
    }
    this.setModInfo(modInfo);
    this.updateClientMod(platform, modInfo);
    // 来着 planner 调用才允许更新 server 模块
    if (this.isForPlanner) {
      this.updateServerModSync(platform, modInfo);
    }
  }

  /**
   * 优先更新服务端模块数据，服务于 mapAndPreload、 preloadMiddleware 异步流程，此模式下优先更新服务端模块（如存在），
   * 更新成功后再更新客户端模块数据（预埋在首页里下发给前端hel-micro sdk使用的相关hel数据），
   * 适用于需要前后端模块版本强一致的场景
   */
  public async updateForServerFirst(platform: string, modInfo: IModInfo, options?: IUpdateServerModOptions) {
    if (!this.canUpdate(platform, modInfo)) {
      log({ subType: 'updateForServerFirst', desc: `${modInfo.name} canUpdate is false` });
      return false;
    }

    let isServerNodUpdated = false;
    // 来着 planner 调用才允许更新 server 模块
    if (this.isForPlanner) {
      isServerNodUpdated = await this.updateServerMod(platform, modInfo, options);
      if (isServerNodUpdated) {
        this.setModInfo(modInfo);
      }
    }
    this.updateClientMod(platform, modInfo);

    return isServerNodUpdated;
  }

  public updateForServerFirstSync(platform: string, modInfo: IModInfo, options?: IUpdateServerModSyncOptions) {
    if (!this.canUpdate(platform, modInfo)) {
      log({ subType: 'updateForServerFirstSync', desc: `${modInfo.name} canUpdate is false` });
      return false;
    }
    const isModUpdated = this.updateServerModSync(platform, modInfo, options);
    if (isModUpdated) {
      this.setModInfo(modInfo);
    }
    this.updateClientMod(platform, modInfo);
    return true;
  }

  /**
   * 获取前端下发页面里的 hel 主项目胶水层代码 js
   */
  public getHelPageEntrySrc(modName?: string) {
    const defaultVal = this.helEntryCache.default;
    if (!modName) {
      return defaultVal;
    }

    return this.helEntryCache[modName] || defaultVal;
  }

  /**
   * 获取前端下发页面对应的 js css 资源路径
   */
  public getPageAsset(viewName: string, helEntry?: string) {
    const { entryAssetCache, viewAssetCache } = this;
    // 查不到具体入口资源是，查 index 兜底（约定了 index 入口作为合并入口）
    const viewAsset = viewAssetCache[viewName] || viewAssetCache.index || { css: '', js: '' };

    if (helEntry) {
      // 用户指定了入口
      return entryAssetCache[helEntry] || viewAsset;
    }

    return viewAsset;
  }

  public getCachedModInfo(modName: string): IModInfo | null {
    return this.modInfoCache[modName] || null;
  }

  /** 尝试更新 hel 模块前端产物预设数据 */
  private updateClientMod(platform: string, modInfo: IModInfo) {
    const modConf = getEnsuredModConf(modInfo.name, platform);
    if (!modConf) {
      return;
    }

    const { updatePresetMeta, updatePageAsset, extractCssStr, isHelEntry, isDefaultHelEntry, isPreloadJs } = modConf;
    if (updatePresetMeta) {
      this.updatePresetHelMetaStr(modInfo);
    }
    if (extractCssStr) {
      this.updatePresetCssLinkStr(modInfo);
    }
    if (isHelEntry) {
      this.updateHelEntryCache(modInfo, isDefaultHelEntry);
    }
    if (isPreloadJs) {
      this.updatePreloadJsStr(modInfo);
    }
    if (updatePageAsset) {
      updatePageAssetCache(modInfo);
    }
  }

  private setModInfo(modInfo: IModInfo) {
    this.modInfoCache[modInfo.name] = modInfo;
  }

  /** 如存在 server 模块则更新对应模块实例 */
  private async updateServerMod(platform: string, modInfo: IModInfo, options?: IUpdateServerModOptions) {
    const { mustBeServerMod, importOptions } = options || {};
    const shouldContinue = checkServerModFile(modInfo, { mustBeServerMod, label: 'updateServerMod' });
    if (!shouldContinue) {
      return false;
    }

    const { name, fullMeta } = modInfo;
    const sdkCtx = getSdkCtx(platform);
    // 可能使用 mapNodeMods 映射了多个子路径，需要将所有子路径的模块都替换为最新版本
    const helModPaths = mapNodeModsManager.getHelModPaths(name, platform);
    uniqueStrPush(helModPaths, name);
    await Promise.all(
      helModPaths.map(async (helModNameOrPath) => {
        const options: IInnerImportModByMetaOptions = importOptions || {
          platform,
          prepareFiles: sdkCtx.prepareFiles,
          helModNameOrPath,
          standalone: false,
        };
        // 此处触发模块实例被更新到最新版本
        await modManager.importModByMeta(fullMeta, options);
      }),
    );
    return true;
  }

  /** 如存在 server 模块则更新对应模块实例 */
  private updateServerModSync(platform: string, modInfo: IModInfo, options?: IUpdateServerModSyncOptions) {
    const { mustBeServerMod, importOptions } = options || {};
    const shouldContinue = checkServerModFile(modInfo, { mustBeServerMod, label: 'updateServerModSync' });
    if (!shouldContinue) {
      return false;
    }

    const sdkCtx = getSdkCtx(platform);
    const importOptionsVar = importOptions || { prepareFiles: sdkCtx.prepareFiles, standalone: false };
    modManager.importModByMetaSync(modInfo.fullMeta, importOptionsVar);
  }

  /**
   * 能否使用新版本
   */
  private canUseNewVersion(platform: string, modInfo: IModInfo, prevModInfo: IModInfo | null) {
    const newMeta = modInfo.fullMeta;
    const data = mapNodeModsManager.getHelModData(modInfo.name, platform);
    // 取不到 nodeModName 表示这是一个未映射为  node 模块的 hel 模块
    // 调用 preloadMiddleware 或 initMiddleware 配置 hel 模块时会出现此情况
    // 表示这种类型的 hel 模块仅用于预埋到首页下发给前端之用，不参与后台运行
    const { nodeModName = '' } = data || {};

    const helModName = modInfo.name;
    const currentMeta = prevModInfo?.fullMeta || null;
    return shouldAcceptVersion({ platform, currentMeta, newMeta, nodeModName, helModName });
  }

  /**
   * 出现以下状况任意一个，则不能更新：
   * 1 未在用户的模块声明表里
   * 2 模块版本检查失败
   */
  private canUpdate(platform: string, modInfo: IModInfo) {
    const isMapped = isModMapped(platform, modInfo.name);
    if (!isMapped) {
      return false;
    }
    // 非 planner 调用时允许更新，不走其他检查逻辑
    if (!this.isForPlanner) {
      return true;
    }

    const prevModInfo = this.modInfoCache[modInfo.name];
    if (!prevModInfo) {
      return this.canUseNewVersion(platform, modInfo, prevModInfo);
    }

    // 在模块已经加载了情况下，是同一个版本的模块，无需更新，此处比较时间即可
    if (prevModInfo.createTime === modInfo.createTime) {
      return false;
    }

    const defaultModInfo = getBackupModInfo(platform, modInfo.name);
    if (!defaultModInfo) {
      return this.canUseNewVersion(platform, modInfo, prevModInfo);
    }

    // 1 动态下发的模块生成的时间必须大于镜像里的默认模块的时间，才能更新预置数据，
    // 预防开发回滚到过旧版本的前端代码
    // 2 server client 一起发布时，容器里的版本会大于 helpack 的，这时用户会始终读容器里的
    return defaultModInfo.createTime <= modInfo.createTime;
  }

  /**
   * 更新需要在首页预埋的 hel-meta 对象
   */
  private updatePresetHelMetaStr(modInfo: IModInfo) {
    const { metaCache } = this;
    metaCache[modInfo.name] = modInfo.meta;
    this.metaStr = `<script>window.__HEL_PRESET_META__=${JSON.stringify(metaCache)}</script>`;
  }

  /**
   * 获取需要预设的 css link 字符串
   */
  private updatePresetCssLinkStr(modInfo: IModInfo) {
    const { cssCache } = this;
    cssCache[modInfo.name] = modInfo.cssHtmlStr;
    let cssLinkStr = '';
    Object.keys(cssCache).forEach((key) => {
      cssLinkStr += cssCache[key];
    });
    this.cssLinkStr = cssLinkStr;
  }

  /**
   * 更新入口胶水层代码 js 缓存
   */
  private updateHelEntryCache(modInfo: IModInfo, isDefaultHelEntry?: boolean) {
    const { helEntryCache } = this;
    const { chunkJsSrcList } = modInfo.meta.version.src_map;
    const entrySrc = chunkJsSrcList[0] || '';
    if (!entrySrc) {
      return;
    }
    // 后期需要读不同入口时，此 modName 才排上用场，目前统一读 default 对应值
    helEntryCache[modInfo.name] = entrySrc;
    if (isDefaultHelEntry) {
      helEntryCache.default = entrySrc;
    }
  }

  /**
   * 更新需在首页做 js 预拉取的描述字符
   */
  private updatePreloadJsStr(modInfo: IModInfo) {
    const { preloadMetaCache } = this;
    preloadMetaCache[modInfo.name] = modInfo.meta;

    let str = '';
    Object.keys(preloadMetaCache).forEach((key) => {
      const meta = preloadMetaCache[key];
      const { chunkJsSrcList } = meta.version.src_map;
      chunkJsSrcList.forEach((src) => {
        str += `<link rel="preload" href="${xssFilter(src)}" as="script">`;
      });
    });

    this.preloadJsStr = str;
  }
}

/** 服务于 panner 的全局预置数据管理对象 */
export const presetDataMgr = new PresetData({ isForPlanner: true });
