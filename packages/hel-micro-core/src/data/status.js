import inner from './util';

export function setVerLoadStatus(appName, loadStatus, options) {
  inner.setVerLoadStatus(appName, loadStatus, 'appName2verLoadStatus', options);
}

export function getVerLoadStatus(appName, options) {
  return inner.getVerLoadStatus(appName, 'appName2verLoadStatus', options);
}

export function setVerStyleStrStatus(appName, loadStatus, options) {
  inner.setVerLoadStatus(appName, loadStatus, 'appName2verStyleFetched', options);
}

export function getVerStyleStrStatus(appName, options) {
  return inner.getVerLoadStatus(appName, 'appName2verStyleFetched', options);
}
