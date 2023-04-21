import { getHelMicroShared } from '../base/microShared';
import { helEvents } from '../consts';

const { STYLE_TAG_ADDED, CSS_LINK_TAG_ADDED } = helEvents;

export function getHelEventBus() {
  return getHelMicroShared().eventBus;
}

export function getUserEventBus() {
  return getHelMicroShared().userEventBus;
}

export const evName = {
  styleTagAdded(groupName) {
    return `${STYLE_TAG_ADDED}/${groupName}`;
  },
  cssLinkTagAdded(host) {
    return `${CSS_LINK_TAG_ADDED}(${host})`;
  },
};
