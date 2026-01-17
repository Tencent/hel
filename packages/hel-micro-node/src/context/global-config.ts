import { SERVER_INFO, UPDATE_INTERVAL } from '../base/consts';
import type { ISDKGlobalConfig, ISDKInnerGlobalConfig } from '../base/types';
import { maySet, maySetFn, noop, noopTrue, purifyFn } from '../base/util';

const sdkGlobalConfig: ISDKInnerGlobalConfig = {
  helModulesDir: '',
  helProxyFilesDir: '',
  helLogFilesDir: '',
  strict: true,
  hooks: {
    onInitialHelMetaFetched: noop,
    onHelModLoaded: noop,
    onMessageReceived: noop,
  },
  reporter: {
    reportError: noop,
    reportInfo: noop,
  },
  shouldAcceptVersion: noopTrue,
  enableIntervalUpdate: false,
  intervalUpdateMs: UPDATE_INTERVAL,
  getEnvInfo: () => SERVER_INFO,
  isProd: process.env.SUMERU_ENV === 'formal',
  forceUseMetaBackupFile: false,
  metaBackupFilePath: '',
  isPreloadMode: false,
};

export function mergeGlobalConfig(config: ISDKGlobalConfig) {
  const {
    helModulesDir,
    helProxyFilesDir,
    helLogFilesDir,
    strict = true,
    hooks = {},
    reporter = {},
    shouldAcceptVersion,
    getEnvInfo,
    isProd,
  } = config;
  sdkGlobalConfig.strict = strict;
  maySet(sdkGlobalConfig, 'isProd', isProd);
  maySet(sdkGlobalConfig, 'helLogFilesDir', helLogFilesDir);
  maySet(sdkGlobalConfig, 'helProxyFilesDir', helProxyFilesDir);
  maySet(sdkGlobalConfig, 'helModulesDir', helModulesDir);
  Object.assign(sdkGlobalConfig.hooks, purifyFn(hooks));
  Object.assign(sdkGlobalConfig.reporter, purifyFn(reporter));
  maySetFn(sdkGlobalConfig, 'shouldAcceptVersion', shouldAcceptVersion);
  maySetFn(sdkGlobalConfig, 'getEnvInfo', getEnvInfo);
}

export function markPreloadModeAsTrue() {
  sdkGlobalConfig.isPreloadMode = true;
}

export function getGlobalConfig() {
  return sdkGlobalConfig;
}
