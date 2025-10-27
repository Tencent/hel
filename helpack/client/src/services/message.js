/* eslint-disable camelcase,no-underscore-dangle */
import { message } from 'antd';

/**
 * key: ${method}_${content}
 * 缓存对应方法的提示回调
 */
const key2tipTimer = {};
const validMethods = ['info', 'error', 'success', 'warn', 'warning'];
const NO_DUP_DURATION = 1200;

function _callMessageMethod(method, cb, content, displayDuration, noDupDuration) {
  if (!validMethods.includes(method)) {
    console.error(`messageService call invalid method[${method}]`);
    return cb('ignored');
  }

  // 直接提示，无重复校验规则
  if (noDupDuration < 0) {
    return cb(message[method](content, displayDuration));
  }

  const key = `${method}_${content}`;
  const tipTimer = key2tipTimer[key];
  if (tipTimer) {
    // 忽略本次提示
    return cb('ignored');
  }

  key2tipTimer[key] = setTimeout(() => {
    delete key2tipTimer[key];
  }, noDupDuration);

  cb(message[method](content, displayDuration));
}

/**
 * 通用的提示方式，动态传参决定提示类型
 * @param {'info'|'error'|'success'|'warn'|'warning'} method
 * @param {React.ReactNode} content
 * @param {number} [displayDuration=2] - 单位：s，提示展现多少s后消失
 * @param {number} [noDupDuration=120] - 单位：ms, 该指定毫秒时间内出现的重复提示会被忽略掉，小于0时无该规则
 * @return {Promise<import('antd/lib/message').MessageType | 'ignored'>}
 */
export function call(method, content, displayDuration = 2, noDupDuration = NO_DUP_DURATION) {
  return new Promise((resolve) => {
    _callMessageMethod(method, resolve, content, displayDuration, noDupDuration);
  });
}

/**
 * 普通提示
 * @param {React.ReactNode} content
 * @param {number} [displayDuration=2] - 单位：s，提示展现多少s后消失
 * @param {number} [noDupDuration=120] - 单位：ms, 该指定毫秒时间内出现的重复提示会被忽略掉，小于0时无该规则
 * @return {Promise<import('antd/lib/message').MessageType | 'ignored'>}
 */
export function info(content, displayDuration = 2, noDupDuration = NO_DUP_DURATION) {
  return new Promise((resolve) => {
    _callMessageMethod('info', resolve, content, displayDuration, noDupDuration);
  });
}

/**
 * 错误提示
 * @param {React.ReactNode} content
 * @param {number} [displayDuration=2] - 单位：s，提示展现多少s后消失
 * @param {number} [noDupDuration=120] - 单位：ms, 该指定毫秒时间内出现的重复提示会被忽略掉，小于0时无该规则
 * @return {Promise<import('antd/lib/message').MessageType | 'ignored'>}
 */
export function error(content, displayDuration = 2, noDupDuration = NO_DUP_DURATION) {
  return new Promise((resolve) => {
    _callMessageMethod('error', resolve, content, displayDuration, noDupDuration);
  });
}

/**
 * @param {React.ReactNode} content
 * @param {number} [displayDuration=2] - 单位：s，提示展现多少s后消失
 * @param {number} [noDupDuration=120] - 单位：ms, 该指定毫秒时间内出现的重复提示会被忽略掉，小于0时无该规则
 * @return {Promise<import('antd/lib/message').MessageType | 'ignored'>}
 */
export function success(content, displayDuration = 2, noDupDuration = NO_DUP_DURATION) {
  return new Promise((resolve) => {
    _callMessageMethod('success', resolve, content, displayDuration, noDupDuration);
  });
}

/**
 * 警告提示
 * @param {React.ReactNode} content
 * @param {number} [displayDuration=2] - 单位：s，提示展现多少s后消失
 * @param {number} [noDupDuration=120] - 单位：ms, 该指定毫秒时间内出现的重复提示会被忽略掉，小于0时无该规则
 * @return {Promise<import('antd/lib/message').MessageType | 'ignored'>}
 */
export function warn(content, displayDuration = 2, noDupDuration = NO_DUP_DURATION) {
  return new Promise((resolve) => {
    _callMessageMethod('warn', resolve, content, displayDuration, noDupDuration);
  });
}

/**
 * 警告提示
 * @param {React.ReactNode} content
 * @param {number} [displayDuration=2] - 单位：s，提示展现多少s后消失
 * @param {number} [noDupDuration=120] - 单位：ms, 该指定毫秒时间内出现的重复提示会被忽略掉，小于0时无该规则
 * @return {Promise<import('antd/lib/message').MessageType | 'ignored'>}
 */
export function warning(content, displayDuration = 2, noDupDuration = NO_DUP_DURATION) {
  return new Promise((resolve) => {
    _callMessageMethod('warning', resolve, content, displayDuration, noDupDuration);
  });
}
