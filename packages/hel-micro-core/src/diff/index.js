import { PLAT_UNPKG, UNPKG_PREFIX } from '../consts';

const outPrefix = ['ht', 'tps', ':/', '/foo', 'tpri', 'nt.q', 'q.c', 'om/'].join('');

function getApiInnerPrefix(platform) {
  return `${outPrefix}${platform}`;
}

export function getDefaultApiPrefix(platform) {
  if (platform === PLAT_UNPKG) {
    return UNPKG_PREFIX;
  }

  return getApiInnerPrefix();
}
