import * as core from 'hel-micro-core';
import type { Platform } from 'hel-types';

export function getPlatform(platform?: Platform): Platform {
  return platform || core.getPlatform();
}

export function getPlatformConfig(platform?: Platform) {
  return core.getPlatformConfig(platform);
}
