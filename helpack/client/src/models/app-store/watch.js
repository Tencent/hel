/** @typedef {ReturnType<import('./state').getInitialState>} State */
import { lsKeys } from 'configs/constant';

export function listMode(/** @type {State} */ n) {
  localStorage.setItem(lsKeys.LIST_MODE, n.listMode);
}
