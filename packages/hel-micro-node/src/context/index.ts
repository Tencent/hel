import { HEL_API_URL, HEL_SDK_SRC, PLATFORM, SDK_NAME } from '../base/consts';
import type { IAssetNameInfo, IHMNHooks, IPlatformConfig, IPreloadMiddlewareOptions, ISDKPlatContext } from '../base/types';
import { noop, purify, purifyFn, uniqueStrPush } from '../base/util';
import { HEL_SOCKET_URL } from '../mod-view/consts';

function getDefaultHooks() {
  return {
    onInitialHelMetaFetched: noop,
    onHelModLoaded: noop,
    onMessageReceived: noop,
  };
}

let isAddBizHooksCalled = false;

function getRestOptions(passOptions: IPreloadMiddlewareOptions) {
  // @ts-ignore 此处故意 ignore，运行时把用户可能误传的属性剔除，而不是靠静态的类型检查保证安全
  const { mod2conf, modNames, ...rest } = passOptions;
  return rest;
}

export function makeSdkCtx(platform: string, options: { registrationSource?: string; isActive: boolean }): ISDKPlatContext {
  const { registrationSource = '', isActive = false } = options;
  const sdkCtx: ISDKPlatContext = {
    api: {},
    platform,
    registrationSource,
    isActive,
    helpackApiUrl: HEL_API_URL,
    isApiUrlOverwrite: false,
    helpackSocketUrl: HEL_SOCKET_URL,
    helSdkSrc: HEL_SDK_SRC,
    helEntrySrc: '',
    mod2conf: {},
    modNames: [],
    view2assetName: {},
    assetNameInfos: [],
    assetName2view: {},
    view2appName: {},
    careAllModsChange: false,
    isPreloadMode: false,
    helMetaBackupFilePath: '',
    getHelRenderParams: (cbParams) => Promise.resolve({ viewPath: cbParams.viewPath, pageData: cbParams.pageData }),
    regHooks: getDefaultHooks(),
    bizHooks: getDefaultHooks(),
    confHooks: getDefaultHooks(),
    getEnvInfo: () => null,
    shouldAcceptVersion: () => true,
  };
  return sdkCtx;
}

/**
 * 初始时是各种空函数占位，等 initMiddleware 里调用 mergeOptions 后被填充具体相关配置或函数
 */
const defaultSdkCtx = makeSdkCtx(PLATFORM, { registrationSource: SDK_NAME, isActive: true });

const sdkCtxDict: Record<string, ISDKPlatContext> = { [PLATFORM]: defaultSdkCtx };

/**
 * 获取与平台相关的 sdk 上下文对象
 */
export function getSdkCtx(platform = PLATFORM) {
  let sdkCtx = sdkCtxDict[platform];
  if (!sdkCtx) {
    // 获取不到则为此平台注册一个未激活的 sdkCtx
    sdkCtx = makeSdkCtx(platform, { isActive: false });
    sdkCtxDict[platform] = sdkCtx;
  }
  return sdkCtx;
}

export function mergeConfig(config: IPlatformConfig) {
  const sdkCtx = getSdkCtx(config.platform);
  // 只提取规定的有效参数
  const { helpackApiUrl, helpackSocketUrl, careAllModsChange, hooks = {}, helMetaBackupFilePath } = config;
  const toMerge: IPlatformConfig = {
    helpackSocketUrl,
    helpackApiUrl,
    careAllModsChange,
    helMetaBackupFilePath,
  };
  Object.assign(sdkCtx, purify(toMerge));
  Object.assign(sdkCtx.confHooks, purifyFn(hooks));
}

/**
 * 合并用户透传的可选参数，可能会对部分参数做处理后再合并
 */
export function mergeOptions(passOptions: IPreloadMiddlewareOptions) {
  const sdkCtx = getSdkCtx(passOptions.platform);
  const { modNames, mod2conf } = sdkCtx;
  const assetNameInfos: IAssetNameInfo[] = [];
  const assetName2view: Record<string, string> = {};
  const view2appName: Record<string, string> = {};
  const { view2assetName = {} } = passOptions;

  Object.keys(view2assetName).forEach((view) => {
    const assetName = view2assetName[view];
    if (!assetName.includes('/')) {
      throw new Error('assetName must be prefixed with helModName, a valid example may be like this: xxxMod/xxxAssetName');
    }
    const [appName, entryName] = assetName.split('/');
    assetNameInfos.push({ appName, entryName, name: assetName });
    assetName2view[assetName] = view;
    view2appName[view] = appName;
  });

  // 扩展新模块配置的同时，如有需要可覆盖内置的模块配置
  const passMod2conf = passOptions.mod2conf || {};
  Object.keys(passMod2conf).forEach((name) => {
    uniqueStrPush(modNames, name);
    const newConf = passMod2conf[name];
    const storedConf = mod2conf[name];
    if (storedConf) {
      Object.assign(storedConf, newConf);
    } else {
      mod2conf[name] = newConf;
    }
  });

  const rest = getRestOptions(passOptions);
  Object.assign(sdkCtx, rest, { assetNameInfos, assetName2view, view2appName });
}

export function addBizHooks(hooks: IHMNHooks, platform?: string) {
  if (isAddBizHooksCalled) {
    return false;
  }

  const sdkCtx = getSdkCtx(platform);
  Object.assign(sdkCtx.bizHooks, purifyFn(hooks));
  isAddBizHooksCalled = true;
  return true;
}
