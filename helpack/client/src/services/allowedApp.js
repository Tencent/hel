import { getModelState } from 'services/concent';
import http from 'services/http';
import { signUrlByName } from 'services/shared/sign';

export async function changeAllowed(name, isAllowed) {
  const timestamp = Date.now();
  let url = `/api/v1/allowed-app/${isAllowed ? 'addAllowed' : 'delAllowed'}?name=${name}&timestamp=${timestamp}`;
  url = signUrlByName(url, name, timestamp);

  const result = await http.get(url);
  return result;
}

export async function getIsAppAllowed(name) {
  const timestamp = Date.now();
  let url = `/api/v1/allowed-app/isAllowed?name=${name}&timestamp=${timestamp}`;
  url = signUrlByName(url, name, timestamp);

  const result = await http.get(url);
  return result;
}

export async function refreshAllowedApps() {
  const user = getModelState('portal').userInfo.user;
  const timestamp = Date.now();
  let url = `/api/v1/allowed-app/refresh?user=${user}&timestamp=${timestamp}`;
  url = signUrlByName(url, user, timestamp);

  const result = await http.get(url);
  return result;
}

export async function getAllowedApps() {
  const user = getModelState('portal').userInfo.user;
  const timestamp = Date.now();
  let url = `/api/v1/allowed-app/getList?user=${user}&timestamp=${timestamp}`;
  url = signUrlByName(url, user, timestamp);

  const result = await http.get(url);
  return result;
}
