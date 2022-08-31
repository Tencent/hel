import { PLAT_UNPKG } from '../consts/logic';

export function getDefaultPlatform(inputPlatform?: string) {
  return inputPlatform || PLAT_UNPKG;
}
