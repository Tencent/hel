import { getHelMicroShared } from '../base/microShared';

export function getHelEventBus() {
  return getHelMicroShared().eventBus;
}

export function getUserEventBus() {
  return getHelMicroShared().userEventBus;
}
