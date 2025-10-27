const ev2cbs = {};

/**
 * 不要在实例里用此处的on方法，凡是与实例相关的事件通知推荐用 concent.emit and on.
 * 只有当事件的执行需要脱离组件时
 * 如 ADD_BG REMOVE_BG这种操作需要用到 services/event
 */
export function on(evName, cb) {
  let cbs = ev2cbs[evName];
  // eslint-disable-next-line
  if (!cbs) cbs = ev2cbs[evName] = [];
  cbs.push(cb);
}

export function emit(evName, ...args) {
  const cbs = ev2cbs[evName];
  if (cbs) {
    cbs.forEach((cb) => cb(...args));
  }
}

export function off(evName) {
  ev2cbs[evName] = [];
}
