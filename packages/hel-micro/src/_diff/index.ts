import { getGlobalThis, log } from 'hel-micro-core';
import { PLAT_UNPKG } from '../consts/logic';
import { getLocalStorage } from '../util';

export function getDefaultPlatform(inputPlatform?: string) {
  return inputPlatform || PLAT_UNPKG;
}

export function guessUserName(userLsKey: string): string {
  let userName = getLocalStorage().getItem(userLsKey) || '';
  if (userName) {
    return userName;
  }

  try {
    const map: Record<string, string> = {};
    getGlobalThis()
      .document.cookie.split(';')
      .forEach((kvStr) => {
        const [k, v] = kvStr.split('=');
        map[k] = v;
      });
    userName = map[userLsKey] || '';
  } catch (err) {
    log('[[ guessUserName ]]', err);
  }
  return userName;
}
