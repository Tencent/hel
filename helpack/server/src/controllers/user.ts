import { ConcurrencyGuard } from '@tmicro/f-guard';
import { ICuteExpressCtxBase } from 'at/types';
import { isLocal } from 'at/utils/deploy';
import axios from 'axios';
import { models } from 'at/models';
import { getOtherCache, handleStaffChange } from 'services/dataCache';

interface User {
  en: string;
  /** xxx(中文名) */
  full: string;
}

const guard = new ConcurrencyGuard();

interface ParsedUser extends User {
  cnName: string;
}

let cachedUserList: ParsedUser[] = [];
let lastCacheKey = '';
let cachedUserMap: Record<string, ParsedUser> = {};

async function getStaffAndSync(cachedKey: string) {
  let userStr = getOtherCache(cachedKey);
  if (!userStr) {
    userStr = await handleStaffChange(cachedKey);
  }
  return userStr;
}

async function getUsersFromWsd(cachedKey?: string) {
  const parsedUserList: ParsedUser[] = [];
  try {
    const ver = inner.updateCacheKey();
    let userStr = '';
    if (cachedKey) {
      userStr = await getStaffAndSync(cachedKey);
    }
    if (!userStr) {
      const res = await axios.get(`http://some-host.com/js/users.js?v=${ver}`);
      const userOriginalStr = res.data;
      const start = 'var _arrusers = ';
      userStr = userOriginalStr.substring(start.length, userOriginalStr.length - 1);
    }

    // listItem 形如 ['xxx', 'xxx(中文名)']
    let usefulStr = userStr.replace(/'/g, '"');
    usefulStr = userStr.replace(/`/g, '"');
    const userList = JSON.parse(usefulStr) as Array<[string, string]>;

    userList.forEach((user) => {
      const [en, full] = user;
      const leftBraceIdx = full.indexOf('(');
      const parsedUser = { en, full, cnName: full.substring(leftBraceIdx + 1, full.length - 1) };
      parsedUserList.push(parsedUser);
      cachedUserMap[parsedUser.en] = parsedUser;
    });
  } catch (err) {
    console.error(err);
  }

  return parsedUserList;
}

async function getUsersFromCors(remoteCacheKey?: string) {
  const parsedUserList: ParsedUser[] = [];
  try {
    let userList: User[] = [];
    if (remoteCacheKey) {
      const cachedStr = await getStaffAndSync(remoteCacheKey);
      const res = JSON.parse(cachedStr); // cachedStr 形如 { code: number, data: [{en:string, full:string}] }
      userList = res.data;
    } else {
      const res = await axios.get('http://other-host.com/api/v1/getStaff');
      inner.updateCacheKey();
      userList = res.data.data || [];
    }

    userList.forEach((user) => {
      const leftBraceIdx = user.full.indexOf('(');
      const parsedUser = { ...user, cnName: user.full.substring(leftBraceIdx + 1, user.full.length - 1) };
      parsedUserList.push(parsedUser);
      cachedUserMap[user.en] = parsedUser;
    });
  } catch (err) {
    console.error(err);
  }

  return parsedUserList;
}

async function getUsersFromDB(): Promise<ParsedUser[]> {
  try {
    // 从 t_user_infos 表中获取用户信息
    const userRecords = await models.UserInfo.findAll();

    const parsedUserList: ParsedUser[] = [];
    
    for (const record of userRecords) {
      try {
        const full = `${record.en}(${record.cn})`;
        const leftBraceIdx = full.indexOf('(');
        const cnName = `(${record.cn})` || `(默认用户)`;
        
        const parsedUser: ParsedUser = {
          en: record.en || '',
          full,
          cnName
        };
        
        parsedUserList.push(parsedUser);
        cachedUserMap[parsedUser.en] = parsedUser;
      } catch (parseError) {
        console.error(`Error parsing user data for ${record.en}:`, parseError);
      }
    }
    
    return parsedUserList;
  } catch (error) {
    console.error('Error fetching users from database:', error);
    return [];
  }
}

export const inner = {
  getUser(name) {
    return cachedUserMap[name];
  },
  async precacheUsers() {
    if (isLocal()) {
      console.log('---------------------------->[user] isLocal, return empty user list');
      return [];
    }

    let parsedUserList = await getUsersFromWsd();
    if (parsedUserList.length === 0) {
      parsedUserList = await getUsersFromCors();
    }
    if (parsedUserList.length === 0) {
      parsedUserList = await getUsersFromCors('STAFF_STR_corsProxy');
    }
    if (parsedUserList.length === 0) {
      parsedUserList = await getUsersFromCors('STAFF_STR_wsdUsers');
    }
    if (parsedUserList.length === 0) {
      parsedUserList = await getUsersFromDB();
    }
    if (parsedUserList.length > 0) {
      cachedUserList = parsedUserList;
    }
    return parsedUserList;
  },
  tryCutUsers(users: ParsedUser[], options: { start?: string; size?: string }) {
    const { size, start } = options;
    if (size) {
      const startIdx = parseInt(start || '0', 10);
      const sizeNum = parseInt(size, 10);
      return users.slice(startIdx, startIdx + sizeNum);
    }
    return users;
  },
  updateCacheKey() {
    const ver = new Date().toLocaleDateString();
    lastCacheKey = ver;
    return ver;
  },
  async getAllUsers(ctx: ICuteExpressCtxBase): Promise<{ list: ParsedUser[]; count: number; updateTime: string }> {
    const ver = new Date().toLocaleDateString(); // '2021/11/27'
    const { start = '0', size } = ctx.query;
    let shouldUseCache = true;
    if (lastCacheKey !== ver) {
      shouldUseCache = false;
    }

    let list: ParsedUser[] = [];
    if (shouldUseCache && cachedUserList && cachedUserList.length > 0) {
      list = inner.tryCutUsers(cachedUserList, { start, size });
    } else {
      const parsedUserList = await guard.call(ver, inner.precacheUsers);
      list = inner.tryCutUsers(parsedUserList, { start, size });
    }

    return { list, count: cachedUserList.length, updateTime: lastCacheKey };
  },
};

// call precacheUsers when load user mod
inner.precacheUsers();

/** 获取所有用户，支持 start + size 切割获取 */
export const getAllUsers = async (ctx: ICuteExpressCtxBase) => {
  const { count } = ctx.query;
  const result = await inner.getAllUsers(ctx);
  if (count === '1') {
    // 返回命中的总数 {list:[], count:0}
    return result;
  }
  return result.list; // 仅返回list，兼容老的调用方式
};

/** 仅获取用户总数 */
export const getUserCount = async (ctx: ICuteExpressCtxBase) => {
  ctx.query = {};
  const result = await inner.getAllUsers(ctx);
  return { count: result.count, updateTime: lastCacheKey };
};

/** 模糊匹配用户 */
export const searchUser = async (ctx: ICuteExpressCtxBase) => {
  const { name, start = '0', size, count } = ctx.query;
  ctx.query = {}; // 需清空后再传给 getAllUsers
  const { list: allUserList } = await inner.getAllUsers(ctx);
  let matchedUser = allUserList;
  if (name) {
    if (name.includes(',')) {
      // 命中批量查询逻辑，filter 逻辑是将 a,,,,,d 解析出的数组里的空字符串过滤掉
      const nameList = name.split(',').filter((v) => !!v);
      matchedUser = allUserList.filter((user) => {
        const { full: fullName } = user;
        return nameList.some((name) => fullName.includes(name));
      });
    } else {
      matchedUser = allUserList.filter((user) => user.full.includes(name));
    }
  }
  const list = inner.tryCutUsers(matchedUser, { start, size });
  if (count === '1') {
    // 返回命中的总数
    return { list, count: matchedUser.length };
  }
  return list;
};

/** 模糊匹配用户，固定返回格式 {count:number, list: User[]} */
export const searchUserV2 = async (ctx: ICuteExpressCtxBase) => {
  ctx.setQueryValue('count', '1'); // 标识返回数据带 count
  const result = await searchUser(ctx);
  return result;
};

/** 按姓名获取一个用户 */
export const getUser = async (ctx: ICuteExpressCtxBase) => {
  await inner.getAllUsers(ctx);
  return cachedUserMap[ctx.query.name];
};

/** 按姓名获取多个用户，用逗号分割多个姓名 */
export const getUsers = async (ctx: ICuteExpressCtxBase) => {
  await inner.getAllUsers(ctx);
  const nameList = (ctx.query.name || '').split(',');
  const fix = ctx.query.fix === '1' ? true : false;

  const users: ParsedUser[] = [];
  nameList.forEach((name) => {
    const user = cachedUserMap[name];
    if (user) {
      users.push(user);
    } else if (fix) {
      users.push({ en: name, cnName: '', full: name });
    }
  });
  return users;
};
