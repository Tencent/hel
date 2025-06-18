
function isHelMode() {
  return process.env.HEL === '1';
}

function isBuild() {
  return process.env.FOR_BUILD === '1';
}

function isHelBuild() {
  return isHelMode() && isBuild();
}

function isHelStart() {
  return process.env.HEL_START === '1';
}

module.exports = {
  isHelMode,
  isBuild,
  isHelBuild,
  isHelStart,
};
