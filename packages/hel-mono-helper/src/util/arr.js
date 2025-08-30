function lastItem(list) {
  return list[list.length - 1];
}

function lastNItem(list, idx = 1) {
  return list[list.length - idx];
}

function noDupPush(/** @type Array */ list, item) {
  if (!list.includes(item)) {
    list.push(item);
  }
}

function noDupPushCb(/** @type Array */ list, item, pushSuccessCb) {
  if (!list.includes(item)) {
    list.push(item);
    pushSuccessCb();
  }
}

module.exports = {
  lastItem,
  lastNItem,
  noDupPush,
  noDupPushCb,
};
