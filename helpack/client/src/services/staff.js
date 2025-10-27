/**
 * rtx 名字服务
 */

import { SEC_STR } from 'configs/constant';
import debounce from 'lodash/debounce';
import { delay } from 'utils/common';
import { signMD5 } from 'utils/sign';
import http from './http';

/**
 * @returns {{en:string, full:string}[]}
 */
function getStaffList() {
  // @ts-ignore
  // eslint-disable-next-line
  return window.top._arrusers || [];
}

let isInitCalled = false;
let isDataReady = false;

export function getIsDataReady() {
  return isDataReady;
}

/**
 * 需要用员工数据的组件，需要在didMount时先调用此方法
 * 该方法会自己会保证只真正的调用一次
 */
export async function initData() {
  if (isInitCalled) {
    while (!isDataReady) {
      await delay(1000);
    }
    return true;
  }
  isInitCalled = true;
  const getUsers = async (start, size) => http.get(`/api/user/getAllUsers?start=${start}&size=${size}`);

  try {
    let users = [];
    const [users1, users2, users3, users4] = await Promise.all([
      getUsers(0, 50000),
      getUsers(50000, 50000),
      getUsers(100000, 50000),
      getUsers(150000, 50000),
    ]);
    users = users.concat(users1).concat(users2).concat(users3).concat(users4);
    window.top._arrusers = users;
    isDataReady = true;
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * 查询用户
 * @param {string} toMatchStr
 */
export function searchUsers(toMatchStr = '') {
  const staffList = getStaffList();
  if (toMatchStr.length < 1) return staffList.slice(0, 20);
  const matchedList = staffList
    .filter((item) => {
      const { full = '' } = item;
      return full.includes(toMatchStr);
    })
    .slice(0, 20);
  return matchedList;
}

/**
 * @type {(toMatchStr:string)=>string[]}
 * 防抖动的用户查询操作
 */
export const delaySearchUsers = debounce(searchUsers, 300);

export async function syncStaff(staffStr, syncType) {
  const timestamp = Date.now();
  const nonce = signMD5(`${SEC_STR}_${timestamp}`);
  const res = await http.post(`/api/helper/syncStaff?timestamp=${timestamp}&nonce=${nonce}`, { staffStr, syncType });
  return res;
}
