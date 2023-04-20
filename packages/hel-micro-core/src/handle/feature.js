import { setDataset } from '../base/commonUtil';

export function markElFeature(/** @type {HTMLElement} */ el, options) {
  const { platform, groupName, name, ver, elName } = options;
  setDataset(el, 'el', elName);
  setDataset(el, 'plat', platform);
  setDataset(el, 'gname', groupName);
  setDataset(el, 'name', name);
  setDataset(el, 'ver', ver);
}
