function lastItem(list) {
  return list[list.length - 1];
}

function lastNItem(list, idx = 1) {
  return list[list.length - idx];
}

module.exports = {
  lastItem,
  lastNItem,
};
