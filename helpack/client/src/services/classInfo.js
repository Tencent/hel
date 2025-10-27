import { SEC_STR } from 'configs/constant';
import http from 'services/http';
import { signMD5 } from 'utils/sign';

function getNonceData() {
  const timestamp = Date.now();
  const content = `${SEC_STR}_${timestamp}`;
  const nonce = signMD5(content);
  return { timestamp, nonce };
}

export async function getClassInfoList() {
  const { timestamp, nonce } = getNonceData();
  const list = await http.get(`/api/v1/classInfo/list?timestamp=${timestamp}&nonce=${nonce}`);
  return list;
}

export async function getClassInfoById(id) {
  const { timestamp, nonce } = getNonceData();
  const classInfo = await http.get(`/api/v1/classInfo/get?timestamp=${timestamp}&nonce=${nonce}&id=${id}`);
  return classInfo;
}

export async function getFullClassInfoById(id) {
  const { timestamp, nonce } = getNonceData();
  const res = await http.get(`/api/v1/classInfo/getFull?timestamp=${timestamp}&nonce=${nonce}&id=${id}`);
  return res;
}

export async function newClassInfo(key, name) {
  const { timestamp, nonce } = getNonceData();
  const reply = await http.post(
    `/api/v1/classInfo/create?timestamp=${timestamp}&nonce=${nonce}`,
    { key, name },
    { returnLogicData: false, check: false },
  );
  return reply;
}

export async function updateClassInfo(key, name) {
  const { timestamp, nonce } = getNonceData();
  const reply = await http.post(
    `/api/v1/classInfo/update?timestamp=${timestamp}&nonce=${nonce}`,
    { key, name },
    { returnLogicData: false, check: false },
  );
  return reply;
}
