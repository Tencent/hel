const path = require('path');

function fmtPath(rawStr) {
  return rawStr.replace(new RegExp('/', 'g'), path.sep);
}

module.exports = {
  fmtPath,
};
