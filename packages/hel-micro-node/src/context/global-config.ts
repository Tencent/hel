import { UPDATE_INTERVAL } from '../base/consts';
import type { ISDKGlobalBaseConfig, ISDKGlobalConfig } from '../base/types';
import { maySet, maySetFn, noop, purifyFn } from '../base/util';

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
  reporter: {
    reportError: noop,
    reportInfo: noop,
  },
  shouldAcceptVersion: () => true,
  enableIntervalUpdate: false,
  intervalUpdateMs: UPDATE_INTERVAL,
};

export function mergeGlobalConfig(config: ISDKGlobalConfig) {
  const { helModulesDir, helProxyFilesDir, helLogFilesDir, strict = true, hooks = {}, reporter = {}, shouldAcceptVersion } = config;
  sdkGlobalConfig.strict = strict;
  maySet(sdkGlobalConfig, 'helProxyFilesDir', helProxyFilesDir);
  maySet(sdkGlobalConfig, 'helLogFilesDir', helLogFilesDir);
  maySet(sdkGlobalConfig, 'helModulesDir', helModulesDir);
  Object.assign(sdkGlobalConfig.hooks, purifyFn(hooks));
  Object.assign(sdkGlobalConfig.reporter, purifyFn(reporter));
  maySetFn(sdkGlobalConfig, 'shouldAcceptVersion', shouldAcceptVersion);
}

export function getGlobalConfig() {
  return sdkGlobalConfig;
}
