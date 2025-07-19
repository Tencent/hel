
exports.getLocaleTime = function () {
  return new Date().toLocaleString();
};

exports.getLogTimeLine = function () {
  return `Log time: ${exports.getLocaleTime()}\n`;
};
