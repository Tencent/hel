import { getGlobalThis, log } from 'hel-micro-core';
import { getLocalStorage } from '../browser/helper';

export function getUserName(options: { userLsKey: string }): string {
  const { userLsKey } = options;
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
    log('[[ getUserName ]] result:', userName);
  } catch (err: any) {
    log('[[ getUserName ]] err:', err);
  }
  return userName;
}
