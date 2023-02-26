import * as core from '../deps/helMicroCore';
import type { Platform } from '../deps/helTypes';

export function getPlatform(platform?: Platform): Platform {
  return platform || core.getPlatform();
}

export function getPlatformConfig(platform?: Platform) {
  return core.getPlatformConfig(platform);
}

export function getPlatformHost(platform?: Platform) {
  return core.getPlatformHost(platform);
}
