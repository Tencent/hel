import type { ISDKGlobalBaseConfig, ISDKGlobalConfig } from '../base/types';
import { maySet, maySetFn, noop, purifyFn } from '../base/util';
import { isRunInJest } from '../test-util/jest-env';

const sdkGlobalConfig: ISDKGlobalBaseConfig = {
  helModulesDir: '',
  helProxyFilesDir: '',
  helLogFilesDir: '',
  strict: true,
  hooks: {
    onInitialHelMetaFetched: noop,
    onHelModLoaded: noop,
    onMessageReceived: noop,
  },
  shouldAcceptVersion: () => true,
};

export function mergeGlobalConfig(config: ISDKGlobalConfig) {
  const { helModulesDir, helProxyFilesDir, strict = true, hooks = {}, shouldAcceptVersion } = config;
  sdkGlobalConfig.strict = strict;
  if (isRunInJest() && helProxyFilesDir) {
    // TODO NEW_FEATURE 暂只支持对 jest 开放 helProxyFilesDir 设定功能
    sdkGlobalConfig.helProxyFilesDir = helProxyFilesDir;
  }
  Object.assign(sdkGlobalConfig.hooks, purifyFn(hooks));
  maySet(sdkGlobalConfig, 'helModulesDir', helModulesDir);
  maySetFn(sdkGlobalConfig, 'shouldAcceptVersion', shouldAcceptVersion);
}

export function getGlobalConfig() {
  return sdkGlobalConfig;
}
