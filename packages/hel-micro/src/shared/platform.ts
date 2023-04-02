import * as core from 'hel-micro-core';
import type { Platform } from 'hel-types';

export function getPlatform(platform?: Platform): Platform {
  return platform || core.getPlatform();
}
