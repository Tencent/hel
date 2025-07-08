function isHelMode() {
  return process.env.HEL === '1';
}

function isHelAllBuild() {
  return process.env.HEL_ALL_BUILD === '1';
}

function isHelStart() {
  return process.env.HEL_START === '1';
}

module.exports = {
  isHelMode,
  isHelAllBuild,
  isHelStart,
};
