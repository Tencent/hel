import { setDataset } from '../base/commonUtil';

export function markElFeature(el, platform, appGroupName, appName) {
  setDataset(el, 'plat', platform);
  setDataset(el, 'groupname', appGroupName);
  setDataset(el, 'name', appName);
}
