import { getHelMicroShared } from '../base/microShared';

export function setIgnoreCssPrefix(cssPrefix) {
  const { ignoreCssPrefixList } = getHelMicroShared();
  ignoreCssPrefixList.push(cssPrefix);
}

export function setIgnoreStyleTagKey(nameOrGroupName) {
  const { ignoreStyleTagKey } = getHelMicroShared();
  ignoreStyleTagKey[nameOrGroupName] = 1;
}
